const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rtvg8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const carsCollection = client.db("car-bazar").collection("cars");
    //cars
    app.get("/cars", async (req, res) => {
      const products = await carsCollection.find({}).toArray();
      res.send(products);
    });

    //delete
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await carsCollection.deleteOne(query);
      console.log(products);
      res.send(products);
    });

    //post
    app.post("/addcars", async (req, res) => {
      const cars = req.body;
      const products = await carsCollection.insertOne(cars);
      res.send(products);
    });

    //single data

    app.get("/data/:id", async (req, res) => {
      const id = req.params.id;
      const querry = { _id: ObjectId(id) };
      const result = await carsCollection.findOne(querry);
      res.send(result);
    });

   

    //decrising one by one

    app.put("/datas/:id", async (req, res) => {
      const id = req.params.id;
      const oldQuantity = parseInt(req.query.oldQuantity);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const uDoc = {
        $set: {
          quantity: parseInt(oldQuantity) - 1,
        },
      };
      const result = await carsCollection.updateOne(filter, uDoc, options);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Nowwwww car");
});

app.listen(port, () => {
  console.log("now", port);
});
