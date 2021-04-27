const mongoose = require("mongoose")
const todos = require("../todo")
mongoose.connect("mongodb://localhost/todo-list", { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

// fail to connect
db.on("error", () => {
  console.log("mongodb error!!!")
})
// succeed in connecting
db.once("open", () => {
  console.log("mongodb connected!!!")
  for (let i = 0; i < 10; i++) {
    todos.create({ name: `name-${i}` })
  }
  console.log("done!!")
})