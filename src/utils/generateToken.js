const jwt = require('jsonwebtoken');

// Function to generate a JWT token with the user ID and role
function generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

module.exports = generateToken;