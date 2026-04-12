// timer.js
// Handles the countdown math, switching between break and focus modes, and time display.

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');

    const formattedTime = `${paddedMinutes}:${paddedSeconds}`;
    timerDisplay.textContent = formattedTime;

    if (focusTrayTimer) {
        focusTrayTimer.textContent = formattedTime;
    }
}

function countdown() {
    if (Date.now() < endTime) {
        timeLeft = Math.round((endTime - Date.now()) / 1000);
        updateTimerDisplay();
    } else {
        // Timer reached zero!
        timeLeft = 0;
        updateTimerDisplay();
        pauseTimer();

        if (isFocusMode) {
            successModal.classList.remove("hidden");

            if (activeTaskId) {
                backend.logSession(activeTaskId, 25 * 60);
                focusHistory.push({ taskId: activeTaskId, duration: 25 * 60, date: new Date() });
                renderAnalytics();
            }

            if (currentSession >= MAX_SESSIONS) {
                currentSession = 1;
            } else {
                currentSession++;
            }
            updateSessionDisplay();
        } else {
            alert("🚨 Alarm: Your break is over! Time to start a new 25-minute focus session.");
            setFocusMode();
        }
    }
}

function startTimer() {
    if (!activeTaskId && isFocusMode) {
        alert("Please select a task to focus on first by clicking its play button in the tasks list!");
        return;
    }

    if (!isTimerRunning && timeLeft > 0) {
        isTimerRunning = true;
        endTime = Date.now() + timeLeft * 1000;
        timerInterval = setInterval(countdown, 1000);

        pauseBtn.querySelector('span').textContent = 'pause';
        startBtn.disabled = true;
        startBtn.classList.add("opacity-50", "pointer-events-none");
    }
}

function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);

    if (endTime && Date.now() < endTime) {
        timeLeft = Math.round((endTime - Date.now()) / 1000);
    }
    endTime = null;

    pauseBtn.querySelector('span').textContent = 'play_arrow';
}

function resetTimer() {
    pauseTimer();
    timeLeft = isFocusMode ? 25 * 60 : 5 * 60;
    endTime = null;
    updateTimerDisplay();

    startBtn.disabled = false;
    startBtn.classList.remove("opacity-50", "pointer-events-none");
}

function focusOnTask(index) {
    const task = tasks[index];
    if (!task) return;

    activeTaskId = task.id;
    focusTray.classList.remove("hidden");
    focusTrayTitle.textContent = task.title;

    startTimer();
}

function setFocusMode() {
    isFocusMode = true;
    document.getElementById("focus-mode-btn").classList.replace("text-on-surface-variant", "bg-primary");
    document.getElementById("focus-mode-btn").classList.add("text-on-primary");
    document.getElementById("break-mode-btn").classList.replace("bg-primary", "text-on-surface-variant");
    document.getElementById("break-mode-btn").classList.remove("text-on-primary");
    resetTimer();
}

function setBreakMode() {
    isFocusMode = false;
    document.getElementById("break-mode-btn").classList.replace("text-on-surface-variant", "bg-primary");
    document.getElementById("break-mode-btn").classList.add("text-on-primary");
    document.getElementById("focus-mode-btn").classList.replace("bg-primary", "text-on-surface-variant");
    document.getElementById("focus-mode-btn").classList.remove("text-on-primary");
    resetTimer();
}

function togglePlayPause() {
    if (isTimerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}
