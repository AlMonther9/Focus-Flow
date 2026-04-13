// app.js
// The main entry point of our application. Connects interactive buttons to their base scripts globally.

let isLoginMode = true;

async function init() {
    // Auth Check
    if (!auth.getToken()) {
        showAuthModal();
        return; // Pause app execution until logged in
    }

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

// Auth Event Listeners
if (authToggleBtn) {
    authToggleBtn.addEventListener("click", function () {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authModalTitle.textContent = "Welcome back";
            authModalSubtitle.textContent = "Sign in to sync your digital sanctuary.";
            authUsername.classList.add("hidden");
            authUsername.removeAttribute("required");
            authSubmitBtn.textContent = "Sign In";
            authToggleText.textContent = "Don't have an account?";
            authToggleBtn.textContent = "Create one";
        } else {
            authModalTitle.textContent = "Join Focus Flow";
            authModalSubtitle.textContent = "Create an account to begin your journey.";
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

        authSubmitBtn.disabled = true;
        authSubmitBtn.classList.add("opacity-50");
        const originalText = authSubmitBtn.textContent;
        authSubmitBtn.textContent = "Processing...";

        let success = false;
        if (isLoginMode) {
            success = await auth.login(email, password);
        } else {
            success = await auth.register(username, email, password);
            if (success) {
                // after register, try to login automatically
                success = await auth.login(email, password);
            }
        }

        authSubmitBtn.disabled = false;
        authSubmitBtn.classList.remove("opacity-50");
        authSubmitBtn.textContent = originalText;

        if (success) {
            hideAuthModal();
            init(); // Load tasks and resume app
        } else {
            alert("Authentication failed. Please check your credentials.");
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

// Start application runtime
init();
