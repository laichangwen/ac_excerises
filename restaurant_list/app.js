// include express
const express = require("express")
const app = express()
const exphbs = require("express-handlebars")
const restos = require("./restaurant.json")
app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
// define server related variables
const port = 3000

// static files
app.use(express.static("public"))
// Handle request and response
app.get("/", (req, res) => {
  res.render("index", { restos: restos.results })
})

app.get("/search", (req, res) => {
  if (req.query.keyword) {
    const restaurants = restos.results.filter((resto) => resto.name.toLowerCase().includes(req.query.keyword.toLowerCase()))
    res.render("index", { restos: restaurants, keyword: req.query.keyword })
  }
})


app.get("/restaurants/:resto_id", (req, res) => {
  const id = Number(req.params.resto_id)
  const resto = restos.results.find((item) => item.id === id)
  // res.render("show", { movie: movieList.results[id - 1] })
  res.render("show", { resto })
})

// Start and listen to express server
app.listen(port, () => {
  console.log(`Listen on http://localhost:${port}`)
})