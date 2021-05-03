const express = require("express")
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const Todo = require("./models/todo")
const routes = require("./routes")
const app = express()

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", "hbs")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

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







app.listen(3000, () => {
  console.log("Listening on localhost:3000")
})