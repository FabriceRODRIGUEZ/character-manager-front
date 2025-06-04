import ApiService from "./api_service.js"


/**
 * A service for the users
 * @property {string} apiUrl
 * @property {string} token
 * @property {Headers} headers
 */
export default class UserService extends ApiService {

    /**
     * Constructor of the user service
     */
    constructor() {
        super()
    }

    /**
     * Returns a user according to its username
     * @param {string} username
     * @returns {Promise<Object>}
     */
    async getUser(username) {
        const response = await fetch(`${this.apiUrl}/users/${username}`, {
            method: "GET",
            headers: this.headers
        })
        return response.json()
    }

    /**
     * Updates the username of a user
     * @param {string} username
     * @param {string} newUsername
     * @returns {Promise<Response>}
     */
    async updateUsername(username, newUsername) {
        return await fetch(`${this.apiUrl}/users`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify({ "username": newUsername })
        })
    }

    /**
     * Updates the email adress of a user
     * @param {string} username
     * @param {string} newEmail
     * @returns {Promise<Response>}
     */
    async updateEmail(username, newEmail) {
        return await fetch(`${this.apiUrl}/users`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify({ "email": newEmail })
        })
    }

    /**
     * Updates the password of a user
     * @param {string} username
     * @param {string} newPassword
     * @returns {Promise<Response>}
     */
    async updatePassword(username, newPassword) {
        return await fetch(`${this.apiUrl}/users`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify({ "password": newPassword })
        })
    }

    /**
     * Updates the visibility of a user
     * @param {string} username
     * @param {string} newVisibility
     * @returns {Promise<Response>}
     */
    async updateVisibility(username, newVisibility) {
        return await fetch(`${this.apiUrl}/users`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify({ "visibility": newVisibility })
        })
    }

    /**
     * Deletes the user and its characters in the database
     * @returns {Promise<Response>}
     */
    async deleteAccount() {
        return await fetch(`${this.apiUrl}/users`, {
            method: "DELETE",
            headers: this.headers
        })
    }

}