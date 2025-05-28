import ApiService from "./api_service.js"


export default class CharacterService extends ApiService {

    constructor() {
        super()
    }

    async getCharacters() {
        const response =  await fetch(`${this.apiUrl}/characters`, {
            method: "GET",
            headers: this.headers
        })
        return response.json()
    }

    async addCharacter(character) {
        return await fetch(`${this.apiUrl}/characters`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(character)
        })
    }

}