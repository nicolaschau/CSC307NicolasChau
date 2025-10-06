// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get all users or filter by name and/or job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if ((name != undefined) & (job == undefined)) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else if ((job != undefined) & (name != undefined)) {
    let result = findUserByName(name).filter((user) => user["job"] === job);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

// Get all users by name and job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined) {
    let result = users["users_list"].filter(
      (user) => user["name"] === name && user["job"] === job
    );
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

// Delete user by ID
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index === -1) {
    res.status(404).send("Resource not found.");
  } else {
    users["users_list"].splice(index, 1);
    res.send();
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.status(201).json(userToAdd);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
