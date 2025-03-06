// Display admin information
document.addEventListener("DOMContentLoaded", () => {

    // Get the token, username, and role from local storage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    // If any essential data is missing, redirect to login
    if (!token || !username || !role) {
        window.location.replace("/admin/login");
        return;
    }

    // Show loading screen while fetching data
    const loadingScreen = document.getElementById("loading");
    const dashboard = document.getElementById("dashboard");
    loadingScreen.style.display = "block";
    dashboard.style.display = "none";

    // Set username on the page
    document.getElementById("username").innerText = username;

    // Hide loading screen and show dashboard
    loadingScreen.style.display = "none";
    dashboard.style.display = "block";
});