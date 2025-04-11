const showUserStatus = async () => {
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
            const expElement = document.getElementById("exp");
            const levelElement = document.getElementById("level");

            // Show level up message if the user has leveled up
            if (data.level != localStorage.getItem("level")) {
                showToast("🎉 Congratulations! You've leveled up!", "success");
                localStorage.setItem("level", data.level);
            }

            if (expElement) expElement.innerText = `EXP: ${data.exp}`;
            if (levelElement) levelElement.innerText = `Level: ${data.level}`;

        } else {
            console.log("Error: Failed to fetch user status.");
        }
    } catch (error) {
        console.log(error);
    }
};