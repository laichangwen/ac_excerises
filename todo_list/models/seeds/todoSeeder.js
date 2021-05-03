
const todos = require("../todo")
const db = require("../../config/mongoose")
// succeed in connecting
db.once("open", () => {
  for (let i = 0; i < 10; i++) {
    todos.create({ name: `name-${i}` })
  }
  console.log("done!!")
})