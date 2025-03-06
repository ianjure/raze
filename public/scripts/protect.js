// Protect routes from unauthorized access
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const currentPage = window.location.pathname;

    // If any essential data is missing, redirect to login
    if (!token || !username || !role) {
        const loginPage = currentPage.includes("admin") ? "/admin/login" : "/login";
        window.location.replace(loginPage);
        return;
    }

    // Redirect based on user role
    if (role === "user") {
        if (currentPage.startsWith("/admin")) {
            window.location.replace(`/${username}`); // Prevent users from accessing admin pages
            return;
        }
        if (username && currentPage !== `/${username}`) {
            window.location.replace(`/${username}`); // Ensure users are on their own page
            return;
        }
    }

    if (role === "admin") {
        if (!currentPage.startsWith("/admin")) {
            window.location.replace(`/admin/${username}`); // Prevent admins from accessing user pages
            return;
        }
        if (username && currentPage !== `/admin/${username}`) {
            window.location.replace(`/admin/${username}`); // Ensure admins are on their own page
            return;
        }
    }
});
