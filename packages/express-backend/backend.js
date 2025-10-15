// backend.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 8000;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    job: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error("Invalid job, must be at least 2 characters.");
      },
    },
  },
  { collection: "users_list" }
);

const User = mongoose.model("User", UserSchema);

async function getUsers(name, job) {
  const filter = {};
  if (name) filter.name = name;
  if (job) filter.job = job;
  return User.find(filter).lean();
}

function findUserById(id) {
  return User.findById(id).lean();
}

async function addUser(user) {
  const newUser = await User.create(user);
  return newUser.toObject();
}

const toApi = (users) => ({
  id: users._id.toString(),
  name: users.name,
  job: users.job,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get all users or filter by name and/or job
app.get("/users", async (req, res) => {
  try {
    const name = req.query.name;
    const job = req.query.job;
    const users = await getUsers(name, job);
    res.status(200).json({ users_list: users.map(toApi) });
  } catch (error) {
    res.status(500).send("Failed to fetch users.");
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params["id"];
    const user = await findUserById(id);
    if (!user) {
      res.status(404).send("Resource not found.");
    } else {
      res.status(200).json(toApi(user));
    }
  } catch (error) {
    res.status(500).send("Failed to fetch user.");
  }
});

// Delete user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).lean();
    if (!deletedUser) {
      res.status(404).send("Resource not found.");
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send("Failed to delete user.");
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, job } = req.body;
    if (!name || !job) {
      return res.status(400).send("Name and job are required.");
    }
    const createdUser = await addUser({ name, job });
    res.status(201).json(toApi(createdUser));
  } catch (error) {
    res.status(500).send("Failed to create user.");
  }
});

mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
