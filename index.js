const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



// middleware

app.use(cors(
    {
        origin: [
          "http://localhost:5173",
          "https://lunexa-af8cf.web.app",
          "https://lunexa-af8cf.firebaseapp.com",
        ]
      }
));
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xnvb7mx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const allProductCollection = client.db("lunexa").collection("allProducts");
        const usersCollection = client.db("lunexa").collection("users");

        // find all product

        app.get('/allProducts', async (req, res) => {
            const result = await allProductCollection.find().toArray();
            res.send(result)
        })

        // find popular or upcoming product

        app.get('/allProducts/banner/:status', async (req, res) => {
            const status = req.params.status;
            const query = { status: status };
            const result = await allProductCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allProductCollection.findOne(query)
            res.send(result)
        })

        // Filter products by brand
        app.get('/products/brand/:brand', async (req, res) => {
            const brand = req.params.brand;
            const query = { brand: brand };
            const result = await allProductCollection.find(query).toArray();
            res.send(result);
        });

        // Filter products by category
        app.get('/products/category/:category', async (req, res) => {
            const category = req.params.category;
            const query = { category: category };
            const result = await allProductCollection.find(query).toArray();
            res.send(result);
        });

        // Filter products by price range
        app.get('/products/price/:range', async (req, res) => {
            const range = req.params.range;
            let query = {};
            if (range === 'low') query.price = { $lt: 500 };
            if (range === 'mid') query.price = { $gte: 500, $lte: 1000 };
            if (range === 'high') query.price = { $gt: 1000 };
            const result = await allProductCollection.find(query).toArray();
            res.send(result);
        });

        // Sort products by price or date
        app.get('/products/sort/:order', async (req, res) => {
            const order = req.params.order;
            let sort = {};
            if (order === 'priceLowHigh') sort.price = 1;
            if (order === 'priceHighLow') sort.price = -1;
            if (order === 'newest') sort.product_creation_date = -1;

            const result = await allProductCollection.find({}).sort(sort).toArray();
            res.send(result);
        });

        // post user information
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await usersCollection.insertOne(user)
            res.send(result)

        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('lunexa is running')
})
app.listen(port, () => {
    console.log(`lunexa is running port on :${port}`)
})