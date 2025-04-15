// Protect routes from unauthorized access
document.addEventListener("DOMContentLoaded", async () => {
    
    // Get the token, username, and role from local storage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    // Get the current page
    const currentPage = window.location.pathname;

    // If any essential data is missing, redirect to login
    if (!token || !username || !role) {
        window.location.replace("/login");
        return;
    }

    // Validate the token
    try {
        const response = await fetch("/api/user/validate", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        // If token is invalid or expired, redirect to login
        if (!response.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("level");
            window.location.replace("/login");
            return;
        }
    } catch (error) {
        console.log(error);
        window.location.replace("/login");
        return;
    }

    // Redirect based on user role
    if (role === "User") {
        // Prevent users from accessing admin pages
        if (currentPage.startsWith("/admin")) {
            window.location.replace(`/${username}`);
            return;
        }
        // Ensure users are on their own page
        if (currentPage !== `/${username}`) {
            window.location.replace(`/${username}`);
            return;
        }
    }
    // Prevent admins from accessing user pages
    if (role === "Admin") {
        if (!currentPage.startsWith("/admin")) {
            window.location.replace(`/admin/${username}`);
            return;
        }
        // Ensure admins are on their own page
        if (currentPage !== `/admin/${username}`) {
            window.location.replace(`/admin/${username}`);
            return;
        }
    }
});
