function updateFavicon() {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const faviconHref = darkMode ? "../assets/logo/raze-light-1.svg" : "../assets/logo/raze-dark-1.svg";

    // Remove existing favicon(s)
    document.querySelectorAll("link[rel='icon']").forEach(el => el.remove());

    // Create new favicon link
    const newFavicon = document.createElement("link");
    newFavicon.rel = "icon";
    newFavicon.type = "image/svg+xml";
    newFavicon.href = faviconHref;

    // Append new favicon
    document.head.appendChild(newFavicon);
}

// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {
    updateFavicon();

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateFavicon);
});