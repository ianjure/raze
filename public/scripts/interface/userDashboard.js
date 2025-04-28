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
        // Update the streak in the UI
        const newStreak = await resetStreak();
        const streakElement = document.getElementById("streak");
        if (newStreak !== null) {
            streakElement.innerText = `🔥${newStreak}`;
            showToast("⚠️ Streak reset due to inactivity.", "success");
            localStorage.setItem("streak", 0);
        }
        
        // Display data to dashboard
        document.getElementById("username").innerText = username;
        showUserStatus();

        // Hide loading screen and show dashboard
        dashboard.style.display = "block";
    }
});