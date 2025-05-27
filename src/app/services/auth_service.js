import ApiService from "./api_service.js"


export default class AuthService extends ApiService {

    constructor() {
        super()
    }

    async authenticate() {
        return await fetch(`${this.apiUrl}/me`, {
            method: "GET",
            headers: { "Content-Type": "application/json",
                       "authorization": `Bearer ${this.token}` }
        })
    }

    async signup(user) {
        return await fetch(`${this.apiUrl}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        })
    }

    async login(data) {
        const response = await fetch(`${this.apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        const token = await response.text()
        sessionStorage.setItem("token", token)
    }

}