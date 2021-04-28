const express = require("express")
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const Todo = require("./models/todo")
const app = express()

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", "hbs")

app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost/todo-list", { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

// fail to connect
db.on("error", () => {
  console.log("mongodb error!!!")
})
// succeed in connecting
db.once("open", () => {
  console.log("mongodb connected!!!")
})

app.get("/", (req, res) => {
  Todo.find()
    .lean()
    .then(todos => res.render("index", { todos }))
    .catch(error => console.error(error))
})

// create new todo
app.get("/todos/new", (req, res) => {
  return res.render("new")
})

app.post("/todos", (req, res) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

// show details of a specific id
app.get("/todos/:id", (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render("detail", { todo }))
    .catch(error => console.log(error))
})

// edit todo of a specific id
app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render("edit", { todo }))
    .catch(error => console.log(error))
})

app.post("/todos/:id/edit", (req, res) => {
  const name = req.body.name
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

// delete todo of a specific id
app.post("/todos/:id/delete", (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => {
      todo.remove()
    })
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})



app.listen(3000, () => {
  console.log("Listening on localhost:3000")
})