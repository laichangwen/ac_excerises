const base_url = "https://lighthouse-user-api.herokuapp.com"
const index_url = base_url + "/api/v1/users/"
const base_country_url = "https://restcountries.eu/"
const country_v_url = base_country_url + "rest/v2/all"
const userPerPage = 30
// const evts = ["click", "change"]
const data = []
let mapping = []

const model = {
    users: [],
    filteredUsers: [],
    countries: [],
    countriesRegionMapping: {},
    filtersSet: [],
    favoriteCnt: 0,
    currentPage: 1,
}

const view = {
    displayUsers() {
        axios.get(index_url).then((response) => {
            model.users.push(...response.data.results)
            this.renderUserList(model.currentPage)
            this.renderPaginator(model.users.length)
        }).catch((error) => console.log(error))
    },

    displayRegions() {
        axios.get(country_v_url).then((response) => {
            model.countries.push(...response.data)
            this.countriesinRegion()
            view.renderRegion()
        }).catch((err) => console.log(err))
    },

    showfavoriteCnt() {
        document.querySelector("#favorite-cnt").innerText = model.favoriteCnt
    },

    countriesinRegion() {
        model.countries.forEach((country) => {
            const region = country.region
            const name = country.alpha2Code
            if (!model.countriesRegionMapping[region] && region.length > 0) {
                model.countriesRegionMapping[region] = []
            } else if (model.countriesRegionMapping[region]) {
                model.countriesRegionMapping[region].push(name)
            }
        })
    },

    renderRegion() {
        const regions = Object.keys(model.countriesRegionMapping)
        const countryFilter = document.querySelector(".region-filters")
        countryFilter.innerHTML = ""
        regions.forEach((region) => {
            countryFilter.innerHTML += `
		    <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" value="${region}" id=${region}>
            <label class="form-check-label" for="inlineCheckbox1">${region}</label>
            </div>
		    `
        })
    },

    renderPaginator(amount) {
        let pages = Math.ceil(amount / userPerPage)
        const paginator = document.querySelector("#paginator")
        paginator.innerHTML = ""
        for (let page = 1; page <= pages; page++) {
            paginator.innerHTML +=
                `<li class="page-item"><a class="page-link" href="#" id = ${page}>${page}</a></li>`
        }
    },

    renderUserList(page) {
        const start = (page - 1) * userPerPage
        let data = (model.filteredUsers.length > 0) ? model.filteredUsers : model.users
        const end = Math.min(start + userPerPage, data.length)
        const dataPanel = document.querySelector("#data-panel")
        dataPanel.innerHTML = ""
        for (let i = start; i < end; i++) {
            let user = data[i]
            let src = view.checkRegion(user.region).flag
            let nation = view.checkRegion(user.region).name
            dataPanel.innerHTML +=
                `<div class="col-auto">
            <div class="mb-3">
             <div class="card" style="width: 10rem;">
                <img src=${user.avatar} class="card-img-top" alt="..." >
                    <div class="card-body d-flex justify-content-lg-between">
                        <span class="card-text"><em>${user.name + " " + user.surname}</em></span>
                            <button type="button" class="btn btn-primary btn-more-info" data-toggle="modal" data-target="#user-modal" data-id = ${user.id}>+</button>
		</div>
								<div class="card-text d-flex justify-content-center">
              <img src="${src}" width="30" height="20" style="margin:0 10px;vertical-align:middle" alt="" class="flag">
              <p class="text font-italic text-justify" style:"text-align:center;font-size:18px;font-family: "Josefin Sans", sans-serif;">${nation}</p>
			  </div>
        `
        }
    },

    // GetFlags
    checkRegion(item) {
        const net = model.countries.find((country) => {
            return item === country.alpha2Code
        })
        return net
    },

    showUserModal(id) {
        const userModalContent = document.querySelector(".user-modal-content")
        const userTitle = document.querySelector("#user-modal-title")
        const userAvatar = document.querySelector("#user-modal-avatar img")
        const userbtn = document.querySelector(".btn-add-favorite")
        const data = model.users[(id - model.users[0].id)]
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
    },

    clickedbutton(genre) {
        btns = document.querySelectorAll("[class*=btn-gender]")
        btns.forEach((btn) => {
            if (!btn.classList.contains(genre)) {
                btn.classList.add("disabled")
            }
            else {
                btn.classList.add("active")
                if (btn.classList.contains("disabled"))
                    btn.classList.remove("disabled")
            }
        })

    },

}

