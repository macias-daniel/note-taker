//Import express and path
const express = require("express");
const path = require("path");
const fs = require("fs")


//Create dynamic port
const app = express();
const PORT = process.env.PORT || 3000;

//Creates res.body for json post requests
app.use(express.json());







//Direct to index.html
app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "html/index.html"))
})

//Direct to notes.html
app.get("/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "html/notes.html"))
})

//Get db.json file
app.get("/api/notes", (req, res)=>{
    fs.readFile("./data/db.json", (err, data) => {  
        console.log(JSON.parse(data))
        res.json(JSON.parse(data))
    })
})














//All undefined get requests
app.get("*", (req, res) =>{
    res.sendFile(path.join(__dirname, "html/index.html"))
})

//create server listener
app.listen(PORT,() =>{
    console.log(`listening at localhost:${PORT}`)
})
