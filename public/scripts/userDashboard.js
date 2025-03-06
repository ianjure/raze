// To display user information as user
window.onload = () => {

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

        // Handle the response
        if (response.ok) {
            const data = await response.json();
            document.getElementById("username").innerText = username;
            document.getElementById("level").innerText = `Level: ${data.level}`;
            document.getElementById("exp").innerText = `EXP: ${data.exp}`;
        } else if (response.status === 401) {
            // Handle unauthorized access (e.g., token expired)
            alert("Your session has expired. Please log in again.");
            window.location.replace("/login");
        } else {
            // Handle other errors
            const errorData = await response.json();
            alert(errorData.message || "Failed to fetch user data.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("An error occurred. Please try again.");
    }
});
