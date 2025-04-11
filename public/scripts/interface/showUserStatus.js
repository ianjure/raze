// Function to show user status including level and experience points (EXP) in the UI
async function showUserStatus() {
    try {
        // Send a GET request to fetch the user's current EXP and level
        const response = await fetch("/api/user/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Update the EXP and level in the UI
            const levelElement = document.getElementById("level");
            if (levelElement) levelElement.innerText = `Level: ${data.level}`;
            updateProgress(data.exp);

            // Show level up message if the user has leveled up
            if (data.level != localStorage.getItem("level")) {
                showToast("🎉 Congratulations! You've leveled up!", "success");
                localStorage.setItem("level", data.level);
            }
        } else {
            console.log("Error: Failed to fetch user status.");
        }
    } catch (error) {
        console.log(error);
    }
}