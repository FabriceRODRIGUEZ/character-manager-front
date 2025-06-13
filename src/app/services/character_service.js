import ApiService from "./api_service.js"


/**
 * A service for the characters
 * @property {string} apiUrl
 * @property {string} token
 * @property {Headers} headers
 */
export default class CharacterService extends ApiService {

    /**
     * Constructor of the character service
     */
    constructor() {
        super()
    }

    async getCharacters(sortProperty, sortOrder, filters) {
        const url = `${this.apiUrl}/characters?first_name=${(filters.first_name) ? filters.first_name : ""}&last_name=${(filters.last_name) ? filters.last_name : ""}&gender=${(filters.gender) ? filters.gender : ""}&work=${(filters.work) ? filters.work : ""}&actor=${(filters.actor) ? filters.actor : ""}&voice_actor=${(filters.voice_actor) ? filters.voice_actor : ""}&comment=${(filters.comment) ? filters.comment : ""}&appreciation=${(filters.appreciation) ? filters.appreciation : ""}&sort_property=${sortProperty}&sort_order=${sortOrder}`
        const response = await fetch(url, {
            method: "GET",
            headers: this.headers
        })
        return response.json()
    }

    /**
     * Returns a character according to its id
     * @returns {Promise<Object>}
     */
    async getCharacter(characterId) {
        const response = await fetch(`${this.apiUrl}/characters/${characterId}`, {
            method: "GET",
            headers: this.headers
        })
        return response.json()
    }

    /**
     * Adds a character to the database
     * @param {Character} character
     * @returns {Promise<Response>}
     */
    async addCharacter(character) {
        return await fetch(`${this.apiUrl}/characters`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(character)
        })
    }

    /**
     * Updates a character in the database
     * @param {number} characterId
     * @param {Character} character
     * @returns {Promise<Response>}
     */
    async editCharacter(characterId, character) {
        return await fetch(`${this.apiUrl}/characters/${characterId}`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(character)
        })
    }

    /**
     * Deletes a character in the database
     * @param {number} characterId
     * @returns {Promise<Response>}
     */
    async deleteCharacter(characterId) {
        return await fetch(`${this.apiUrl}/characters/${characterId}`, {
            method: "DELETE",
            headers: this.headers
        })
    }

}