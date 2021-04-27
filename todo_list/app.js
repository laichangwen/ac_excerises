const express = require("express")
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const app = express()

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", "hbs")

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
  res.render("index")
})

app.listen(3000, () => {
  console.log("Listening on localhost:3000")
})