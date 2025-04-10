import ApiService from "./api_service.js"


export default class UserService extends ApiService {

    constructor() {
        super()
    }

    async updateUsername(username, newUsername) {
        await fetch(`${this.apiUrl}/users/${username}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json",
                       "authorization": `Bearer ${this.token}` },
            body: JSON.stringify({ "username": newUsername })
        })
    }

    async updateEmail(username, newEmail) {
        await fetch(`${this.apiUrl}/users/${username}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json",
                       "authorization": `Bearer ${this.token}` },
            body: JSON.stringify({ "email": newEmail })
        })
    }

    async updatePassword(username, newPassword) {
        await fetch(`${this.apiUrl}/users/${username}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json",
                       "authorization": `Bearer ${this.token}` },
            body: JSON.stringify({ "password": newPassword })
        })
    }

    async updateVisibility(username, newVisibility) {
        await fetch(`${this.apiUrl}/users/${username}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json",
                       "authorization": `Bearer ${this.token}` },
            body: JSON.stringify({ "visibility": newVisibility })
        })
    }

    async deleteAccount(username) {
        await fetch(`${this.apiUrl}/users/${username}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json",
                       "authorization": `Bearer ${this.token}` }
        })
    }

}