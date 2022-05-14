const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.olzms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const foodCollection = client.db('assignment-11').collection('Foods')

        app.get('/food', async (req, res) => {
            const query = {};
            const cursor = foodCollection.find(query);
            const foods = await cursor.toArray();
            res.send(foods);
        })
        app.post('/food', async (req, res) => {
            const newFood = req.body;
            console.log('adding new food')
            const result = await foodCollection.insertOne(newFood);
            res.send(result)
        })
        // single id 
        app.get('/food/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.findOne(query);
            res.send(result);
        });

        // app.delete('/food/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await foodCollection.deleteOne(query);
        //     res.send(result);
        // })



    }
    finally {

    }
}
run().catch(console.dir);

//root
app.get('/', (req, res) => {
    res.send('Running server-side')
})

app.listen(port, () => {
    console.log('Listening to port', port);
})