const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const core = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(core());
const port = process.env.PORT || 8000;

let conn = null;

const validateDate = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("First name is required");
  }
  if (!userData.lastname) {
    errors.push("Last name is required");
  }
  if (!userData.age) {
    errors.push("Age is required");
  }
  if (!userData.gender) {
    errors.push("Gender is required");
  }
  if (!userData.interests) {
    errors.push("Interests is required");
  }
  if (!userData.description) {
    errors.push("Description is required");
  }
  return errors;
};

const initMysql = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tutorial",
    port: 3306,
  });
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/testdb", (req, res) => {
  mysql
    .createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "tutorial",
      port: 3306,
    })
    .then((conn) => {
      conn
        .query("SELECT * FROM users")
        .then((results) => {
          res.json(results[0]);
        })
        .catch((error) => {
          console.error("Error fetching users:", error.message);
          res.status(500).json({ error: "Error fetching users" });
        });
    });
});

app.get("/testdb2", async (req, res) => {
  try {
    const results = await conn.query("SELECT * FROM users");
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const results = await conn.query("SELECT * FROM users");
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.post("/users", async (req, res) => {
  try {
    let user = req.body;
    const errors = validateDate(user);
    if (errors.length > 0) {
      throw {
        message: "Data not valid!",
        errors: errors,
      };
    }
    const results = await conn.query("INSERT INTO users SET ? ", user);
    res.json({
      message: "User created successfully",
      data: results[0],
    });
  } catch (error) {
    const errorMessage = error.message || "Error creating user";
    const errors = error.errors || [];
    res.status(500).json({ message: errorMessage, errors: errors });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query("SELECT * from users WHERE id= ?", id);
    if (results[0].length === 0) {
      res.status(404).json({ message: "User not found" });
    }
    res.json(results[0][0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});
/*
app.put("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let user = req.body;
    let results = await conn.query("UPDATE users SET ? WHERE ?", [user, id]);
    res.json({ message: "Update user successfully", data: results[0] });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});
*/

app.put("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let user = req.body;
    const results = await conn.query("UPDATE users SET ? WHERE id =  ? ", [
      user,
      id,
    ]);
    res.json({
      message: "User created successfully",
      data: results[0],
    });
  } catch (error) {
    const errorMessage = error.message || "Error creating user";
    const errors = error.errors || [];
    res.status(500).json({ message: errorMessage, errors: errors });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let results = await conn.query("DELETE from users WHERE id = ?", id);
    res.json({ message: "Deleted user successfully", data: results[0] });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

app.listen(port, async (req, res) => {
  await initMysql();
  console.log(`Server is running on port ${port}`);
});
