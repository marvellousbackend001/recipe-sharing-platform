const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");


const app = express()
/****************Connecting To  Mysql************************* */
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "CHIDERA001?.1",
    database: "recipe_sharing_platform",
    port: "3306",
});
con.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
})
/********************************Implementing An Endpoint for user signup and Login**************************/
app.post("/users/signup", bodyParser.json(), function (req, res) {
    const { username, email, password } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) throw err;
        const sql = `INSERT INTO users (username, email, password) VALUES (?,?,?)`;
        con.query(sql, [username, email, hash], function (err, result) {
            if (err) throw err;
            res.send("registered");
        });
    });
});
//creating an endpoint that handles users login
app.post("/users/login", bodyParser.json(), function (req, res) {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ?`;
    con.query(sql, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    // Implement session management here
                    res.send("Logged in");
                } else {
                    res.send("Incorrect password");
                }
            });
        } else {
            res.send("User not found");
        }
    });
});
/**********************************Recipes*************************************************************/

// creating an endpoint for adding a new recipes
app.post("/api/recipes", bodyParser.json, function (req, res) {                                     //C-craete
    const { title, description, instructions } = req.body;
    const sql = `INSERT INTO recipes (title, description, instructions) VALUES (?, ?, ?)`;
    con.query(sql, [title, description, instructions], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
// creating an endpoint for listing all reciepes
app.get("/api/recipes", bodyParser.json, function (req, res) {
    const sql = `SELECT * FROM recipes`;                                                           //R-read
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
// creating an endpoint for getting recipes by id 
app.get("/api/recipes/:id", bodyParser.json, function (req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM recipes WHERE id = ?`;
    con.query(sql, [id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})
//  creating an endpoint for update recipes by id 
app.put("/api/reciepes/:id", bodyParser.json, function (req, res) {
    const id = req.params.id;
    const { title, description, instructions } = req.body;                                                //U- update 
    const sql = `UPDATE recipes SET title = ?, description = ?, instructions = ? WHERE id = ?`;
    con.query(sql, [title, description, instructions, id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})
// creating an endpoint for deleting a recipes by id 
app.delete("/api/recipes/:id", bodyParser.json, function (req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM recipes WHERE id = ?`;                                                     //D-delete
    con.query(sql, [id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
// i implemented the CRUD operation
app.listen(4000)
    , console.log("server is running at port 4000");
