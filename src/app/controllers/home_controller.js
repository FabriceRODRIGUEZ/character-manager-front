import Character from "../models/character.js"
import AuthService from "../services/auth_service.js"
import CharacterService from "../services/character_service.js"


class HomeController {

    async start() {
        const authentication = await new AuthService().authenticate()
        const isAuthentified = (authentication.status == 200) ? true : false

        if (! isAuthentified) {
            this.displayUnauthentifiedVersion()
        } else {
            this.displayAuthentifiedVersion()
        }
    }

    // Display methods :

    displayUnauthentifiedVersion() {
        const addButton = document.querySelector("button#add_button")
        const filterButton = document.querySelector("button#filter_button")
        const sortProperty = document.querySelector("select[name='sort_property']")
        const sortOrder = document.querySelector("select[name='sort_order']")
        const loginButton = document.querySelector("button#login_button")
        const accountButton = document.querySelector("button#account_button")
        const message = document.querySelector("div#message")

        addButton.classList.remove("active")
        addButton.children[0].classList.add("show")

        filterButton.classList.remove("active")
        filterButton.children[0].classList.add("show")

        sortProperty.classList.add("inactive")
        for (let option of sortProperty.children) { option.disabled = true }
        sortOrder.classList.add("inactive")
        for (let option of sortOrder.children) { option.disabled = true }

        accountButton.style.display = "none"
        loginButton.addEventListener("click", () => location.href = "login.html")

        message.style.display = "block"
    }

    displayAuthentifiedVersion() {
        const addButton = document.querySelector("button#add_button")
        const loginButton = document.querySelector("button#login_button")
        const accountButton = document.querySelector("button#account_button")
        const list = document.querySelector("div#characters_list")
        const characters = document.querySelectorAll("div.character")

        addButton.addEventListener("click", () => this.showAddModal())
        loginButton.style.display = "none"
        accountButton.addEventListener("click", () => location.href = "account.html")

        list.style.visibility = "visible"
        characters.forEach(character => this.activateCharacterHover(character))
    }

    activateCharacterHover(character) {
        character.addEventListener("mouseenter", event => {
            const hiddenButtons = event.target.children[2]
            hiddenButtons.style.visibility = "visible" })
        character.addEventListener("mouseleave", event => {
            const hiddenButtons = event.target.children[2]
            hiddenButtons.style.visibility = "hidden" })
    }

    showAddModal() {
        const overlay = document.querySelector("div#overlay")
        const addModal = document.querySelector("div#add_modal")
        const textInputs = document.querySelectorAll("#add_modal input[type='text'], textarea")

        overlay.classList.add("show")
        addModal.classList.add("show")

        overlay.addEventListener("click", () => this.closeModal(addModal))
        document.querySelector("#add_modal #close_button")
                .addEventListener("click", () => this.closeModal(addModal))
        document.querySelector("#add_modal #submit_button")
                .addEventListener("click", () => {
                    this.addCharacter()
                    textInputs.forEach(textInput => textInput.value = "")
                    this.closeModal(addModal)
                })
        textInputs.forEach(textInput => textInput.addEventListener("keyup", (event) => {
            if (event.key == "Enter") {
                this.addCharacter
                textInputs.forEach(textInput => textInput.value = "")
                document.querySelector("#add_modal input#man").checked = true
                document.querySelector("#add_modal input#1_star").checked = true
                console.log(document.querySelector("#add_modal input#1_star"))
                this.closeModal(addModal)
            }
        }))
    }

    closeModal(modal) {
        modal.classList.remove("show")
        document.querySelector("div#overlay").classList.remove("show")
    }

    // Tool methods :

    async addCharacter() {
        const properties = []
        const formInputs = document.querySelectorAll("input[type='text'], input[type='radio']:checked, textarea")
        formInputs.forEach(input => properties.push(input.value))

        // const character = new Character(properties)
        // await new CharacterService().addCharacter(character)
    }

}


document.addEventListener("DOMContentLoaded", new HomeController().start())