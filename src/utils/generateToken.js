const jwt = require('jsonwebtoken');

function generateToken(id, role) {
    // Generate an access token with the user ID
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

module.exports = generateToken;