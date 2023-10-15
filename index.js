const express = require('express')

const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors')
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqva6ft.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("CoffeeDB")
    const CoffeeCollection = database.collection("Coffee");
    const database2 = client.db("CoffeeDB")
    const UserCollection = database2.collection('User')
    
    app.get('/', (req, res) => {
      res.send('server is running')
    })
    app.get('/coffees', async (req, res) => {
      const cursor = CoffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/users',async (req,res)=>{
      const cursor = UserCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.post('/users',async(req,res)=>{
      const user = req.body
      const result = await UserCollection.insertOne(user)
      res.send(result)
    })
    app.post('/coffees', async (req, res) => {
      const coffee = req.body;
      const result = CoffeeCollection.insertOne(coffee)
      res.send(result)
    })
    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await CoffeeCollection.findOne(query)
      res.send(result)
    })
    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await CoffeeCollection.deleteOne(query)
      res.send(result)
    })
    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: coffee.name,
          chef: coffee.chef,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          details: coffee.details,
          url: coffee.url

        },
      };
      const result = await CoffeeCollection.updateOne(filter,updatedDoc,options)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})