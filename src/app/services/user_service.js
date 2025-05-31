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
     * Updates the username of a user
     * @param {string} username
     * @param {string} newUsername
     * @returns {Promise<Response>}
     */
    async updateUsername(username, newUsername) {
        return await fetch(`${this.apiUrl}/users/${username}`, {
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
        return await fetch(`${this.apiUrl}/users/${username}`, {
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
        return await fetch(`${this.apiUrl}/users/${username}`, {
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
        return await fetch(`${this.apiUrl}/users/${username}`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify({ "visibility": newVisibility })
        })
    }

    /**
     * Deletes a user and its characters in the database
     * @param {string} username
     * @returns {Promise<Response>}
     */
    async deleteAccount(username) {
        return await fetch(`${this.apiUrl}/users/${username}`, {
            method: "DELETE",
            headers: this.headers
        })
    }

}