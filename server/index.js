const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
let users = require("./sample.json"); // Load users from file
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Display all users
app.get("/users", (req, res) => {
    return res.json({ users });
});

// Delete a user by ID
app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => user.id !== id);

    // Update the in-memory users array
    users.length = 0;
    users.push(...filteredUsers);

    // Write the updated list to the file
    const filePath = path.join(__dirname, "sample.json");
    fs.writeFile(filePath, JSON.stringify(filteredUsers), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update the file." });
        }
        return res.json(filteredUsers);
    });
});

//add new user
app.post("/users",(req,res)=>{
    let {name,age,city}=req.body
    if(!name || !age || !city){
        res.status(400).send({message:"all fields required"})
    }
    let id=Date.now()
    users.push({id,name,age,city})
    fs.writeFile(filePath, JSON.stringify(filteredUsers), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update the file." });
        }
        return res.json({"message" :"user detail added success"})
    });
})

//update user
app.patch("/users/:id",(req,res)=>{
    let id=Number(req.params.id)
    let {name,age,city}=req.body
    if(!name || !age || !city){
        res.status(400).send({message:"all fields required"})
    }
    let index=users.findIndex((user)=>user.id ==id )
    users.splice(index,1,{...req.body})
    
    fs.writeFile(filePath, JSON.stringify(filteredUsers), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update the file." });
        }
        return res.json({"message" :"user detail updated success"})
    });
})


// Start the server
app.listen(port, (err) => {
    if (err) {
        console.error("Error starting the server:", err);
    } else {
        console.log(`App is running on port ${port}`);
    }
});
