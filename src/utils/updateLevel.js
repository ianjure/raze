// Function to update the level and experience points
function updateLevel(currentExp, expToAdd) {
    const levelUpThreshold = 100; // EXP required to level up
    let newExp = currentExp + expToAdd; // Add EXP to current EXP
    let levelIncrease = 0; // Track level-ups

    // Check if the EXP crosses the level-up threshold
    if (newExp >= levelUpThreshold) {
        newExp -= levelUpThreshold;
        levelIncrease = 1;
    }

    // Ensure EXP is an integer
    newExp = Math.floor(newExp);

    return { newExp, levelIncrease };
}

module.exports = updateLevel;