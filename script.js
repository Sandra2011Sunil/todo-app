// Load tasks from localStorage when page opens
// localStorage saves data in the browser permanently
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Save tasks to localStorage every time something changes
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();

  // Don't add empty tasks
  if (!text) return;

  // Create a new task object
  const task = {
    id: Date.now(),       // unique id using timestamp
    text: text,
    completed: false
  };

  // Add to tasks array
  tasks.push(task);

  // Save to localStorage
  saveTasks();

  // Clear the input box
  input.value = '';

  // Re-render the list
  renderTasks();
}

// Toggle task complete/incomplete
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Clear all completed tasks
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

// Filter tasks — all, active, completed
function filterTasks(filter) {
  currentFilter = filter;

  // Update active button styling
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  renderTasks();
}

// Render tasks to the screen
function renderTasks() {
  const list = document.getElementById('taskList');
  const countEl = document.getElementById('taskCount');

  // Filter based on current filter
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  // Show empty message if no tasks
  if (filteredTasks.length === 0) {
    list.innerHTML = '<p class="empty-msg">No tasks here!</p>';
  } else {
    // Build HTML for each task
    list.innerHTML = filteredTasks.map(task => `
      <li class="${task.completed ? 'completed' : ''}">
        <div class="task-checkbox ${task.completed ? 'checked' : ''}"
             onclick="toggleTask(${task.id})">
        </div>
        <span class="task-text">${task.text}</span>
        <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
      </li>
    `).join('');
  }

  // Update task count — only count incomplete tasks
  const remaining = tasks.filter(task => !task.completed).length;
  countEl.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
}

// Allow pressing Enter to add task
document.getElementById('taskInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') addTask();
});

// Render tasks when page first loads
renderTasks();