import Character from "../models/character.js"
import AuthService from "../services/auth_service.js"
import CharacterService from "../services/character_service.js"


/**
 * A controller for the home page
 * @property {CharacterService} service
 */
class HomeController {

    /**
     * Constructor of the home controller
     */
    constructor() {
        this.service = new CharacterService()
    }

    /**
     * Displays the right version of the page
     */
    async start() {
        const authentication = await new AuthService().authenticate()
        const isAuthentified = (authentication.status == 200) ? true : false

        if (! isAuthentified) this.displayUnauthentifiedVersion()
        else this.displayAuthentifiedVersion()
    }

    /**
     * Displays the version for an unauthentified user
     */
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

    /**
     * Displays the version for an authentified user
     */
    displayAuthentifiedVersion() {
        const addButton = document.querySelector("button#add_button")
        const loginButton = document.querySelector("button#login_button")
        const accountButton = document.querySelector("button#account_button")
        const list = document.querySelector("div#characters_list")

        addButton.addEventListener("click", () => this.showAddModal())
        loginButton.style.display = "none"
        accountButton.addEventListener("click", () => location.href = "account.html")

        list.style.visibility = "visible"
        this.displayCharactersList()
    }

    /**
     * Displays the list of characters
     */
    async displayCharactersList() {
        const list = document.querySelector("div#characters_list")
        const characters = await this.service.getCharacters()

        characters.forEach(character => {
            const characterElement = this.cloneTemplate("character_template")
            // characterElement.childNodes[1].children[0].children[0].src = "../../res/images/profile.png"
            // characterElement.childNodes[1].children[1].children[0].children[1].innerText = character.first_name
            // characterElement.childNodes[1].children[1].children[0].children[2].innerText = character.last_name
            // characterElement.childNodes[1].children[1].children[1].children[1].innerText = character.work
            // characterElement.childNodes[1].children[1].children[2].children[1].innerText = character.actor
            // characterElement.childNodes[1].children[1].children[3].children[1].innerText = character.voice_actor
            // const star = characterElement.childNodes[1].children[1].children[4].children[1].children[0]
            // characterElement.childNodes[1].children[1].children[4].children[1].appendChild()
            list.appendChild(characterElement)
        })

        document.querySelectorAll("div.character")
                .forEach(character => this.activateCharacterHover(character))
    }

    // #############
    // Modal methods
    // #############

    /**
     * Shows the add modal and activates the event listeners
     */
    showAddModal() {
        const overlay = document.querySelector("div#overlay")
        const addModal = document.querySelector("div#add_modal")
        const textInputs = document.querySelectorAll("#add_modal input[type='text'], textarea")

        overlay.classList.add("show")
        addModal.classList.add("show")

        overlay.addEventListener("click", () => this.closeModal("add_modal"))
        document.querySelector("#add_modal #close_button")
                .addEventListener("click", () => this.closeModal("add_modal"))
        document.querySelector("#add_modal #submit_button")
                .addEventListener("click", () => this.submitAddModal())
        textInputs.forEach(textInput => textInput.addEventListener("keyup", (event) => {
            if (event.key == "Enter") this.submitAddModal()
        }))
    }

    /**
     * Submits the form of the add modal, then close the modal
     */
    submitAddModal() {
        this.addCharacter()
        this.resetFields("add_modal")
        this.closeModal("add_modal")
    }

    /**
     * Resets the fields of a modal form
     * @param {string} modalId
     */
    resetFields(modalId) {
        document.querySelectorAll(`#${modalId} input[type='text'], #${modalId} textarea`)
                .forEach(textInput => textInput.value = "")
        document.querySelector(`#${modalId} input[name='gender']`).checked = true
        document.querySelector(`#${modalId} input[name='appreciation']`).checked = true
    }

    /**
     * Closes a modal
     * @param {string} modalId
     */
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove("show")
        document.getElementById("overlay").classList.remove("show")
    }

    // ##############
    // Action methods
    // ##############

    /**
     * Creates a character from the fields and adds it to the database
     */
    async addCharacter() {
        const properties = []
        const formInputs = document.querySelectorAll("input[type='text'], input[type='radio']:checked, textarea")
        formInputs.forEach(input => properties.push(input.value))

        const character = new Character(properties)
        await new CharacterService().addCharacter(character)
    }

    // ############
    // Tool methods
    // ############

    /**
     * Creates an HTML element from a template id
     * @param {string} templateId
     * @returns {Element}
     */
    cloneTemplate(templateId) {
        return document.getElementById(templateId).content.cloneNode(true)
    }

    /**
     * Activates the hidden buttons display for a character
     * @param {Element} character
     */
    activateCharacterHover(character) {
        character.addEventListener("mouseenter", event => {
            const hiddenButtons = event.target.children[2]
            hiddenButtons.style.visibility = "visible" })
        character.addEventListener("mouseleave", event => {
            const hiddenButtons = event.target.children[2]
            hiddenButtons.style.visibility = "hidden" })
    }

}


document.addEventListener("DOMContentLoaded", new HomeController().start())