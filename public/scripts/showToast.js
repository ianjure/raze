function showToast(message, type, duration=3000) {
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
