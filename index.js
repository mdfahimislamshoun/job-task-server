require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0wngdt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
    const taskCollection = client
      .db("taskDB")
      .collection("tasks");


    app.get("/task", async (req, res) => {
      const query = {};
      const status = req.query.status;
      if (status) {
              query.status = status
            }
      const courser = taskCollection.find(query);
      const result = await courser.toArray();
      res.send(result);
    });

    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    app.post("/task", async (req, res) => {
      const newTask = req.body;
      console.log("new Task :", newTask);
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    });

    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateTask = req.body;
      let updateFields = {};
      if (updateTask.title) {
        updateFields.title = updateTask.title;
      }
      if (updateTask.descriptions) {
        updateFields.descriptions = updateTask.descriptions;
      }
      if (updateTask.deadlines) {
        updateFields.deadlines = updateTask.deadlines;
      }
      if (updateTask.priorityType) {
        updateFields.priorityType = updateTask.priorityType;
      }
      if (updateTask.status) {
        updateFields.status = updateTask.status;
      }
      const Tasks = { $set: updateFields };
      const result = await taskCollection.updateOne(filter, Tasks, options);
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    console.log("Database Connected!");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();
app.get("/", (req, res) => {
  res.status("project-blog-server-a11 running on port", port);
});

app.listen(port, () => {
  console.log("project-server running on ", port);
});
