// Display admin information
document.addEventListener("DOMContentLoaded", () => {

    // Show loading screen while fetching data
    const dashboard = document.getElementsByTagName("body")[0];
    dashboard.style.display = "none";

    // Get the token, username, and role from local storage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const profilePictures = {
        "ian": "../assets/admin/admin1.jpg",
        "ruszed": "../assets/admin/admin2.png",
        "honey": "../assets/admin/admin3.png",
        "joanna": "../assets/admin/admin4.png",
        "airyll": "../assets/admin/admin5.png"
    };

    // Set the profile picture based on the username
    const user = username.toLowerCase();
    const profilePicture = document.getElementById("profile-picture");
    if (profilePictures[user]) {
        profilePicture.src = profilePictures[user];
    }

    // If any essential data is missing, redirect to login
    if (!token || !username || !role) {
        window.location.replace("/login");
        return;
    } else {
        // Set username on the page
        document.getElementById("username").innerText = username;

        // Hide loading screen and show dashboard
        dashboard.style.display = "block";
    }
});
