import Character from "../models/character.js"
import AuthService from "../services/auth_service.js"
import CharacterService from "../services/character_service.js"


/**
 * A controller for the home page
 * @property {CharacterService} service
 * @property {string} sortProperty
 * @property {string} sortOrder
 * @property {Element} overlay
 * @property {() => void} handleOverlayClick
 */
class HomeController {

    /**
     * Constructor of the home controller
     */
    constructor() {
        this.service = new CharacterService()
        this.sortProperty = "first_name"
        this.sortOrder = "ascendant"
        this.filters = {}
        this.overlay = document.querySelector("div#overlay")
        this.handleOverlayClick = () => {}
        this.toast = document.querySelector("div#toast")
        this.toastTimeout = null
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
        const sortPropertySelect = document.querySelector("select[name='sort_property']")
        const sortOrderSelect = document.querySelector("select[name='sort_order']")
        const accountButton = document.querySelector("button#account_button")
        const loginButton = document.querySelector("button#login_button")
        const mentionsLink = document.querySelector("a#mentions")
        const message = document.querySelector("div#message")

        addButton.classList.remove("active")
        addButton.children[0].classList.add("show")

        filterButton.classList.remove("active")
        filterButton.children[0].classList.add("show")

        sortPropertySelect.classList.add("inactive")
        for (let option of sortPropertySelect.children) { option.disabled = true }
        sortOrderSelect.classList.add("inactive")
        for (let option of sortOrderSelect.children) { option.disabled = true }

        accountButton.style.display = "none"
        loginButton.addEventListener("click", () => location.href = "login.html")

        mentionsLink.addEventListener("click", () => location.href = "mentions.html")

        message.style.display = "block"
    }

    /**
     * Displays the version for an authentified user
     * @returns {void}
     */
    displayAuthentifiedVersion() {
        const addButton = document.querySelector("button#add_button")
        const filterButton = document.querySelector("button#filter_button")
        const sortPropertySelect = document.querySelector("select[name='sort_property']")
        const sortOrderSelect = document.querySelector("select[name='sort_order']")
        const accountButton = document.querySelector("button#account_button")
        const loginButton = document.querySelector("button#login_button")
        const mentionsLink = document.querySelector("a#mentions")
        const list = document.querySelector("div#characters_list")

        addButton.addEventListener("click", () => this.showAddModal())
        filterButton.addEventListener("click", () => this.showFilterModal())
        sortPropertySelect.addEventListener("change", (event) => {
            this.sortProperty = event.target.value
            this.reloadCharactersList() })
        sortOrderSelect.addEventListener("change", (event) => {
            this.sortOrder = event.target.value
            this.reloadCharactersList() })
        accountButton.addEventListener("click", () => location.href = "account.html")
        mentionsLink.addEventListener("click", () => location.href = "mentions.html")

        loginButton.style.display = "none"
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
        const characters = await this.service.getCharacters(this.sortProperty, this.sortOrder, this.filters)

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
    async submitAddModal() {
        clearTimeout(this.toastTimeout)
        const properties = []
        const formInputs = document.querySelectorAll("input[type='text'], input[type='radio']:checked, textarea")
        formInputs.forEach(input => properties.push(input.value))
        const character = new Character(properties)
        const response = await this.service.addCharacter(character)
        const message = (response.status != 201) ? await response.text() : null

        if (response.status == 201) {
            this.closeModal("add_modal")
            this.reloadCharactersList()
        }
        
        else if (message == "Missing field(s)") {
            toast.innerText = "Champ(s) manquant(s)"
            toast.classList.add("show")
            this.toastTimeout = setTimeout(() => toast.classList.remove("show"), 3000)
        }
    }

    /**
     * Creates a character from the fields and adds it to the database
     * @returns {Promise<void>}
     */
    async addCharacter() {
        // clearTimeout(this.toastTimeout)
        // const properties = []
        // const formInputs = document.querySelectorAll("input[type='text'], input[type='radio']:checked, textarea")
        // formInputs.forEach(input => properties.push(input.value))
        // const character = new Character(properties)
        // const response = await this.service.addCharacter(character)
        // const message = (response.status != 201) ? await response.text() : null

        // if (message == "Missing field(s)") {
        //     toast.innerText = "Champ(s) manquant(s)"
        //     toast.classList.add("show")
        //     this.toastTimeout = setTimeout(() => toast.classList.remove("show"), 3000)
        // }
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
    async submitEditModal(characterId) {
        await this.editCharacter(characterId)
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
    async submitDeleteModal(characterId) {
        await this.service.deleteCharacter(characterId)
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
        this.fillFilterModal()

        this.overlay.addEventListener("click", this.handleOverlayClick)

        document.querySelector("#close_button")
                .addEventListener("click", () => this.closeModal("filter_modal"))

        document.querySelector("a#reset_link")
                .addEventListener("click", () => this.resetFields())

        document.querySelector("#submit_button")
                .addEventListener("click", () => this.submitFilterModal())

        document.querySelectorAll("input[type='text']")
                .forEach(textInput => textInput.addEventListener("keyup", (event) => {
                    if (event.key == "Enter") this.submitFilterModal()
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

    fillFilterModal() {
        const filterModal = document.querySelector("div#filter_modal")

        if (this.filters.first_name) filterModal.querySelector("input#first_name").value = this.filters.first_name
        if (this.filters.last_name) filterModal.querySelector("input#last_name").value = this.filters.last_name
        if (this.filters.gender == "M") filterModal.querySelector("input[type='radio']#man").checked = true
        if (this.filters.gender == "F") filterModal.querySelector("input[type='radio']#woman").checked = true
        if (this.filters.work) filterModal.querySelector("input#work").value = this.filters.work
        if (this.filters.actor) filterModal.querySelector("input#actor").value = this.filters.actor
        if (this.filters.voice_actor) filterModal.querySelector("input#voice_actor").value = this.filters.voice_actor
        if (this.filters.comment) filterModal.querySelector("textarea#comment").value = this.filters.comment
        if (this.filters.appreciation) {
            filterModal.querySelectorAll("input[name='appreciation']")
                       .item(this.filters.appreciation - 1).checked = true
        }

        if (this.filters.gender == "F") {
            filterModal.querySelector("label[for='actor']").innerHTML = "Actrice :"
            filterModal.querySelector("label[for='voice_actor']").innerHTML = "Doubleuse :"
        }
    }

    /**
     * Resets the fields of a modal form
     * @returns {void}
     */
    resetFields() {
        document.querySelectorAll(`input[type='text']`)
                .forEach(textInput => textInput.value = "")
        document.querySelectorAll(`input[type='radio']`)
                .forEach(radioInput => radioInput.checked = false)
        document.querySelector("label[for='actor']").innerHTML = "Acteur :"
        document.querySelector("label[for='voice_actor']").innerHTML = "Doubleur :"
    }

    submitFilterModal() {
        const checkedGenderInput = document.querySelector("input[name='gender']:checked")
        const checkedAppreciationInput = document.querySelector("input[name='appreciation']:checked")

        this.filters.first_name = document.querySelector("input#first_name").value
        this.filters.last_name = document.querySelector("input#last_name").value
        this.filters.gender = (checkedGenderInput) ? checkedGenderInput.value : ""
        this.filters.work = document.querySelector("input#work").value
        this.filters.actor = document.querySelector("input#actor").value
        this.filters.voice_actor = document.querySelector("input#voice_actor").value
        this.filters.comment = document.querySelector("input#comment").value
        this.filters.appreciation = (checkedAppreciationInput) ? checkedAppreciationInput.value : ""

        this.closeModal("filter_modal")
        this.reloadCharactersList()
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