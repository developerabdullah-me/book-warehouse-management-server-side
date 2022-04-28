const express = require('express');
const app = express();
const cors = require('cors');

const port= process.env.PORT || 5000;

// middellware 
app.use(cors());
app.use(express.json());



app.get('/', (req, res) =>{
    res.send('welcome warehouse-server-site')
})
app.listen(port,()=>{
console.log('listening on',port);
})