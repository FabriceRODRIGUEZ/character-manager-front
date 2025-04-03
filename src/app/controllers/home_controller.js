class HomeController {

    constructor() {
        if(!this.test_authentication) {
            const login_button = document.querySelector("button#login_button")
            login_button.addEventListener("click", event =>
                window.location.replace("/src/pages/login.html"))
        }

        const search_button = document.querySelector("button#search_button")
        search_button.addEventListener("click", event =>
            window.location.replace("/src/pages/search_list.html"))
    }

    async test_authentication() {
        const response = await fetch("http://localhost:8080/me", {
            method: "GET",
            headers: { "Content-Type": "application/json",
                       "authorization": sessionStorage.getItem("token") }
        })
        return true
    }

}

document.addEventListener("DOMContentLoaded", new HomeController());