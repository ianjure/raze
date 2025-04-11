// Function to update the progress of the experience bar
function updateProgress(newProgress) {
    const progressCircle = document.querySelector(".progress-circle");

    // Get the current progress value
    const currentProgress = parseFloat(getComputedStyle(progressCircle).getPropertyValue("--progress")) || 0;

    console.log("Current Progress:", currentProgress);
    console.log("New Progress:", newProgress);

    // Define the animation duration and start time
    const duration = 1000; // 1 second
    const startTime = performance.now();

    // Animation loop
    function animateProgress(currentTime) {
        const elapsedTime = currentTime - startTime;

        // Check if the bar needs to reach 100% first
        if (currentProgress > newProgress) {
            // Phase 1: Animate to 100%
            const remainingToFull = 100 - currentProgress;
            const progress = currentProgress + (remainingToFull * (elapsedTime / duration));

            // Update the progress variable
            progressCircle.style.setProperty("--progress", Math.min(progress, 100));

            // If the first phase is complete, reset and animate the remaining progress
            if (elapsedTime >= duration) {
                progressCircle.style.setProperty("--progress", 0); // Reset progress to 0
                updateProgress(newProgress); // Animate the remaining progress
            } else {
                requestAnimationFrame(animateProgress);
            }
        } else {
            // Single phase: Animate normally to the new progress
            const progressDelta = newProgress - currentProgress;
            const progress = currentProgress + (progressDelta * (elapsedTime / duration));

            // Update the progress variable
            progressCircle.style.setProperty("--progress", Math.min(progress, newProgress));

            // Continue the animation if the duration is not yet complete
            if (elapsedTime < duration) {
                requestAnimationFrame(animateProgress);
            } else {
                // Ensure the final value is set
                progressCircle.style.setProperty("--progress", newProgress);
            }
        }
    }

    // Start the animation
    requestAnimationFrame(animateProgress);
}