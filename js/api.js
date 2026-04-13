// api.js

const API_BASE_URL = "https://focusflow.runasp.net/api";

function getHeaders() {
    const headers = { "Content-Type": "application/json" };
    // Usually auth is included but runasp.net endpoint may use cookies
    // In case there is a token:
    const token = typeof auth !== 'undefined' ? auth.getToken() : null;
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

const backend = {
    async fetchTasks() {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                headers: getHeaders(),
                credentials: "include"
            });
            if (!response.ok) throw new Error("Failed to fetch tasks");

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.warn("Fetch tasks mock used due to error or offline", err);
            return [];
        }
    },

    async createTask(taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({
                    title: taskData.title,
                    priority: taskData.priority
                })
            });
            if (!response.ok) throw new Error("Failed to create task");

            const textRaw = await response.text();
            if (!textRaw) return null;
            try {
                return JSON.parse(textRaw);
            } catch (e) {
                // Return generic if they just send 200 OK
                return { id: `generated-${Date.now()}` };
            }
        } catch (err) {
            console.error(err);
            return null;
        }
    },

    async deleteTask(taskId) {
        try {
            await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: "DELETE",
                headers: getHeaders()
            });
        } catch (err) {
            console.error(err);
        }
    },

    async updateTask(taskId, isCompleted) {
        try {
            await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify({ isCompleted })
            });
        } catch (err) {
            console.error(err);
        }
    },

    async logSession(taskId, durationSeconds) {
        try {
            await fetch(`${API_BASE_URL}/sessions`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({
                    taskId: taskId,
                    startTime: new Date().toISOString(),
                    durationSeconds: durationSeconds
                })
            });
        } catch (err) {
            console.error(err);
        }
    }
};
