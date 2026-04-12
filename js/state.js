// state.js
// This file holds all the data (memory) our application needs to function.

// We store our tasks array here.
let tasks = [];

// Timer specific variables
let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes default
let isTimerRunning = false;
let isFocusMode = true;

// Active tracking variables
let activeTaskId = null;
let endTime = null;

// Progress tracking 
let focusHistory = [];
let currentSession = 1;
const MAX_SESSIONS = 4;
