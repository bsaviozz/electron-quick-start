const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const os = require("os");

const usersFilePath = path.join(__dirname, "users.json"); // JSON file storing user data
const privateKeysDir = path.join(os.homedir(), "Documents", "PrivateKeys"); // User's Documents folder

// Ensure users.json exists
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([])); // Initialize with empty array
}

// Ensure PrivateKeys directory exists
if (!fs.existsSync(privateKeysDir)) {
    fs.mkdirSync(privateKeysDir, { recursive: true });
    console.log("Created PrivateKeys directory in user's Documents folder.");
}

function loadUsers() {
    try {
        // Check if the file exists
        if (!fs.existsSync(usersFilePath)) {
            // If the file doesn't exist, return an empty array
            return [];
        }

        // Read the content of the file
        const fileContent = fs.readFileSync(usersFilePath, "utf8");

        // If the file is empty, return an empty array
        if (!fileContent.trim()) {
            return [];
        }

        // Parse the content and return the users
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error loading users:", error);
        // Return an empty array in case of any error (like parsing issues)
        return [];
    }
}

// Function to save users to the JSON file
function saveUsers(users) {
    try {
        // Convert the users array to JSON and save it to the file
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4));
    } catch (error) {
        console.error("Error saving users:", error);
    }
}

// Handle login - Check if user ID exists
function loginUser(userId) {
    const users = loadUsers();
    const user = users.find(u => u.userId === userId);

    if (user) {
        console.log(`User ${userId} logged in.`);
        return { success: true, userId };
    } else {
        console.log(`User ${userId} not found.`);
        return { success: false };
    }
}

// Handle registration - Generate keys and store user data
function registerUser(userData) {
    try {
        const users = loadUsers();
        
        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
            console.log("Registration failed: Email already exists.");
            return { success: false, message: "Email is already registered." };
        }

        const userId = crypto.randomUUID(); // Generate unique user ID
        const privateKeyPath = path.join(privateKeysDir, `${userId}.pem`);

        // Generate RSA key pair for the user
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: { type: "spki", format: "pem" },
            privateKeyEncoding: { type: "pkcs8", format: "pem" }
        });

        // Save the private key in a user-visible directory
        fs.writeFileSync(privateKeyPath, privateKey);
        console.log(`Private key saved to: ${privateKeyPath}`);

        // Add user to database
        users.push({ email: userData.email, userId, publicKey });
        saveUsers(users);

        console.log(`User ${userId} registered with email ${userData.email}`);
        return { success: true, userId };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: "Error during registration. Please try again." };
    }
}

// Retrieve all public keys (for users to see)
function getAllPublicKeys() {
    const users = loadUsers();
    return users.map(u => ({ email: u.email, userId: u.userId, publicKey: u.publicKey }));
}

module.exports = { loginUser, registerUser, getAllPublicKeys };
