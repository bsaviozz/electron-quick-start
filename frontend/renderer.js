// Handle Login Form Submission
document.getElementById("loginFormData").addEventListener("submit", async (event) => {
    event.preventDefault();

    const userId = document.getElementById("userId").value;

    try {
        const response = await window.electronAPI.loginUser(userId);
        if (response.success) {
            alert(`User ${response.userId} logged in!`);
            window.location.href = "dashboard.html"; // Redirect to another page
        } else {
            alert("Invalid User ID!");
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Error during login.");
    }
});

// Handle Register Form Submission
document.getElementById("registerFormData").addEventListener("submit", async (event) => {
    event.preventDefault();

    const userData = {
        fname: document.getElementById("fname").value,
        lname: document.getElementById("lname").value,
        email: document.getElementById("email").value
    };

    try {
        const response = await window.electronAPI.registerUser(userData, 'register');
        if (response.success) {
            alert(`User ${response.userId} registered successfully!`);
            window.location.href = "dashboard.html"; // Redirect to another page
        } else {
            alert("Registration failed.");
        }
    } catch (error) {
        console.error("Registration failed:", error);
        alert("Error during registration.");
    }
});