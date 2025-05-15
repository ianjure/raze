// Function to show admin status in the UI
async function showAdminStatus() {
    try {
        // Send a GET request to fetch user data
        const response = await fetch("/api/user/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Show the total users count in the UI
            const totalUsersCountElement = document.getElementById("total-users-count");
            if (totalUsersCountElement) totalUsersCountElement.innerText = `${data.data.length}`;

            // Show the total streaks count in the UI
            const totalStreaksCountElement = document.getElementById("total-streaks-count");
            let totalStreaks = 0;
            for (let i = 0; i < data.data.length; i++) {
                totalStreaks += data.data[i].streak;
            }
            if (totalStreaksCountElement) totalStreaksCountElement.innerText = `${totalStreaks}`;
        } else {
            console.log("Error: Failed to fetch user status.");
        }
    } catch (error) {
        console.log(error);
    }

    try {
        // Send a GET request to fetch task data
        const response = await fetch("/api/task/all", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Show the total tasks count in the UI
            const totalTasksCountElement = document.getElementById("total-tasks-count");
            if (totalTasksCountElement) totalTasksCountElement.innerText = `${data.data.length}`;
        } else {
            console.log("Error: Failed to fetch user status.");
        }
    } catch (error) {
        console.log(error);
    }
}