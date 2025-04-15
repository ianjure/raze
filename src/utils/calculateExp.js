// Function to calculate the experience points (EXP) gained per task based on the user's level.
function calculateExp(level) {
    // Ensure level is a positive integer
    if (level < 1) return 0;

    const initialExpPerTask = 20; // EXP per task at level 1
    const minExpPerTask = 5;  // Minimum EXP per task
    const decayRate = 0.92;   // Adjusted decay rate for a smooth decrease

    // Calculate EXP gain per task
    let expPerTask = initialExpPerTask * Math.pow(decayRate, level - 1);

    // Ensure EXP per task does not drop below the minimum
    return Math.max(expPerTask, minExpPerTask);
}

module.exports = calculateExp;