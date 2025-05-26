import AuthService from "../services/auth_service.js"


class HomeController {

    async start() {
        const authentication = await new AuthService().authenticate()
        const addButton = document.querySelector("button#add_button")
        const filterButton = document.querySelector("button#filter_button")
        const sortProperty = document.querySelector("select[name='sort_property']")
        const sortOrder = document.querySelector("select[name='sort_order']")
        const loginButton = document.querySelector("button#login_button")
        const accountButton = document.querySelector("button#account_button")
        const message = document.querySelector("div#message")
        const list = document.querySelector("div#characters_list")

        // If the user is not authentified
        if (authentication.status == 401) {
            addButton.classList.remove("active")
            addButton.children[0].classList.add("show")

            filterButton.classList.remove("active")
            filterButton.children[0].classList.add("show")

            sortProperty.classList.add("inactive")
            for (let option of sortProperty.children) {
                console.log(option)
                option.disabled = true
            }
            sortOrder.classList.add("inactive")
            for (let option of sortOrder.children) {
                console.log(option)
                option.disabled = true
            }

            accountButton.style.display = "none"
            loginButton.addEventListener("click", () =>
                location.href = "login.html")

            message.style.display = "block"
        }
        
        else {
            addButton.addEventListener("click", () => {
                showAddModal()
            })

            loginButton.style.display = "none"
            accountButton.addEventListener("click", () =>
                location.href = "account.html")

            list.style.visibility = "visible"

            const characters = document.querySelectorAll("div.character")
            characters.forEach(character => {
                character.addEventListener("mouseenter", event => {
                    const buttons = event.target.children[2]
                    buttons.style.visibility = "visible"})
                character.addEventListener("mouseleave", event => {
                    const buttons = event.target.children[2]
                    buttons.style.visibility = "hidden"})
            })
        }

        function showAddModal() {
            const overlay = document.querySelector("div#overlay")
            const addModal = document.querySelector("div#add_modal")
            overlay.classList.add("show")
            addModal.classList.add("show")
        }

    }

}


document.addEventListener("DOMContentLoaded", new HomeController().start())