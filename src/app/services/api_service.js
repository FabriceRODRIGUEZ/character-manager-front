/**
 * A service to access to the API
 * @property {string} apiUrl
 * @property {string} token
 * @property {Headers} headers
 */
export default class ApiService {

    /**
     * Constructor of the API service
     */
    constructor() {
        // this.apiUrl = "http://localhost:8080"
        this.apiUrl = "https://www.main-bvxea6i-f243wjcs3wrdu.fr-4.platformsh.site"
        this.token = sessionStorage.getItem("token")
        this.headers = new Headers()

        this.headers.append("Content-Type", "application/json")
        if (this.token !== undefined) {
            this.headers.append("authorization", `Bearer ${this.token}`)
        } else {
            this.headers.append("authorization", `Bearer `)
        }
    }

}