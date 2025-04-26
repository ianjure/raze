// Function to reset the streak of a user
async function resetStreak() {
    try {
        // Send a POST request to reset the streak
        const response = await fetch("/api/user/streak", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Check if the response indicates a successful streak reset
            if (data.success) {
                return 0;
            }
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}