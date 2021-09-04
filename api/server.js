// BUILD YOUR SERVER HERE

 // EXPORT YOUR SERVER instead of {}

const express = require('express');
const userDB = require('./users/model');

const server = express();

server.use(express.json())

server.post('/api/users', (req, res) => {
   const {name, bio} = req.body;
   
   if(!name || !bio){ 
       res.status(400).json({ message: "Please provide name and bio for the user" });
   }
   userDB.insert({name, bio})
       .then(user => {
          res.status(201).json(user);
       } )
       .catch(err => {
           res.status(500).json({ message: "There was an error while saving the user to the database" })
       }) 
})

server.get('/api/users', (req, res) => {
    userDB.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json({ message: "The users information could not be retrieved" });
    })
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
        userDB.findById(id)
        .then(user => {
            if(!user) {
                res.status(200).json({ message: "The user with the specified ID does not exist" })
            }else{
                res.status(404).json(user)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The user information could not be retrieved" });
        })
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    userDB.remove(id)
    .then(user => {
        if(!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }else{
           res.status(200).json({message: `Successfully deleted user id ${id}`}) 
        }
    })
    .catch(err => {
        res.status(500).json({ message: "The user could not be removed" });
    })
})

server.put('/api/users/:id', (req,res) => {
    const id = req.params.id;
    const {name, bio} = req.body;

    if(!name || !bio){
        res.status(400).json({ message: "Please provide name and bio for the user" })
    }
    userDB.update(id, {name, bio})
    .then(user => {
        if(!user){
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }else{
            res.status(200).json(user)
        }
    })
    .catch(err => {
        res.status(500).json({ message: "The user information could not be modified" })
    })


})






module.exports = server;