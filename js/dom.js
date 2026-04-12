// dom.js
// This file connects our Javascript to the actual HTML elements on the page.

// Inputs & Buttons
const taskInput = document.getElementById("task-input");
const taskPriority = document.getElementById("task-priority");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Timer Elements
const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

// Modals & Panels
const successModal = document.getElementById("success-modal");
const continueBtn = document.getElementById("continue-btn");

// Focus Tray & Analytics 
const focusTray = document.getElementById("focus-tray");
const focusTrayTitle = document.getElementById("focus-tray-title");
const focusTrayTimer = document.getElementById("focus-tray-timer");
const focusTrayClose = document.getElementById("focus-tray-close");
const sessionCounterDisplay = document.getElementById("session-counter-display");