const controller = {
    generateUsers() {
        this.updatefavoriteCnt()
        view.displayUsers()
        this.generateRegions()
    },

    generateRegions() {
        view.displayRegions()
    },

    updatefavoriteCnt() {
        let cnt = (localStorage.getItem("favorite_user")) ? JSON.parse(localStorage.getItem("favorite_user")).length : 0
        model.favoriteCnt = (model.favoriteCnt != cnt) ? cnt : model.favoriteCnt
        view.showfavoriteCnt()
    },

    updatefavoriteList(id) {
        let list = JSON.parse(localStorage.getItem("favorite_user")) || []
        let user = model.users.find((user) => user.id === id)
        if (list.some((user) => user.id === id)) {
            return alert("This user is already added in favorite!!")
        }
        list.push(user)
        localStorage.setItem("favorite_user", JSON.stringify(list))
        this.updatefavoriteCnt()
    },
    searchItem(text) {
        const searchFilter = document.querySelector(".filter-selector")
        const ind = searchFilter.selectedIndex
        let key = searchFilter.options[ind].value.toLowerCase()
        if (text.length > 0) {
            // filter users by name or surname
            model.filteredUsers = model.users.filter((user) => {
                return user[`${key}`].toLowerCase().includes(text)
            })
            // filter users by gender

            // filter users by region
            // handle search results
            if (model.filteredUsers.length > 0) {
                view.renderUserList(model.currentPage)
            } else {
                document.querySelector("#data-panel").innerHTML = ""
            }
            // render paginator based on search results
            view.renderPaginator(model.filteredUsers.length)
        }
        document.querySelector("#search-keyword").value = ''
    },

    getFilteredRegions() {
        let tmp = []
        document.querySelectorAll('input:checked').forEach((checkbox) => {
            if (checkbox.checked) {
                const region = checkbox.id
                let filtered = model.users.filter((user) => {
                    return model.countriesRegionMapping[region].includes(user.region)
                })
                tmp = tmp.concat(filtered)
            }
        })
        return tmp
    },

    getTargetArray(event) {
        if (event.target.matches(".btn-gender-all")) {
            if (document.querySelectorAll('input:checked').length > 0) {
                return this.getFilteredRegions()
            } else {
                return (model.filteredUsers.length > 0) ? model.filteredUsers : model.users
            }
        } else if (event.target.matches("[class*=btn-gender]")) {
            if (model.filteredUsers.length > 0 && model.filteredUsers.some((user) => user.gender.toLowerCase() === event.target.innerText.toLowerCase()))
                return model.filteredUsers
            else if (document.querySelectorAll('input:checked').length > 0) {
                return this.getFilteredRegions()
            } else {
                return model.users
            }
        } else if (event.target.matches(".form-check-input")) {
            if (model.filteredUsers.length > 0 && model.filteredUsers.some((user) => model.countriesRegionMapping[event.target.id].includes(user.region)))
                return model.filteredUsers
            else {
                let filtered = []
                document.querySelectorAll("[class*=btn-gender]").forEach((gender) => {
                    if (gender.classList.contains("active")) {
                        const sex = gender.innerText.toLowerCase()
                        filtered = model.users.filter((user) => {
                            return user.gender.toLowerCase() === sex
                        })

                    }
                })
                return (filtered.length > 0) ? filtered : model.users
            }
        }
    },

    settingFilters(...settings) {
        settings.forEach((setting) => {
            target = this.getTargetArray(setting)
            console.log(target, setting)
            let tmp = []
            if (setting.target.matches(".btn-gender-all")) {
                model.filteredUsers = target
                view.clickedbutton("btn-gender-all")
            } else if (setting.target.matches(".btn-gender-male")) {
                view.clickedbutton("btn-gender-male")
                model.filteredUsers = target.filter((user) => {
                    return user.gender.toLowerCase() === "male"
                })
            } else if (setting.target.matches(".btn-gender-female")) {
                view.clickedbutton("btn-gender-female")
                model.filteredUsers = target.filter((user) => {
                    return user.gender.toLowerCase() === "female"
                })
            } else if (setting.target.matches(".form-check-input")) {
                const region = setting.target.id
                tmp = target.filter((user) => {
                    return model.countriesRegionMapping[region].includes(user.region)
                })
                model.filteredUsers = (document.querySelectorAll('input:checked').length > 1) ? model.filteredUsers.concat(tmp) : tmp
            }
            model.filtersSet = model.filtersSet.splice(1)
        })
    },

    resetFilters() {
        model.filtersSet = []
        checkboxes = document.querySelectorAll(".form-check-input")
        checkboxes.forEach((checkbox) => checkbox.checked = false)
    }


}

