const base_url = "https://movie-list.alphacamp.io"
const index_url = base_url + "/api/v1/movies/"
const poster_url = base_url + "/posters/"

const movies = []
let filtered_movie = []
const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector("#paginator")
const icons = document.querySelector("#icons")
const moviePerPage = 12
let currentMode = JSON.parse(localStorage.getItem("current_mode")).mode || "card"

function showMovieCards(item) {
  return `
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
}
function showMovieLists(item) {
  return `    <tr>
      <th scope="row">${item.title}</th>
      <td>Release date: ${item.release_date}</td>
      <td><button type="button" class="btn btn-primary btn-sm btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id=${item.id}>More</button>
		<button type="button" class="btn btn-info btn-sm btn-add-favorite" data-id=${item.id}>+</button></td>	  
    </tr>`
}
function renderMovieList(data, method) {
  let rawHTML = ""
  if (method === "card") {
    data.forEach((item) => {
      rawHTML += showMovieCards(item)
    })
  } else if (method === "list") {
    rawHTML += `		<table class="table table-hover">
  <tbody>`
    data.forEach((item) => {
      rawHTML += showMovieLists(item)
    })
    rawHTML += `  </tbody>
</table>`
  }
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
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener("submit", function onformSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filtered_movie = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))
  searchInput.value = ""
  if (!filtered_movie.length) {
    return alert("No movie found using this keyword " + keyword)
  }
  renderPaginator(filtered_movie.length)
  renderMovieList(getMoviesByPage(1), currentMode)
})

paginator.addEventListener("click", function onclickedPaginator(event) {
  if (event.target.tagName !== "A")
    return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page), currentMode)
})

icons.addEventListener("click", function onClickedIcons(event) {
  const iconNode = event.target.closest("a")
  if (iconNode.id.includes("card")) {
    renderMovieList(getMoviesByPage(1), "card")
    recordCurrentMode("card")
  } else if (iconNode.id.includes("list")) {
    renderMovieList(getMoviesByPage(1), "list")
    recordCurrentMode("list")
  }
})

function recordCurrentMode(mode) {
  let list = {
    mode
  }
  currentMode = mode
  localStorage.removeItem("current_mode")
  localStorage.setItem("current_mode", JSON.stringify(list))
}


axios.get(index_url).then((response) => {
  movies.push(...response.data.results)
  // sort movies by release date from latest to oldest
  movies.sort(function (a, b) {
    return Number(b.release_date.replace(/-/gi, "")) - Number(a.release_date.replace(/-/gi, ""))
  })
  renderPaginator(movies.length)
  recordCurrentMode(currentMode)
  renderMovieList(getMoviesByPage(1), currentMode)
}).catch((err) => console.log(err))