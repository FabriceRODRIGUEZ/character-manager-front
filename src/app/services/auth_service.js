import ApiService from "./api_service.js"


/**
 * A service for the authentication
 * @property {string} apiUrl
 * @property {string} token
 * @property {Headers} headers
 */
export default class AuthService extends ApiService {

    /**
     * Constructor of the authentication service
     */
    constructor() {
        super()
    }

    /**
     * Signs up a user
     * @returns {Promise<Response>}
     */
    async signup(user) {
        return await fetch(`${this.apiUrl}/signup`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(user)
        })
    }

    /**
     * Logs in a user
     * @returns {Promise<Response>}
     */
    async login(data) {
        const response = await fetch(`${this.apiUrl}/login`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(data)
        })
        if (response.status == 200) {
            const token = await response.text()
            sessionStorage.setItem("token", token)
        }
        return response
    }

    /**
     * Authenticates the user connected
     * @returns {Promise<Response>}
     */
    async authenticate() {
        return await fetch(`${this.apiUrl}/me`, {
            method: "GET",
            headers: this.headers
        })
    }

}