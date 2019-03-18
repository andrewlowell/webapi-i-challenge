const express = require('express')
const server = express()
const db = require('./data/db')
server.use(express.json())

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json({ error: "The users information could not be retrieved." })
    })
})

server.get('/api/users/:id', (req, res) => {
  console.log('getting user', req.params.id)
  db.findById(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    })
})

server.delete('/api/users/:id', (req, res) => {
  console.log(req.params.id)
  db.remove(req.params.id)
    .then(d => {
      if (d === 0) {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
      }
      res.status(200).json({ message: "delete successful"})
    })
    .catch(err => {
      console.log(err)
      res.status(404).json({ error: "The user could not be removed" })
    })
})

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params
  const { name, bio } = req.body
  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }
  else {
    db.findById(id)
      .then(user => {
        const date = new Date().toISOString()
        const userToUpdate = {
          name: name,
          bio: bio,
          created_at: user.created_at,
          updated_at: date
        }
        db.update(id, userToUpdate)
          .then(user => {
            res.status(200).json(user)
          })
          .catch(err => {
            res.status(500).json({ error: "The user information could not be modified." })
          })
      })
      .catch(err => {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
      })
  }
})

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body
  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }
  else {
    const date = new Date().toISOString()
    const user = {
      name: name,
      bio: bio,
      created_at: date,
      updated_at: date
    }
    db.insert(user)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: "There was an error while saving the user to the database" })
      })
  }
})

server.listen(5000, () =>
  console.log('Server running on http://localhost:5000')
);