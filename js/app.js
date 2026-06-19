// app.js
// The main entry point of our application. Connects interactive buttons to their base scripts globally.

let isLoginMode = true;

async function init() {
    // Auth Check
    if (!auth.getToken()) {
        hideUserNavbarProfile();
        showAuthModal();
        return; // Pause app execution until logged in
    }

    showUserNavbarProfile();

    try {
        const fetchedTasks = await backend.fetchTasks();
        if (fetchedTasks && fetchedTasks.length > 0) {
            tasks = fetchedTasks.map(t => ({
                id: t.id,
                title: t.title,
                priority: t.priority || "Medium",
                completed: t.isCompleted || false,
                createdAt: t.createdAt || new Date().toISOString()
            }));
        } else {
            tasks = [];
        }
    } catch (e) {
        tasks = [];
    }

    renderTasks();
    updateTimerDisplay();
    updateSessionDisplay();
}

function showAuthModal() {
    if (authModal) authModal.classList.remove("hidden");
}

function hideAuthModal() {
    if (authModal) authModal.classList.add("hidden");
}

// Auth Helper: Show inline validation error
function showAuthError(message) {
    const errorContainer = document.getElementById("auth-error-container");
    const errorMessage = document.getElementById("auth-error-message");
    if (errorContainer && errorMessage) {
        errorMessage.textContent = message;
        errorContainer.classList.remove("hidden");
    } else {
        alert(message);
    }
}

// Auth Event Listeners
if (authToggleBtn) {
    authToggleBtn.addEventListener("click", function () {
        isLoginMode = !isLoginMode;
        const usernameContainer = document.getElementById("username-container");
        
        // Reset fields and errors
        const errorContainer = document.getElementById("auth-error-container");
        if (errorContainer) errorContainer.classList.add("hidden");
        authEmail.value = "";
        authPassword.value = "";
        authUsername.value = "";

        if (isLoginMode) {
            authModalTitle.textContent = "Welcome back";
            authModalSubtitle.textContent = "Sign in to sync your digital sanctuary.";
            if (usernameContainer) usernameContainer.classList.add("hidden");
            authUsername.classList.add("hidden");
            authUsername.removeAttribute("required");
            authSubmitBtn.textContent = "Sign In";
            authToggleText.textContent = "Don't have an account?";
            authToggleBtn.textContent = "Create one";
        } else {
            authModalTitle.textContent = "Join Focus Flow";
            authModalSubtitle.textContent = "Create an account to begin your journey.";
            if (usernameContainer) usernameContainer.classList.remove("hidden");
            authUsername.classList.remove("hidden");
            authUsername.setAttribute("required", "true");
            authSubmitBtn.textContent = "Register";
            authToggleText.textContent = "Already have an account?";
            authToggleBtn.textContent = "Sign In";
        }
    });
}

if (authForm) {
    authForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        const email = authEmail.value;
        const password = authPassword.value;
        const username = authUsername.value;

        // Reset error message container
        const errorContainer = document.getElementById("auth-error-container");
        if (errorContainer) errorContainer.classList.add("hidden");

        // Frontend validations matching backend constraints
        const emailTrimmed = email.trim();
        const passwordTrimmed = password;
        const usernameTrimmed = username.trim();

        if (!emailTrimmed) {
            showAuthError("Email address is required.");
            return;
        }
        if (emailTrimmed.length > 255) {
            showAuthError("Email address cannot exceed 255 characters.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrimmed)) {
            showAuthError("Please enter a valid email address.");
            return;
        }

        if (!passwordTrimmed) {
            showAuthError("Password is required.");
            return;
        }
        if (passwordTrimmed.length < 6) {
            showAuthError("Password must be at least 6 characters.");
            return;
        }

        if (!isLoginMode) {
            if (!usernameTrimmed) {
                showAuthError("Username is required.");
                return;
            }
            if (usernameTrimmed.length > 50) {
                showAuthError("Username cannot exceed 50 characters.");
                return;
            }
            if (usernameTrimmed.length < 3) {
                showAuthError("Username must be at least 3 characters.");
                return;
            }
        }

        authSubmitBtn.disabled = true;
        authSubmitBtn.classList.add("opacity-50");
        const originalText = authSubmitBtn.textContent;
        authSubmitBtn.textContent = "Processing...";

        let result = { success: false, error: "An unknown error occurred." };
        if (isLoginMode) {
            result = await auth.login(emailTrimmed, passwordTrimmed);
        } else {
            result = await auth.register(usernameTrimmed, emailTrimmed, passwordTrimmed);
            if (result.success) {
                // Auto-login after successful registration
                result = await auth.login(emailTrimmed, passwordTrimmed);
            }
        }

        authSubmitBtn.disabled = false;
        authSubmitBtn.classList.remove("opacity-50");
        authSubmitBtn.textContent = originalText;

        if (result.success) {
            // Clear inputs
            authEmail.value = "";
            authPassword.value = "";
            authUsername.value = "";
            hideAuthModal();
            init(); // Load tasks and resume app
        } else {
            showAuthError(result.error || "Authentication failed. Please check your credentials.");
        }
    });
}

// Ensure elements exist before wiring listeners (safety!)
if (taskInput) {
    taskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") addTask();
    });
}

if (addTaskBtn) addTaskBtn.addEventListener("click", addTask);

if (focusTrayClose) {
    focusTrayClose.addEventListener("click", function () {
        focusTray.classList.add("hidden");
        activeTaskId = null;
    });
}

// Timer Event Listeners
if (startBtn) startBtn.addEventListener("click", startTimer);
if (pauseBtn) pauseBtn.addEventListener("click", togglePlayPause);
if (resetBtn) resetBtn.addEventListener("click", resetTimer);

if (continueBtn) {
    continueBtn.addEventListener("click", function () {
        successModal.classList.add("hidden");
        setBreakMode();
        startTimer();
    });
}

function showUserNavbarProfile() {
    if (userNavProfile) userNavProfile.classList.remove("hidden");
    if (navUsername) navUsername.textContent = auth.getUsername();
}

function hideUserNavbarProfile() {
    if (userNavProfile) userNavProfile.classList.add("hidden");
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        auth.logout();
    });
}

// Start application runtime
init();
