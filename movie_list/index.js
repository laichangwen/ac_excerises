const base_url = "https://movie-list.alphacamp.io"
const index_url = base_url + "/api/v1/movies/"
const poster_url = base_url + "/posters/"

const movies = []
let filtered_movie = []
const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector("#paginator")
const moviePerPage = 12

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
              <button class="btn btn-info btn-add-favorite" data-id = ${item.id}>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const pages = Math.ceil(amount / moviePerPage)
  paginator.innerHTML = ""
  for (let page = 1; page <= pages; page++) {
    paginator.innerHTML += `<li class="page-item"><a class="page-link" href="#" data-page = ${page}>${page}</a></li>`
  }
}

function getMoviesByPage(page) {
  data = (filtered_movie.length) ? filtered_movie : movies
  return data.slice((page - 1) * moviePerPage, page * moviePerPage)
}


function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title")
  const modalDate = document.querySelector("#movie-modal-date")
  const modalImage = document.querySelector("#movie-modal-image img")
  const modalDescription = document.querySelector("#movie-modal-description")
  axios.get(index_url + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = `Release at: ${data.release_date}`
    modalDescription.innerText = data.description
    // modalImage.innerHTML =
    //   `<img src="${poster_url + data.image}" alt="movie-poster" class="img-fluid">`
    // modalImage.setAttribute("src", poster_url + data.image)
    modalImage.src = poster_url + data.image
  }).catch((err) => console.log(err))


}

function addToFavorite(id) {
  let list = JSON.parse(localStorage.getItem("favorite_movie")) || []
  let movie = movies.find((movie) => (movie.id === id))

  if (list.some((movie) => (movie.id === id))) {
    return alert("This movie is already added in favorite!!")
  }
  list.push(movie)
  localStorage.setItem("favorite_movie", JSON.stringify(list))

}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  // console.log(event.target)
  if (event.target.matches(".btn-show-movie")) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener("submit", function onformSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  console.log(keyword)
  filtered_movie = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))
  searchInput.value = ""
  if (!filtered_movie.length) {
    return alert("No movie found using this keyword " + keyword)
  }
  renderPaginator(filtered_movie.length)
  renderMovieList(getMoviesByPage(1))
})

paginator.addEventListener("click", function onclickedPaginator(event) {
  if (event.target.tagName !== "A")
    return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

axios.get(index_url).then((response) => {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))
}).catch((err) => console.log(err))