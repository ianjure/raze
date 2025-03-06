// Handle user and admin authentication
window.onload = () => {

    // If the user signup form exists, add an event listener to it
    const userSignupForm = document.getElementById("user-signup-form");
    if (userSignupForm) {
        userSignupForm.addEventListener("submit", async (event) => {
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

    // If the user login form exists, add an event listener to it
    const userLoginForm = document.getElementById("user-login-form");
    if (userLoginForm) {
        userLoginForm.addEventListener("submit", async (event) => {
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
                    localStorage.setItem("role", "user");
                    window.location.replace(`/${username}`);
                } else {
                    showToast(data.message, "error");
                }
            } catch (error) {
                console.error("Login failed:", error);
                showToast("Error logging in. Please try again.", "error");
            }
        });
    }

    // If the admin login form exists, add an event listener to it
    const adminLoginForm = document.getElementById("admin-login-form");
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", async (event) => {
            // Prevent the default form submission
            event.preventDefault();

            // Get the username and password from the form
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                // Send a POST request to the server
                const response = await fetch("/api/admin/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                // Get the response data
                const data = await response.json();

                // If the response is successful, store the token and username in the local storage
                // and redirect the user to the admin dashboard
                // Otherwise, display an error message
                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", username);
                    localStorage.setItem("role", "admin");
                    window.location.replace(`/admin/${username}`);
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

    // If the user logout button exists, add an event listener to it
    const userLogoutButton = document.getElementById("user-logout-button");
    if (userLogoutButton) {
        userLogoutButton.addEventListener("click", async (event) => {
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

    // If the admin logout button exists, add an event listener to it
    const adminLogoutButton = document.getElementById("admin-logout-button");
    if (adminLogoutButton) {
        adminLogoutButton.addEventListener("click", async (event) => {
            try {
                // Send a POST request to the server
                const response = await fetch("/api/admin/logout", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                // Get the response data
                const data = await response.json();
                
                // If the response is successful, remove the token and username from the local storage
                // and redirect the admin to the login page
                // Otherwise, display an error message
                if (response.ok) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("role");
                    window.location.replace("/admin/login");
                } else {
                    showToast(data.message, "error");
                }
            } catch (error) {
                console.error("Logout failed:", error);
                showToast("Error logging out. Please try again.", "error");
            }
        });
    }
};
