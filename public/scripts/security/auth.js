// Handle user and admin authentication
document.addEventListener("DOMContentLoaded", () => {

    // If the signup form exists, add an event listener to it
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            // Prevent the default form submission
            event.preventDefault();

            // Get the username and password from the form
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                // Send a POST request to the server
                const response = await fetch("/api/user/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                // Get the response data
                const data = await response.json();

                // If the response is successful, display a success message
                // and redirect the user to the login page
                // Otherwise, display an error message
                if (response.ok) {
                    localStorage.setItem("toastMessage", "Signed-up successfully!");
                    localStorage.setItem("toastType", "success");
                    window.location.replace("/login");
                } else {
                    showToast(data.message, "error");
                }
            } catch (error) {
                console.error("Signup failed:", error);
                showToast("Error signing up. Please try again.", "error");
            }
        });
    }

    // If the login form exists, add an event listener to it
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            // Prevent the default form submission
            event.preventDefault();

            // Get the username and password from the form
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            
            try {
                // Send a POST request to the server
                const response = await fetch("/api/user/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                // Get the response data
                const data = await response.json();

                // If the response is successful, store the token and username in the local storage
                // and redirect the user to the user dashboard
                // Otherwise, display an error message
                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", username);
                    localStorage.setItem("role", data.role);
                    localStorage.setItem("level", data.level);
                    
                    // Redirect based on role
                    if (data.role === "Admin") {
                        window.location.replace(`/admin/${username}`);
                    } else {
                        window.location.replace(`/${username}`);
                    }
                } else {
                    showToast(data.message, "error");
                }
            } catch (error) {
                console.error("Login failed:", error);
                showToast("Error logging in. Please try again.", "error");
            }
        });
    }

    // Get the token from the local storage
    const token = localStorage.getItem("token");

    // If the logout button exists, add an event listener to it
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            try {
                // Send a POST request to the server
                const response = await fetch("/api/user/logout", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                // Get the response data
                const data = await response.json();
                
                // If the response is successful, remove the token and username from the local storage
                // and redirect the user to the login page
                // Otherwise, display an error message
                if (response.ok) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("role");
                    localStorage.removeItem("level");
                    window.location.replace("/login");
                } else {
                    showToast(data.message, "error");
                }
            } catch (error) {
                console.error("Logout failed:", error);
                showToast("Error logging out. Please try again.", "error");
            }
        });
    }
});
