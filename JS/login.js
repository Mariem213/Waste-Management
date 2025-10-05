// Toggle between Login & Register
document.querySelector('.overlay-btn').addEventListener('click', function () {
    document.querySelector('.cont').classList.toggle('s--signup');
});

// Helper functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPassword(password) {
    return password.length >= 6;
}
function isValidName(name) {
    return /^[A-Za-z\s]{2,}$/.test(name);
}

// ===== REGISTER FUNCTION =====
document.getElementById("registerBtn").addEventListener("click", function () {
    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim();
    let password = document.getElementById("regPassword").value.trim();

    // Clear errors
    document.getElementById("regNameErr").textContent = "";
    document.getElementById("regEmailErr").textContent = "";
    document.getElementById("regPassErr").textContent = "";
    document.getElementById("regMsg").textContent = "";

    let isValid = true;

    if (!isValidName(name)) {
        document.getElementById("regNameErr").textContent = "Enter a valid name (letters only).";
        isValid = false;
    }
    if (!isValidEmail(email)) {
        document.getElementById("regEmailErr").textContent = "Invalid email format.";
        isValid = false;
    }
    if (!isValidPassword(password)) {
        document.getElementById("regPassErr").textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    if (!isValid) return;

    // Get all users from localStorage or empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        document.getElementById("regMsg").textContent = "Email already registered!";
        document.getElementById("regMsg").className = "error";
        return;
    }

    // Create new user
    let newUser = {
        name,
        email,
        password,
        gender: "",
        color: "#ccc",
        coins: 0,
        image: ""
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("regMsg").textContent = "Account created successfully! Please Login with Your Account.";
    document.getElementById("regMsg").className = "success";

    // Optionally switch to login form automatically
    document.querySelector('.cont').classList.remove('s--signup');
});

// ===== LOGIN FUNCTION =====
document.getElementById("loginBtn").addEventListener("click", function () {
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    // Clear errors
    document.getElementById("loginEmailErr").textContent = "";
    document.getElementById("loginPassErr").textContent = "";
    document.getElementById("loginMsg").textContent = "";

    let isValid = true;

    if (!isValidEmail(email)) {
        document.getElementById("loginEmailErr").textContent = "Invalid email format.";
        isValid = false;
    }
    if (!isValidPassword(password)) {
        document.getElementById("loginPassErr").textContent = "Password must be at least 6 characters.";
        isValid = false;
    }

    if (!isValid) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let savedUser = users.find(u => u.email === email && u.password === password);

    if (!savedUser) {
        document.getElementById("loginMsg").textContent = "Invalid email or password!";
        document.getElementById("loginMsg").className = "error";
        return;
    }

    // Login successful
    document.getElementById("loginMsg").textContent = "Login successful! Redirecting...";
    document.getElementById("loginMsg").className = "success";

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(savedUser)); // store logged-in user

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1500);
});

// ===== Redirect logged-in user away from login page =====
window.onload = function () {
    if (localStorage.getItem("isLoggedIn") === "true" && window.location.pathname.includes("login.html")) {
        window.location.href = "../index.html";
    }
};
