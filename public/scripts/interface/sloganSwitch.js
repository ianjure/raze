// Function to switch slogans on the page
document.addEventListener("DOMContentLoaded", () => {
    // Select all slogan elements
    const slogans = document.querySelectorAll(".slogan");
    let currentIndex = 0;

    // Function to switch slogans
    const switchSlogan = () => {
        // Remove the active class from the current slogan
        slogans[currentIndex].classList.remove("active");

        // Move to the next slogan (loop back to the start if at the end)
        currentIndex = (currentIndex + 1) % slogans.length;

        // Add the active class to the next slogan
        slogans[currentIndex].classList.add("active");

        console.log("Switch!");
    };

    // Initialize the first slogan as active
    slogans[currentIndex].classList.add("active");

    // Switch slogans every 6 seconds
    setInterval(switchSlogan, 6000);
});