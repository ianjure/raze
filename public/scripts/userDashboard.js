// Display user information
document.addEventListener("DOMContentLoaded", async () => {

    // Show loading screen while fetching data
    const loadingScreen = document.getElementById("loading");
    const dashboard = document.getElementById("dashboard");
    loadingScreen.style.display = "block";
    dashboard.style.display = "none";

    // Get the token, username, and role from local storage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    // If any essential data is missing, redirect to login
    if (!token || !username || !role) {
        window.location.replace("/login");
        return;
    } else {
        try {
            // Send a GET request to the server to fetch user data
            const response = await fetch("/api/user/", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            // Display data to dashboard
            if (response.ok) {
                const data = await response.json();
                document.getElementById("username").innerText = username;
                document.getElementById("level").innerText = `Level: ${data.level}`;
                document.getElementById("exp").innerText = `EXP: ${data.exp}`;

                // Hide loading screen and show dashboard
                loadingScreen.style.display = "none";
                dashboard.style.display = "block";
            } else {
                showToast("Failed to fetch user data.", "error");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            showToast("An error occurred. Please try again.", "error");
        }
    }
});