const userModal = document.querySelector(".confirm-modal");
let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    // Fetch and display all users
    await fetchAndDisplayUsers(token);

    // Add event listener for the search functionality
    const searchInput = document.getElementById("user-search-input");
    searchInput.addEventListener("input", handleUserSearch);
});

// Fetch and display all users
async function fetchAndDisplayUsers(token) {
    try {
        const response = await fetch("/api/user/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            const userListContainer = document.querySelector(".user-list-container");
            userListContainer.innerHTML = ""; // Clear existing users

            data.data.forEach(user => {
                const userRow = document.createElement("div");
                userRow.className = "user-row";
                userRow.dataset.username = user.username.toLowerCase(); // Store username for search
                userRow.innerHTML = `
                    <span class="user-name">${user.username}</span>
                    <button class="delete-user-button" data-user-id="${user._id}">Delete</button>
                `;
                userListContainer.appendChild(userRow);
            });

            // Add event listeners for delete buttons
            document.querySelectorAll(".delete-user-button").forEach(button => {
                button.addEventListener("click", (event) => handleDeleteUser(event, token));
            });
        } else {
            console.error("Failed to fetch users.");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// Handle user search
function handleUserSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const userRows = document.querySelectorAll(".user-row");

    let lastVisibleRow = null;

    userRows.forEach(row => {
        const username = row.dataset.username;
        if (username.includes(searchTerm)) {
            row.style.display = ""; // Show matching rows
            lastVisibleRow = row; // Track the last visible row
        } else {
            row.style.display = "none"; // Hide non-matching rows
        }
    });

    // Remove the border from all rows
    userRows.forEach(row => row.style.borderBottom = "1px solid #E5E7EB");

    // Remove the bottom border from the last visible row
    if (lastVisibleRow) {
        lastVisibleRow.style.borderBottom = "none";
    }
}

// Handle user deletion
function handleDeleteUser(event, token) {
    // Get the user element to be deleted
    currentUser = event.target.closest(".user-row");

    // Show the modal for confirmation
    const userName = currentUser.querySelector(".user-name").innerText;
    userModal.querySelector(".preview").innerText = userName.length > 20 ? userName.substring(0, 20) + "..." : userName;
    userModal.showModal();
}

// Confirm user deletion
userModal.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Exit if the modal is not open
    if (!userModal.open) return;

    // Check if currentUser is set
    if (!currentUser) {
        console.log("Error: No user selected for deletion.");
        return;
    }

    // Get the user ID from the current user element
    const userId = currentUser.querySelector(".delete-user-button").dataset.userId;
    if (!userId) return console.log("Error: No user ID found.");

    // Send a DELETE request to the server to delete the user
    try {
        const response = await fetch(`/api/user/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        // If successful, remove the user element from the DOM
        if (response.ok) {
            currentUser.remove();
            currentUser = null;
            showToast("✔️ User deleted successfully!", "success");
        } else {
            console.log("Error: Failed to delete user.");
        }
    } catch (error) {
        console.log(error);
    }

    // Close the modal
    userModal.close();

    // Refresh the user list
    showAdminStatus();
});

// Add event listener to the cancel button in the modal
userModal.querySelector("#cancel").addEventListener("click", () => {
    userModal.close();
    currentUser = null;
});