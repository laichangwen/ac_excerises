const base_url = "https://movie-list.alphacamp.io"
const index_url = base_url + "/api/v1/movies/"
const poster_url = base_url + "/posters/"
const dataPanel = document.querySelector("#data-panel")
const removeFavorite = document.querySelector("#btn-remove-favorite")
const favoriteMovie = JSON.parse(localStorage.getItem("favorite_movie"))


function renderMovieList(data) {
  let rawHTML = ""
  data.forEach((item) => {
    // console.log(`${poster_url}${item.image}`)
    rawHTML +=
      `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src=" ${poster_url + item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id = ${item.id}>
                More
              </button>
              <button class="btn btn-danger btn-remove-favorite" data-id = ${item.id}>x</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title")
  const modalDate = document.querySelector("#movie-modal-date")
  const modalImage = document.querySelector("#movie-modal-image img")
  const modalDescription = document.querySelector("#movie-modal-description")
  console.log(id)
  console.log(favoriteMovie)
  data = favoriteMovie.find((movie) => movie.id === id)
  // axios.get(index_url + id).then((response) => {
  //   const data = response.data.results
  //   modalTitle.innerText = data.title
  //   modalDate.innerText = `Release at: ${data.release_date}`
  //   modalDescription.innerText = data.description
  //   // modalImage.innerHTML =
  //   //   `<img src="${poster_url + data.image}" alt="movie-poster" class="img-fluid">`
  //   // modalImage.setAttribute("src", poster_url + data.image)
  //   modalImage.src = poster_url + data.image
  // }).catch((err) => console.log(err))
  modalTitle.innerText = data.title
  modalDate.innerText = `Release at: ${data.release_date}`
  modalDescription.innerText = data.description
  modalImage.src = poster_url + data.image

}

function removeFromFavorite(id) {
  if (!favoriteMovie) return
  const movie_idx = favoriteMovie.findIndex((movie) => movie.id === id)
  if (movie_idx === -1) return
  favoriteMovie.splice(movie_idx, 1)
  localStorage.setItem("favorite_movie", JSON.stringify(favoriteMovie))
  renderMovieList(favoriteMovie)
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  // console.log(event.target)
  if (event.target.matches(".btn-show-movie")) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

if (favoriteMovie) {
  renderMovieList(favoriteMovie)
}