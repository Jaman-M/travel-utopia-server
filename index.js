const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//mongo theke ana



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mkg81.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri);

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
        const bookingOptionCollection = client.db('travelUtopia').collection('bookingOptions');
        app.get('/bookingOptions', async(req, res) => {
            const query = {};
            const options = await bookingOptionCollection.find(query).toArray(); 
            res.send(options);
            // const cursor = 
        })
    } 
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
// run().catch(console.dir);
run().catch(console.log);


//mongo theke ana ses

app.get('/', async (req, res) => {
    res.send("travel-utopia server is running")
})

app.listen(port, () => console.log(`Travel-utopia running on ${port}`));