const mongoose = require("mongoose")
const restaurants = require("../restaurant")
mongoose.connect("mongodb://localhost/restaurants", { useNewUrlParser: true, useUnifiedTopology: true })

const restos = require("./restaurant.json").results

const db = mongoose.connection


// fail to connect
db.on("error", () => {
  console.log("mongodb error!!!")
})
// succeed in connecting
db.once("open", () => {
  console.log("mongodb connected!!!")

  for (let i = 0; i < restos.length; i++) {
    restaurants.create({
      name: `${restos[i].name}`,
      category: `${restos[i].category}`,
      image: `${restos[i].image}`,
      location: `${restos[i].location}`,
      phone: `${restos[i].phone}`,
      google_map: `${restos[i].google_map}`,
      rating: `${restos[i].rating}`,
      description: `${restos[i].description}`
    })
  }
  console.log("done!!")
})