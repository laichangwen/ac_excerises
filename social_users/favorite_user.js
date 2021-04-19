const base_url = "https://lighthouse-user-api.herokuapp.com"
const index_url = base_url + "/api/v1/users/"
const dataPanel = document.querySelector("#data-panel")
const paginator = document.querySelector("#paginator")
const searchForm = document.querySelector("#search-user")
const searchFilter = document.querySelector(".filter-selector")
const input = document.querySelector("#search-keyword")
const favoriteModal = document.querySelector("#user-modal")
const navFavorite = document.querySelector("#favorite-cnt")
const favoriteUser = JSON.parse(localStorage.getItem("favorite_user"))
const removeFavorite = document.querySelector("#btn-remove-favorite")
let filteredUser = []
const userPerPage = 30
let favoriteCnt = favoriteUser.length

function renderUserList(page) {
    const start = (page - 1) * userPerPage
    let data = (filteredUser.length > 0) ? filteredUser : favoriteUser
    const end = Math.min(start + userPerPage, data.length)
    dataPanel.innerHTML = ""
    for (let i = start; i < end; i++) {
        let user = data[i]
        dataPanel.innerHTML +=
            `<div class="col-auto">
            <div class="mb-3">
             <div class="card" style="width: 10rem;">
                <img src=${user.avatar} class="card-img-top" alt="..." >
                    <div class="card-body d-flex justify-content-lg-between">
                        <span class="card-text"><em>${user.name + " " + user.surname}</em></span>
                            <button type="button" class="btn btn-primary btn-more-info" data-toggle="modal" data-target="#user-modal" data-id = ${user.id}>+</button>
                         </div>
        `
    }

}

function renderPaginator(amount) {
    let pages = Math.ceil(amount / userPerPage)
    paginator.innerHTML = ""
    for (let page = 1; page <= pages; page++) {
        paginator.innerHTML +=
            `<li class="page-item"><a class="page-link" href="#" id = ${page}>${page}</a></li>`
    }
}

if (favoriteUser) {
    renderUserList(1)
    renderPaginator(favoriteUser.length)
    let text = (favoriteCnt > 0) ? favoriteCnt : ""
    navFavorite.innerText = text
}

function showUserModal(id) {
    const userModalContent = document.querySelector(".user-modal-content")
    const userTitle = document.querySelector("#user-modal-title")
    const userAvatar = document.querySelector("#user-modal-avatar img")
    const userbtn = document.querySelector(".btn-remove-favorite")
    axios.get(index_url + id).then(function show_user(response) {
        const data = response.data
        userModalContent.innerHTML =
            `
		    <p>Gender: ${data.gender}</p>
			<p>Age: ${data.age}</p>
			<p>Birthday: ${data.birthday}</p>
			<p>Contact: ${data.email}</p>
            <p>Region: ${data.region}</p>
		`
        userAvatar.src = data.avatar
        userTitle.innerText = data.name + " " + data.surname
        userbtn.setAttribute("id", data.id)
    }).catch((error) => console.log(error))
}

// strip special characters pattern 
function stripscript(value) {
    var pattern = new RegExp("[ `~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < value.length; i++) {
        rs += value.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

function searchItem(text, method, keycode) {
    const ind = searchFilter.selectedIndex
    let key = searchFilter.options[ind].value.toLowerCase()
    if (text.length > 0 || (method === "keypress" && text.length > 0 && keycode === 13)) {
        filteredUser = favoriteUser.filter((user) => {
            if (key !== "gender")
                return user[`${key}`].toLowerCase().includes(text)
            else
                return user[`${key}`].toLowerCase() === text
        })
        if (filteredUser.length > 0) {
            renderUserList(1)
        } else {
            dataPanel.innerHTML = ""
        }
        renderPaginator(filteredUser.length)
    }
    input.value = ''
}


dataPanel.addEventListener("click", function onPanelClicked(event) {
    if (event.target.matches(".btn-more-info")) {
        // console.log(event.target.dataset)
        showUserModal(Number(event.target.dataset.id))
    }
})
paginator.addEventListener("click", function onPaginatorClicked(event) {
    if (event.target.matches(".page-link")) {
        renderUserList(Number(event.target.id))
    }
})
searchForm.addEventListener("click", function onSearchClicked(event) {
    event.preventDefault()
    searchItem(stripscript(input.value).toLowerCase(), "click", 0)
})
searchForm.addEventListener("keypress", function onSearchTyped(event) {
    event.preventDefault()
    searchItem(stripscript(input.value).toLowerCase(), "keypress", event.keyCode)
})
favoriteModal.addEventListener("click", function onfavoriteClicked(event) {
    if (event.target.matches(".btn-remove-favorite")) {
        favoriteCnt--
        navFavorite.innerText = (favoriteCnt > 0) ? favoriteCnt : ""
        if (!favoriteUser) return
        const id = Number(event.target.id)
        const user_idx = favoriteUser.findIndex((user) => user.id === id)
        if (user_idx === -1) return
        favoriteUser.splice(user_idx, 1)
        localStorage.setItem("favorite_user", JSON.stringify(favoriteUser))
        renderUserList(1)
    }
})
