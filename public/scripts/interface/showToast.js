// Function to display a toast notification
function showToast(message, type, duration = 4000) {
    const toast = document.getElementById("toast");
    const toastContent = document.getElementById("toast-content");
    const toastMessage = document.getElementById("toast-message");
    
    toastMessage.textContent = message;
    toastContent.classList.remove("success", "error");
    toastContent.classList.add(type);
    toast.classList.add("show");
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
}

// Make the showToast function available globally
window.showToast = showToast;

// Show toast when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const toastMessage = localStorage.getItem("toastMessage");
    const toastType = localStorage.getItem("toastType");

    if (toastMessage && toastType) {
        showToast(toastMessage, toastType);
        localStorage.removeItem("toastMessage");
        localStorage.removeItem("toastType");
    }
});