// Function to show user status in the UI
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
            if (levelElement) levelElement.innerText = `Lvl ${data.level}`;
            updateProgress(data.exp);

            // Show level up message if the user has leveled up
            if (data.level != localStorage.getItem("level")) {
                showToast("🎉 Congratulations! You've leveled up!", "success");
                localStorage.setItem("level", data.level);
            }

            // Update the streak in the UI
            const newStreak = await resetStreak();
            const streakElement = document.getElementById("streak");
            if (newStreak !== null) {
                streakElement.innerText = `🔥${newStreak}`;
                showToast("⚠️ Streak reset due to inactivity.", "success");
                localStorage.setItem("streak", 0);
            } else {
                streakElement.innerText = `🔥${data.streak}`;
            }

            // Show streak message if the user has a streak
            if (data.streak != localStorage.getItem("streak")) {
                showToast(`🔥 ${data.streak} day streak!`, "success");
                localStorage.setItem("streak", data.streak);
            }
        } else {
            console.log("Error: Failed to fetch user status.");
        }
    } catch (error) {
        console.log(error);
    }
}