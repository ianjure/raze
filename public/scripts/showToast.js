function showToast(message, type="success", duration=3000) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    
    toastMessage.textContent = message;
    toast.classList.remove("success", "error");
    toast.classList.add("show");
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
}

window.showToast = showToast;
