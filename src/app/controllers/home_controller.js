import Character from "../models/character.js"
import AuthService from "../services/auth_service.js"
import CharacterService from "../services/character_service.js"


/**
 * A controller for the home page
 * @property {CharacterService} service
 * @property {Element} overlay
 * @property {() => void} handleOverlayClick
 */
class HomeController {

    /**
     * Constructor of the home controller
     */
    constructor() {
        this.service = new CharacterService()
        this.overlay = document.querySelector("div#overlay")
    }

    /**
     * Displays the right version of the page
     * @returns {Promise<void>}
     */
    async start() {
        const authentication = await new AuthService().authenticate()
        const isAuthentified = (authentication.status == 200) ? true : false

        if (! isAuthentified) this.displayUnauthentifiedVersion()
        else this.displayAuthentifiedVersion()
    }


    // #################### //
    // Page version methods //
    // #################### //

    /**
     * Displays the version for an unauthentified user
     * @returns {void}
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
     * @returns {void}
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


    // ####################### //
    // Characters list methods //
    // ####################### //

    /**
     * Displays the list of characters
     * @returns {Promise<void>}
     */
    async displayCharactersList() {
        const list = document.querySelector("div#characters_list")
        const characters = await this.service.getCharacters()

        characters.forEach(character => {
            const characterElement = this.cloneTemplate("character_template")
            this.fillCharacterElement(characterElement, character)
            list.appendChild(characterElement)
        })

        document.querySelectorAll("div.character")
                .forEach(characterElement => this.activateCharacterHover(characterElement))
    }

    /**
     * Reloads the list of characters
     * @returns {void}
     */
    reloadCharactersList() {
        const list = document.querySelector("div#characters_list")
        const characterElements = document.querySelectorAll("div.character")
        characterElements.forEach(characterElement => list.removeChild(characterElement))
        this.displayCharactersList()
    }

    /**
     * Fills a character element with the properties of a character
     * @param {Element} characterElement
     * @param {Object} character
     * @returns {void}
     */
    fillCharacterElement(characterElement, character) {
        if (character.gender == "F") {
            characterElement.querySelector("div.property:nth-child(3) > span.property_name").innerHTML = "Actrice :"
            characterElement.querySelector("div.property:nth-child(4) > span.property_name").innerHTML = "Doubleuse :"
        }

        if (character.profile) characterElement.querySelector("div.profile img").src = character.profile
        if (character.first_name) characterElement.querySelector("span.first_name").innerHTML = character.first_name
        if (character.last_name) characterElement.querySelector("span.last_name").innerHTML = character.last_name
        if (character.work) characterElement.querySelector("span.work").innerHTML = character.work
        if (character.actor) characterElement.querySelector("span.actor").innerHTML = character.actor
        if (character.voice_actor) characterElement.querySelector("span.voice_actor").innerHTML = character.voice_actor

        for (let i = 1 ; i <= character.appreciation ; i++) {
            const star = new Image()
            star.src = "../../res/icons/star.ico"
            star.alt = "Étoile"
            characterElement.querySelector("div.appreciation").appendChild(star)
        }

        characterElement.querySelector("button.edit_button")
                        .addEventListener("click", () => this.showEditModal(character.id))

        characterElement.querySelector("button.delete_button")
                        .addEventListener("click", () => this.showDeleteModal(character.id))
    }

    /**
     * Activates the hidden buttons display for a character
     * @param {Element} characterElement
     * @returns {void}
     */
    activateCharacterHover(characterElement) {
        characterElement.addEventListener("mouseenter", event => {
            const hiddenButtons = event.target.children[2]
            hiddenButtons.style.visibility = "visible" })
        characterElement.addEventListener("mouseleave", event => {
            const hiddenButtons = event.target.children[2]
            hiddenButtons.style.visibility = "hidden" })
    }


    // ################# //
    // Add modal methods //
    // ################# //

