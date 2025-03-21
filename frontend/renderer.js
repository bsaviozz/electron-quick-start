document.addEventListener("DOMContentLoaded", () => {
    console.log("renderer.js is loaded and DOM is ready!");

    // Handle Registration
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        console.log("Register form found. Attaching event listener.");
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const userData = {
                fname: document.getElementById("fname")?.value || "",
                lname: document.getElementById("lname")?.value || "",
                email: document.getElementById("email")?.value || ""
            };

            try {
                const response = await window.electronAPI.registerUser(userData);
                if (response.success) {
                    alert(`This is your user ID: ${response.userId}. Remember it to log in`);
                    window.location.href = "dashboard.html";
                } else {
                    alert("Registration failed.");
                }
            } catch (error) {
                console.error("Registration failed:", error);
                alert("Error during registration.");
            }
        });
    } else {
        console.log("Register form not found on this page.");
    }

    // Handle Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        console.log("Login form found. Attaching event listener.");
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent the form from reloading the page

            const userId = document.getElementById("userId")?.value || "";

            try {
                const response = await window.electronAPI.loginUser(userId);
                if (response.success) {
                    alert(`User ${response.userId} logged in!`);
                    window.location.href = "dashboard.html";
                } else {
                    alert("Invalid User ID!");
                }
            } catch (error) {
                console.error("Login failed:", error);
                alert("Error during login.");
            }
        });
    } else {
        console.log("Login form not found on this page.");
    }
});
