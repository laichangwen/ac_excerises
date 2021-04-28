// include express and handlebars
const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const port = 3000
const generatetrashtalk = require("./generate_trashtalk")

// set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// use body-parser
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.render("index")
})

app.post("/", (req, res) => {
  const options = req.body
  const trashtalk = generatetrashtalk(options)
  res.render("index", { trashtalk, options })
})

// start and listen to express server
app.listen(port, () => {
  console.log(`Listening to localhost: ${port}`)
})