// Display user information
document.addEventListener("DOMContentLoaded", async () => {

    // Show loading screen while fetching data
    const dashboard = document.getElementsByTagName("body")[0];
    dashboard.style.display = "none";

    const profilePictures = [
        "../assets/profile/profile1.png",
        "../assets/profile/profile2.png",
        "../assets/profile/profile3.png",
        "../assets/profile/profile4.png"
    ];

    // Simple hash function to map username to an index
    const user = localStorage.getItem("username");
    const hash = [...user].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const profileIndex = hash % profilePictures.length;

    // Set the profile picture
    const profilePictureElement = document.getElementById("profile-picture");
    if (profilePictureElement) {
        profilePictureElement.src = profilePictures[profileIndex];
    }

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
                showUserStatus();

                // Hide loading screen and show dashboard
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