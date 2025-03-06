function dashboardRedirect() {

    // Get the token, username, and role from local storage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
      
    // Redirect to dashboard if token, username, or role exists in local storage
    if (token && username && role) {
        if (role === "admin") {
            window.location.replace(`/admin/${username}`);
        } else {
            window.location.replace(`/${username}`);
        }
        return;
    }
}

// Run on page load after DOM is fully loaded
window.onload = () => {
    dashboardRedirect();
};
