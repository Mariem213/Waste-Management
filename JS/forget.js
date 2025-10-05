/* ===================================================================== */
/* ===================== Forget Passward ==================== */
// helpers
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function clearText(id) { const el = document.getElementById(id); if (el) el.textContent = ""; }
function showMsg(text, cls = "error") {
    const m = document.getElementById("msg");
    m.textContent = text;
    m.className = cls === "error" ? "text-danger" : "text-success";
}

// click handler
document.getElementById("resetBtn").addEventListener("click", recoverPassword);

function recoverPassword() {
    // clear previous messages
    clearText("forgotEmailErr");
    clearText("newPassErr");
    clearText("confirmPassErr");
    showMsg("");

    const email = document.getElementById("forgotEmail").value.trim();
    if (!email) {
        document.getElementById("forgotEmailErr").textContent = "Email is required.";
        return;
    }
    if (!isValidEmail(email)) {
        document.getElementById("forgotEmailErr").textContent = "Enter a valid email.";
        return;
    }

    // get user from localStorage
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
        showMsg("No registered users yet.", "error");
        return;
    }

    const user = JSON.parse(userJSON);

    // check the stored email (your stored key may be 'email')
    if (user.email && user.email.toLowerCase() === email.toLowerCase()) {
        // email exists -> show change password form
        showMsg("Email found. Enter a new password below.", "success");
        document.getElementById("newPassDiv").style.display = "block";

        // optionally pre-focus
        document.getElementById("newPass").focus();
    } else {
        showMsg("Email not found!", "error");
    }
}

// change password flow
document.getElementById("changeBtn").addEventListener("click", function () {
    clearText("newPassErr");
    clearText("confirmPassErr");
    showMsg("");

    const newPass = document.getElementById("newPass").value.trim();
    const confirmPass = document.getElementById("confirmPass").value.trim();

    if (newPass.length < 6) {
        document.getElementById("newPassErr").textContent = "Password must be at least 6 characters.";
        return;
    }
    if (newPass !== confirmPass) {
        document.getElementById("confirmPassErr").textContent = "Passwords do not match.";
        return;
    }

    // update localStorage
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
        showMsg("No user data found. Can't update password.", "error");
        return;
    }
    const user = JSON.parse(userJSON);
    user.password = newPass;
    localStorage.setItem("user", JSON.stringify(user));

    // if they were logged-in, you might want to log them out:
    localStorage.removeItem("isLoggedIn");

    showMsg("Password changed successfully. Please log in with your new password.", "success");

    // redirect to login after a short delay
    setTimeout(() => {
        window.location.href = "./login.html";
    }, 1500);
});