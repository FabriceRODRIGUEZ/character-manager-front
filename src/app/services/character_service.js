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

    /**
     * Returns the characters of a user
     * @returns {Promise<Object>}
     */
    async getCharacters() {
        const response =  await fetch(`${this.apiUrl}/characters`, {
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

}