// api.js
// This file contains the mock functions that pretend to talk to our backend API.

const API_BASE_URL = "http://localhost:5000/api/tasks";

const backend = {
    async fetchTasks() {
        console.log("Mock GET: Fetched tasks from backend");
    },

    async createTask(task) {
        console.log("Mock POST: Task saved to database:", task.title);
    },

    async deleteTask(taskId) {
        console.log("Mock DELETE: Task removed from database, ID:", taskId);
    },

    async updateTask(taskId, isCompleted) {
        console.log(`Mock PATCH: Task ${taskId} completion status changed to ${isCompleted}`);
    },

    async logSession(taskId, durationSeconds) {
        console.log(`Mock POST: Recorded completion! Session logged for Task ${taskId}.`);
    }
};
