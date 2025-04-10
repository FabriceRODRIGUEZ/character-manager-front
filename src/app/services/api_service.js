export default class ApiService {

    constructor() {
        this.apiUrl = "http://localhost:8080"
        this.token = sessionStorage.getItem("token")
        this.headers = new Headers()
        if (this.token !== undefined) {
            this.headers.append("authorization", `Bearer ${this.token}`)
        } else {
            this.headers.append("authorization", `Bearer `)
        }
    }

}