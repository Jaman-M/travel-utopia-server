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
        //
        const bookingsCollection = client.db('travelUtopia').collection('bookings');

        // use aggregate to query multiple cpllection and then merge data
        app.get('/bookingOptions', async(req, res) => {
            const date = req.query.date;
            // console.log(date);
            const query = {};
            const options = await bookingOptionCollection.find(query).toArray(); 
            //get the bookings of the provided date
            const bookingQuery = {bookingDate: date}
            const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray();
            options.forEach(option => {
                const optionBooked = alreadyBooked.filter(book => book.bookService === option.name);
                const bookedSlots = optionBooked.map(book => book.slot);
                const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot));
                option.slots = remainingSlots;
                // console.log(date, option.name, remainingSlots.length);
            })
            res.send(options);
            // const cursor = 
        });
        // post

        app.post('/bookings', async(req,res) =>{
            const booking = req.body
            console.log(booking);
            const query = {
                bookingDate: booking.bookingDate,
                email: booking.email,
                bookingService: booking.bookingService
            }

            const alreadyBooked = await bookingsCollection.find(query).toArray();
            if(alreadyBooked.length){
                const message = `You already have a booking on ${booking.bookingDate}`
                return res.send({acknowledged: false, message})
            }

            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
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