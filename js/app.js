// app.js
// The main entry point of our application. Connects interactive buttons to their base scripts globally.

function init() {
    backend.fetchTasks();

    // Add some default dummy tasks for demonstration purposes
    tasks = [
        { id: 1, title: "Finish the editorial design system", priority: "high", completed: false, createdAt: new Date().toISOString() },
        { id: 2, title: "Review user feedback sessions", priority: "medium", completed: false, createdAt: new Date().toISOString() },
        { id: 3, title: "Clean digital workspace folders", priority: "low", completed: false, createdAt: new Date().toISOString() }
    ];

    renderTasks();
    updateTimerDisplay();
    updateSessionDisplay();
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
