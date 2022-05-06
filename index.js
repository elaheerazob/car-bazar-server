const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
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

async function run () {
    try{
        await client.connect();
        const carsCollection = client.db("car-bazar").collection("cars");
        app.get("/cars", async (req, res) => {
          const query = {};
          const cousor = carsCollection.find(query);
          const cars = await cousor.toArray();
          res.send(cars);
        });
    }
    finally{

    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Nowwwww car");
});

app.listen(port, () => {
  console.log("now", port);
});
