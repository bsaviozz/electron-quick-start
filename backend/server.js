const fs = require("fs");
const crypto = require("crypto");

// Handle login - Check if private key exists
function loginUser(userId) {
    const privateKeyPath = `private_keys/${userId}.pem`;

    if (fs.existsSync(privateKeyPath)) {
        console.log(`User ${userId} logged in.`);
        return { success: true, userId };
    } else {
        console.log(`User ${userId} not found.`);
        return { success: false };
    }
}

// Handle registration - Generate keys and store user data
function registerUser(userData) {
    const userId = crypto.randomUUID(); // Generate unique user ID

    // Generate RSA key pair for the user
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });

    // Save the private key to a file for this user
    fs.writeFileSync(`private_keys/${userId}.pem`, privateKey);

    // Optionally, store public key and user details somewhere (in-memory or file)
    console.log(`User ${userId} registered with email ${userData.email}`);
    return { success: true, userId };
}

module.exports = { loginUser, registerUser };