    /**
     * Shows the add modal and activates the event listeners
     * @returns {void}
     */
    showAddModal() {
        document.body.appendChild(this.cloneTemplate("add_modal_template"))
        const addModal = document.querySelector("div#add_modal")
        this.handleOverlayClick = () => this.closeModal("add_modal")

        this.overlay.classList.add("show")
        setTimeout(() => addModal.classList.add("show"), 0)

        this.overlay.addEventListener("click", this.handleOverlayClick)

        document.querySelector("#close_button")
                .addEventListener("click", () => this.closeModal("add_modal"))

        document.querySelector("#submit_button")
                .addEventListener("click", () => this.submitAddModal())

        document.querySelectorAll("input[type='text']")
                .forEach(textInput => textInput.addEventListener("keyup", (event) => {
                    if (event.key == "Enter") this.submitAddModal()
                }))

        document.querySelector("input[type='radio']#man")
                .addEventListener("click", () => {
                    document.querySelector("label[for='actor']").innerHTML = "Acteur :"
                    document.querySelector("label[for='voice_actor']").innerHTML = "Doubleur :"
                })
        
        document.querySelector("input[type='radio']#woman")
                .addEventListener("click", () => {
                    document.querySelector("label[for='actor']").innerHTML = "Actrice :"
                    document.querySelector("label[for='voice_actor']").innerHTML = "Doubleuse :"
                })
    }

    /**
     * Submits the form of the add modal,
     * then closes the modal and reloads the list
     * @returns {void}
     */
    submitAddModal() {
        this.addCharacter()
        this.closeModal("add_modal")
        this.reloadCharactersList()
    }

    /**
     * Creates a character from the fields and adds it to the database
     * @returns {Promise<void>}
     */
    async addCharacter() {
        const properties = []
        const formInputs = document.querySelectorAll("input[type='text'], input[type='radio']:checked, textarea")
        formInputs.forEach(input => properties.push(input.value))
        const character = new Character(properties)
        await this.service.addCharacter(character)
    }


    // ################## //
    // Edit modal methods //
    // ################## //

    /**
     * Shows the edit modal and activates the event listeners
     * @param {number} characterId
     * @returns {void}
     */
    showEditModal(characterId) {
        document.body.appendChild(this.cloneTemplate("edit_modal_template"))
        const editModal = document.querySelector("div#edit_modal")
        this.handleOverlayClick = () => this.closeModal("edit_modal")

        this.fillEditModal(characterId)
        this.overlay.classList.add("show")
        setTimeout(() => editModal.classList.add("show"), 0)

        this.overlay.addEventListener("click", this.handleOverlayClick)

        document.querySelector("#close_button")
                .addEventListener("click", () => this.closeModal("edit_modal"))

        document.querySelector("#submit_button")
                .addEventListener("click", () => this.submitEditModal(characterId))

        document.querySelectorAll("input[type='text']")
                .forEach(textInput => textInput.addEventListener("keyup", (event) => {
                    if (event.key == "Enter") this.submitEditModal(characterId)
                }))

        document.querySelector("input[type='radio']#man")
                .addEventListener("click", () => {
                    document.querySelector("label[for='actor']").innerHTML = "Acteur :"
                    document.querySelector("label[for='voice_actor']").innerHTML = "Doubleur :"
                })
        
        document.querySelector("input[type='radio']#woman")
                .addEventListener("click", () => {
                    document.querySelector("label[for='actor']").innerHTML = "Actrice :"
                    document.querySelector("label[for='voice_actor']").innerHTML = "Doubleuse :"
                })
    }

    /**
     * Fills the edit modal from a character id
     * @param {number} characterId
     * @returns {Promise<void>}
     */
    async fillEditModal(characterId) {
        const editModal = document.querySelector("div#edit_modal")
        const character = await new CharacterService().getCharacter(characterId)

        if (character.first_name) editModal.querySelector("input#first_name").value = character.first_name
        if (character.last_name) editModal.querySelector("input#last_name").value = character.last_name
        if (character.gender == "F") editModal.querySelector("input[type='radio']#woman").checked = true
        if (character.work) editModal.querySelector("input#work").value = character.work
        if (character.actor) editModal.querySelector("input#actor").value = character.actor
        if (character.voice_actor) editModal.querySelector("input#voice_actor").value = character.voice_actor
        if (character.profile) editModal.querySelector("input#profile").value = character.profile
        if (character.comment) editModal.querySelector("textarea#comment").value = character.comment
        editModal.querySelectorAll("input[name='appreciation']").item(character.appreciation - 1).checked = true

        if (character.gender == "F") {
            editModal.querySelector("label[for='actor']").innerHTML = "Actrice :"
            editModal.querySelector("label[for='voice_actor']").innerHTML = "Doubleuse :"
        }
    }

