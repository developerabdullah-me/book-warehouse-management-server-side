const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
// middellware
app.use(cors());
app.use(express.json());
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    console.log("decoded", decoded);
    req.decoded = decoded;
    next();
  });
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.manly.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const ServiceCollection = client.db("warehouse").collection("service");

    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

    app.get("/InventoryItems", async (req, res) => {
      const query = {};
      const cursor = ServiceCollection.find(query);
      const InventoryItems = await cursor.toArray();
      res.send(InventoryItems);
    });
    // get myAddedItems data  from database

    app.get("/myAddedItems", verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      if (email === decodedEmail) {
        const query = { email: email };
        const cursor = ServiceCollection.find(query);
        const InventoryItems = await cursor.toArray();
        res.send(InventoryItems);
      } else {
        res.status(403).send({ message: "Access denied! Forbidden access" });
      }
    });
    // post
    app.post("/myAddedItems", async (req, res) => {
      const newService = req.body;
      const service = await ServiceCollection.insertOne(newService);
      res.send(service);
    });

    // id
    app.get("/InventoryItems/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      console.log(query);
      const result = await ServiceCollection.findOne(query);
      console.log(result);
      res.send(result);
    });
    // post
    app.post("/InventoryItems", async (req, res) => {
      const newService = req.body;
      const service = await ServiceCollection.insertOne(newService);
      res.send(service);
    });

    app.get("/InventoryItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await ServiceCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/InventoryItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ServiceCollection.deleteOne(query);
      res.send(result);
    });
// put for updatedQuantity and restack
    app.put('/InventoryItems/:id', async (req, res) => {
      const id = req.params.id
      const updatedQuantity = req.body.updatedData
      const filter = { _id: ObjectId(id )}
      const options = { upsert: true }
      const updatedDoc = {
          $set: {
              quantity: updatedQuantity
          }
      }
      const result = await ServiceCollection.updateOne(filter, updatedDoc, options)
      res.send(result)
  })
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("welcome warehouse-server-site");
});
app.listen(port, () => {
  console.log("listening on", port);
});
