//Import express and path
const express = require("express");
const path = require("path");
const fs = require("fs")

//Create dynamic port
const app = express();
const PORT = process.env.PORT || 3000;

//Creates res.body for json post requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Applies static path to css and js
app.use(express.static(path.join(__dirname, "/public")));

//Return notes webpage
app.get("/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})  

//Return saved notes data
app.get("/api/notes", (req, res) =>{
    //Read  Json file
    fs.readFile("./db/db.json", (err,data) =>{
        res.json(JSON.parse(data))
    })
})

//Create new note and add it to the array
app.post("/api/notes", (req, res)=>{

    //Save new note to req.body
    const newNote = req.body

    //get  previoysly saved data
    fs.readFile("./db/db.json", (err,data) =>{

        //Get previously saved notes and save it to savedNotes array
        const savedNotes = JSON.parse(data)

        //Give the new note an id of the length of the array 
        if (savedNotes.length > 0 ){
            console.log("adding to end")
            newNote.id = savedNotes[savedNotes.length - 1].id + 1
        } else {
            console.log("there is no note setting id to 1")
            newNote.id = 1
        }

        //Add new note to saved Notes array
        savedNotes.push(newNote)

        //Write data to db.json
        fs.writeFile("./db/db.json", JSON.stringify(savedNotes), err =>{
            res.json(newNote)
        })
    })
})

//Delete a specific note
app.delete("/api/notes/:deleteNote",(req,res)=>{

    //Grab the key of the note that is going to be deleted
    const noteToDelete = parseInt(req.params.deleteNote);

    // Get the previously saved notes
    fs.readFile("./db/db.json", (err,data) =>{

        //Save previous notes data
        const savedNotes = JSON.parse(data) 

        //Create  a new array containing values not equal to the id of the id we want to delete
        const newData = savedNotes.filter(note => note.id != noteToDelete)

        //Write new data in db.json
        fs.writeFile("./db/db.json", JSON.stringify(newData), err =>{
            res.end()
        })
            
    
    })
})


//For all undefined page requests, send user to the home page
app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/index.html"))
})  

//create server listener
app.listen(PORT,() =>{
    console.log(`listening at localhost:${PORT}`)
})
