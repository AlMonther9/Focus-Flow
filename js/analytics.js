// analytics.js
// Handles updating the session count text and logging history array of tasks completed.

function updateSessionDisplay() {
    if (sessionCounterDisplay) {
        sessionCounterDisplay.textContent = `Session ${currentSession} of ${MAX_SESSIONS}`;
    }
}

function renderAnalytics() {
    const totalMinutes = focusHistory.reduce((acc, session) => acc + (session.duration / 60), 0);
    const totalDisplay = document.getElementById("total-focus-time");
    if (totalDisplay) totalDisplay.textContent = `${totalMinutes} min`;

    const historyList = document.getElementById("session-history-list");
    if (!historyList) return;

    if (focusHistory.length === 0) {
        historyList.innerHTML = '<p class="text-xs text-on-surface-variant/50 text-center italic py-2">No sessions completed yet.</p>';
        return;
    }

    historyList.innerHTML = "";
    focusHistory.forEach((session) => {
        const task = tasks.find(t => t.id === session.taskId);
        const title = task ? task.title : "Deleted Task";

        historyList.innerHTML += `
      <div class="flex justify-between items-center text-sm py-2 border-b border-white/20 animate-[pulse_0.5s_ease-out_1]">
        <span class="font-semibold text-on-surface truncate pr-4">${title}</span>
        <span class="text-on-surface-variant shrink-0 bg-primary/20 px-2 rounded-lg font-bold">${session.duration / 60}m</span>
      </div>
    `;
    });
}
