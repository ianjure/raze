function showToast(message, type, duration = 3000) {
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

window.showToast = showToast;

// Show toast after successful sign up
document.addEventListener("DOMContentLoaded", () => {
    const toastMessage = localStorage.getItem("toastMessage");
    const toastType = localStorage.getItem("toastType");

    if (toastMessage && toastType) {
        showToast(toastMessage, toastType);
        localStorage.removeItem("toastMessage");
        localStorage.removeItem("toastType");
    }
});