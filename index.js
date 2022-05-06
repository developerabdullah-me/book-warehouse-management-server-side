const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middellware
app.use(cors());
app.use(express.json());

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

    app.get("/InventoryItems", async (req, res) => {
      const query = {};
      const cursor = ServiceCollection.find(query);
      const InventoryItems = await cursor.toArray();
      res.send(InventoryItems);
    });
    // get myAddedItems data  from database
    app.get("/myAddedItems", async (req, res) => {
      const email=req.query.email;
      console.log(email);
      const query = {email: email};
      const cursor = ServiceCollection.find(query);
      const InventoryItems = await cursor.toArray();
      res.send(InventoryItems);
    });
    // post
    app.post("/myAddedItems", async (req, res) => {
      const newService = req.body;
      const service = await ServiceCollection.insertOne(newService);
      res.send(service);
    });
    // post
    app.post("/InventoryItems", async (req, res) => {
      const newService = req.body;
      const service = await ServiceCollection.insertOne(newService);
      res.send(service);
    });

    app.get("/InventoryItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ServiceCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/InventoryItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ServiceCollection.deleteOne(query);
      res.send(result);
    });
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
