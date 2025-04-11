// Function to update the progress of the experience bar
function updateProgress(progress) {
    const progressCircle = document.querySelector(".progress-circle");
    progressCircle.style.setProperty("--progress", progress);
}