    /**
     * Submits the form of the edit modal,
     * then closes the modal and reloads the list
     * @param {number} characterId
     * @returns {void}
     */
    submitEditModal(characterId) {
        this.editCharacter(characterId)
        this.closeModal("edit_modal")
        this.reloadCharactersList()
    }

    /**
     * Updates a character from the fields in the database
     * @param {number} characterId
     * @returns {Promise<void>}
     */
    async editCharacter(characterId) {
        const properties = []
        const formInputs = document.querySelectorAll("input[type='text'], input[type='radio']:checked, textarea")
        formInputs.forEach(input => properties.push(input.value))
        const character = new Character(properties)
        await this.service.editCharacter(characterId, character)
    }


    // #################### //
    // Delete modal methods //
    // #################### //

    /**
     * Shows the delete modal and activates the event listeners
     * @param {number} characterId
     * @returns {void}
     */
    showDeleteModal(characterId) {
        document.body.appendChild(this.cloneTemplate("delete_modal_template"))
        const deleteModal = document.querySelector("div#delete_modal")
        this.handleOverlayClick = () => this.closeModal("delete_modal")

        this.overlay.classList.add("show")
        setTimeout(() => deleteModal.classList.add("show"), 0)

        this.overlay.addEventListener("click", this.handleOverlayClick)

        document.querySelector("#close_button")
                .addEventListener("click", () => this.closeModal("delete_modal"))

        document.querySelector("#submit_button")
                .addEventListener("click", () => this.submitDeleteModal(characterId))
    }

    /**
     * Deletes the character,
     * then closes the modal and reloads the list
     * @param {number} characterId
     * @returns {void}
     */
    submitDeleteModal(characterId) {
        new CharacterService().deleteCharacter(characterId)
        this.closeModal("delete_modal")
        this.reloadCharactersList()
    }


    // #################### //
    // Filter modal methods //
    // #################### //

    /**
     * Shows the filter modal and activates the event listeners
     * @returns {void}
     */
    showFilterModal() {
        document.body.appendChild(this.cloneTemplate("filter_modal_template"))
        const filterModal = document.querySelector("div#filter_modal")
        this.handleOverlayClick = () => this.closeModal("filter_modal")

        this.overlay.classList.add("show")
        setTimeout(() => filterModal.classList.add("show"), 0)
        // this.fillFilterModal()

        this.overlay.addEventListener("click", this.handleOverlayClick)

        document.querySelector("#close_button")
                .addEventListener("click", () => this.closeModal("filter_modal"))

        // a#reset_link

        // document.querySelector("#submit_button")
        //         .addEventListener("click", () => this.submitFilterModal())

        // document.querySelectorAll("input[type='text']")
        //         .forEach(textInput => textInput.addEventListener("keyup", (event) => {
        //             if (event.key == "Enter") this.submitFilterModal()
        //         }))
    }


    // ############ //
    // Tool methods //
    // ############ //

    /**
     * Creates an HTML element from a template id
     * @param {string} templateId
     * @returns {Element}
     */
    cloneTemplate(templateId) {
        return document.getElementById(templateId).content.cloneNode(true)
    }

    /**
     * Resets the fields of a modal form
     * @returns {void}
     */
    resetFields() {
        document.querySelectorAll(`input[type='text'], textarea`)
                .forEach(textInput => textInput.removeAttribute("value"))
        document.querySelector(`input[name='gender']`).checked = true
        document.querySelector(`input[name='appreciation']`).checked = true
    }

    /**
     * Closes a modal according to its id
     * @param {string} modalId
     * @returns {void}
     */
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove("show")
        this.overlay.classList.remove("show")
        setTimeout(() => document.getElementById(modalId).remove(), 400)
        this.overlay.removeEventListener("click", this.handleOverlayClick)
    }

}


document.addEventListener("DOMContentLoaded", new HomeController().start())