const utility = {
    // strip special characters pattern 
    stripscript(value) {
        const pattern = new RegExp("[ `~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        let rs = "";
        for (var i = 0; i < value.length; i++) {
            rs += value.substr(i, 1).replace(pattern, '');
        }
        return rs;
    }
}

controller.generateUsers()
document.querySelector("#data-panel").addEventListener("click", function onPanelClicked(event) {
    if (event.target.matches(".btn-more-info")) {
        view.showUserModal(Number(event.target.dataset.id))
    }
})

document.querySelector("#paginator").addEventListener("click", function onPaginatorClicked(event) {
    if (event.target.matches(".page-link")) {
        view.renderUserList(Number(event.target.id))
    }
})

document.querySelector("#search").addEventListener("submit", function onSearchEvent(event) {
    event.preventDefault()
    controller.searchItem(utility.stripscript(document.querySelector("#search-keyword").value))
    controller.resetFilters()
})

document.querySelector("#user-modal").addEventListener("click", function onfavoriteClicked(event) {
    if (event.target.matches(".btn-add-favorite")) {
        controller.updatefavoriteList(Number(event.target.id))
    }
})

document.querySelector("#filters").addEventListener("click", function onFitlerEnabled(event) {
    if (event.target.matches("[class*=btn-gender]") || event.target.matches(".form-check-input")) {
        model.filtersSet.push(event)
        controller.settingFilters(...model.filtersSet)
        view.renderUserList(model.currentPage)
        view.renderPaginator(model.filteredUsers.length)
    }

})

// axios.get(index_url).then((response) => {
//     const data = response.data.results
//     users.push(...data)
//     renderRegionList()
//     renderUserList(1)
//     renderPaginator(users.length)
//     let text = (favoriteCnt > 0) ? favoriteCnt : ""
//     navFavorite.innerText = text
// }).catch((error) => console.log(error))

// const dataPanel = document.querySelector("#data-panel")
// const paginator = document.querySelector("#paginator")
// const searchForm = document.querySelector("#search-user")
// const searchFilter = document.querySelector(".filter-selector")
// const fieldFilter = document.querySelector("#filters")
// const countryFilter = document.querySelector(".region-filters")
// const input = document.querySelector("#search-keyword")
// const favoriteModal = document.querySelector("#user-modal")
// const navFavorite = document.querySelector("#favorite-cnt")
// let enabledSettings = []


// axios.get(index_url).then(function show_user(response) {
//     const data = response.data.results
//     users.push(...data)
//     renderRegionList()
//     renderUserList(1)
//     renderPaginator(users.length)
//     let text = (favoriteCnt > 0) ? favoriteCnt : ""
//     navFavorite.innerText = text
// }).catch((error) => console.log(error))


// countryFilter.addEventListener("change", function onCheckboxChange(event) {
//     if (event.target.matches(".form-check-input")) {
//         const region = event.target.id
//         enabledSettings.push(region)
//         enabledSettings.forEach((setting) => {
//             let tmp = users.filter((user) => {
//                 return country_obj[setting].includes(user.region)
//             })
//             filteredUser = filteredUser.concat(tmp)
//         })
//         enabledSettings.splice(1)
//     }

//     if (filteredUser.length > 0) {
//         renderUserList(1)
//         renderPaginator(filteredUser.length)
//     } else {
//         dataPanel.innerHTML = ""
//         clearcheckboxes()
//     }
// })

// fieldFilter.addEventListener("click", function filterUsersByGender(event) {
//     // btn = document.querySelectorAll(".btn-sm")
//     // console.log(event.target)
//     // event.target.classList.toggle("active")
//     // for (let i = 0; i < btn.length; i++) {
//     //     console.log(btn[i])
//     //     console.log(btn[i].matches("active"))
//     //     // if (!btn[i].classList.matches(".active")) {
//     //     //     btn[i].classList.add("disabled")
//     //     // }
//     // }
//     if (event.target.matches(".btn-gender-all")) {
//         genderlist = users
//     } else if (event.target.matches(".btn-gender-male")) {
//         genderlist = users.filter((user) => {
//             return user.gender.toLowerCase() === "male"
//         })

//     } else if (event.target.matches(".btn-gener-female")) {
//         genderlist = users.filter((user) => {
//             return user.gender.toLowerCase() === "female"
//         })
//     }
//     filteredUser = genderlist
//     renderUserList(1)
//     renderPaginator(filteredUser.length)

//     countryFilter.addEventListener("change", function onCheckboxChange(event) {
//         if (event.target.matches(".form-check-input")) {
//             const region = event.target.id
//             let regionlist = []
//             enabledSettings.push(region)
//             enabledSettings.forEach((setting) => {
//                 let tmp = genderlist.filter((user) => {
//                     return country_obj[setting].includes(user.region)
//                 })
//                 regionlist = regionlist.concat(tmp)
//             })
//             enabledSettings.splice(1)
//             filteredUser = regionlist
//         }
//         if (filteredUser.length > 0) {
//             renderUserList(1)
//             renderPaginator(filteredUser.length)
//         } else {
//             dataPanel.innerHTML = ""
//             clearcheckboxes()
//         }
//     })

// })


// // multipe event listeners on 1 element
// evts.forEach((evt) => {
//     searchForm.addEventListener(evt, function onSearchEvent(event) {
//         event.preventDefault()
//         searchItem(stripscript(input.value), event)
//     }, false)
// })