document.addEventListener("DOMContentLoaded", start());


async function start() {
    const isAuthentified = await test_authentication()
    console.log(isAuthentified)

    // If the user is not authentified
    if (!isAuthentified) {
        console.log("login")
        const login_button = document.querySelector("button#login_button")
        login_button.addEventListener("click", event =>
            window.location.href = "/src/pages/login.html")
    }

    const search_button = document.querySelector("button#search_button")
    search_button.addEventListener("click", event =>
        window.location.href = "/src/pages/search_list.html")
}


async function test_authentication() {
    const response = await fetch("http://localhost:8080/me", {
        method: "GET",
        headers: { "Content-Type": "application/json",
                   "authorization": `Bearer ${sessionStorage.getItem("token")}` }
    })
    return (response.status == 200) ? true : false
}