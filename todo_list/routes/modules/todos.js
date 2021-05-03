const express = require("express")
const router = express.Router()
const Todo = require("../../models/todo")

// create new todo
router.get("/new", (req, res) => {
  return res.render("new")
})

router.post("/", (req, res) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

// show details of a specific id
router.get("/:id", (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render("detail", { todo }))
    .catch(error => console.log(error))
})

// edit todo of a specific id
router.get("/:id/edit", (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render("edit", { todo }))
    .catch(error => console.log(error))
})

router.put("/:id", (req, res) => {
  const { name, isDone } = req.body
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = (isDone === "on")
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

// delete todo of a specific id
router.delete("/:id", (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => {
      todo.remove()
    })
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})


module.exports = router