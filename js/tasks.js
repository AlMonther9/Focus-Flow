// tasks.js
// This file handles adding, deleting, and rendering tasks on the screen.

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    let priorityClass = "";
    if (task.priority === "High") {
      priorityClass = "text-on-primary-container bg-primary-container";
    } else if (task.priority === "Medium") {
      priorityClass = "text-on-tertiary-fixed-variant bg-tertiary-fixed-dim";
    } else {
      priorityClass = "text-on-secondary-container bg-secondary-fixed-dim";
    }

    const taskCard = document.createElement("div");
    const baseClasses = "group flex items-center gap-4 p-5 rounded-xl transition-all duration-300 hover:translate-x-1";
    const bgClass = task.completed ? "bg-surface-container-low opacity-60" : "bg-surface-container-lowest";
    taskCard.className = `${baseClasses} ${bgClass}`;

    taskCard.innerHTML = `
      <input
        class="w-6 h-6 rounded-lg border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
        type="checkbox"
        ${task.completed ? "checked" : ""}
        onchange="toggleTask(${index})"
      />
      <div class="flex-grow ${task.completed ? 'line-through text-on-surface-variant' : ''}">
        <span class="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1 inline-block ${priorityClass}">
          ${task.priority}
        </span>
        <h3 class="text-lg font-semibold">${task.title}</h3>
      </div>
      <button
        onclick="focusOnTask(${index})"
        class="opacity-0 group-hover:opacity-100 material-symbols-outlined text-primary p-2 hover:bg-primary-container rounded-lg transition-all"
        title="Focus on this task"
      >
        play_circle
      </button>
      <button
        onclick="deleteTask(${index})"
        class="opacity-0 group-hover:opacity-100 material-symbols-outlined text-error p-2 hover:bg-error-container rounded-lg transition-all"
        title="Delete task"
      >
        delete
      </button>
    `;

    taskList.appendChild(taskCard);
  });
}

async function addTask() {
  const title = taskInput.value.trim();
  const priority = taskPriority.value;

  if (title === "") {
    alert("Please enter a task!");
    return;
  }

  const tempTask = {
    title: title,
    priority: priority,
    completed: false,
    createdAt: new Date().toISOString()
  };

  addTaskBtn.disabled = true;
  addTaskBtn.classList.add("opacity-50");

  const createdTask = await backend.createTask(tempTask);

  // Use the UUID from backend if provided, else fallback to local timestamp
  tempTask.id = (createdTask && createdTask.id) ? createdTask.id : Date.now();

  tasks.push(tempTask);
  renderTasks();
  taskInput.value = "";

  addTaskBtn.disabled = false;
  addTaskBtn.classList.remove("opacity-50");
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  backend.updateTask(tasks[index].id, tasks[index].completed);
  renderTasks();
}

function deleteTask(index) {
  const taskId = tasks[index].id;
  tasks.splice(index, 1);
  backend.deleteTask(taskId);
  renderTasks();
}
