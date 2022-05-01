const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const port= process.env.PORT || 5000;

// middellware 
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.manly.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
try{
    await client.connect();
    const ServiceCollection=client.db('warehouse').collection('service')

    app.get('/services',async (req, res) => {
        const query={}
    const cursor=ServiceCollection.find(query)
    const services=await cursor.toArray()
    res.send(services)
    })
}
finally{

}
    }
    run().catch(console.dir)
app.get('/', (req, res) =>{
    res.send('welcome warehouse-server-site')
})
app.listen(port,()=>{
console.log('listening on',port);
})