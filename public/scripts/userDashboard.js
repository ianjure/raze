// Display user information
document.addEventListener("DOMContentLoaded", async () => {

    // Get the token, username, and role from local storage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

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
        } else {
            showToast("Failed to fetch user data.", "error");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        showToast("An error occurred. Please try again.", "error");
    }
});
