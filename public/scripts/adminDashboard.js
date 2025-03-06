// To display user information as admin
document.addEventListener("DOMContentLoaded", async () => {

    // Get the token, username, and role from local storage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    // Set username on the page
    document.getElementById("username").innerText = username;
});
