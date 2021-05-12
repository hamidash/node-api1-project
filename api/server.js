// BUILD YOUR SERVER HERE
const express = require('express');
const db = require('./users/model')

//Global middleware
const server = express();

server.use(express.json());

server.get('/', (req, res)=>{
    res.status(200).json({message: "Server is up and running! Are you happy now?"})
})

server.post("/api/users", (req, res) => {
  console.log(req);
    const { name, bio } = req.body;

  if (!name || !bio) {
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
    return;
  }

  db.insert({ name, bio })
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "There was an error while saving the user to the database"})
    });
});

server.get('/api/users', (req, res) => {
  db
    .find()
    .then((users) => {
      res.status(200).json({users});
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The users information could not be retrieved" });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
        return;
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The user information could not be retrieved" });
    });
});

server.delete('/api/users/:id',(req,res)=>{
  const {id} = req.params;

  db
  .remove(id)
  .then(user => {
      if(!user){
          res.status(404).json({ message: "The user with the specified ID does not exist" })
          return;
      }
      res.status(200).json({message: `The user id: ${id} has been removed`})
  })
  .catch(err => {
      res.status(500).json({ message: "The user could not be removed" })
  })
})
server.put('/api/users/:id',(req,res)=>{
  const {id} = req.params;
  const {name, bio} = req.body;

  if (!name || !bio) {
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
    return;
  }
  
  db.update(id, {name, bio})
  .then(user=>{
    if(!user){
        res.status(404).json({ message: "The user with the specified ID does not exist" })
        return;
    }
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({ message: "The user information could not be modified" })
  })
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
