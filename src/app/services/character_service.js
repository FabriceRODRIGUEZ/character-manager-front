import ApiService from "./api_service.js"


export default class CharacterService extends ApiService {

    constructor() {
        super()
    }

    async addCharacter(character) {
        return await fetch(`${this.apiUrl}/characters`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(character)
        })
    }

}