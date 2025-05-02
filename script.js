// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskTime = document.getElementById('task-time');
const taskHours = document.getElementById('task-hours');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const completedList = document.getElementById('completed-list');
const newQuoteBtn = document.getElementById('new-quote-btn');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const totalTimeElement = document.getElementById('total-time');

// Tasks storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

// Initialize the application
function init() {
  renderTasks();
  getRandomQuote();
  setupEventListeners();
  loadThemePreference();
  updateTotalTime();
}

// Set up event listeners
function setupEventListeners() {
  taskForm.addEventListener('submit', addTask);
  newQuoteBtn.addEventListener('click', getRandomQuote);
  themeToggleBtn.addEventListener('click', toggleTheme);
}

// Check for overlapping tasks
function hasOverlappingTasks(newTaskTime, newTaskHours) {
  // Convert task time to minutes since midnight for easier calculations
  const [newHours, newMinutes] = newTaskTime.split(':').map(Number);
  const newTaskStartMinutes = newHours * 60 + newMinutes;
  const newTaskEndMinutes = newTaskStartMinutes + (newTaskHours * 60);
  
  // Check against existing tasks
  for (const task of tasks) {
    const [taskHours, taskMinutes] = task.time.split(':').map(Number);
    const taskStartMinutes = taskHours * 60 + taskMinutes;
    const taskEndMinutes = taskStartMinutes + (task.hours * 60);
    
    // Check if the new task overlaps with an existing task
    if ((newTaskStartMinutes < taskEndMinutes && newTaskEndMinutes > taskStartMinutes) ||
        (taskStartMinutes < newTaskEndMinutes && taskEndMinutes > newTaskStartMinutes)) {
      return {
        overlaps: true,
        conflictingTask: task
      };
    }
  }
  
  return { overlaps: false };
}

// Show time overlap error
function showOverlapError(conflictingTask) {
  // Format the time for display
  const timeDisplay = formatTime(conflictingTask.time);
  
  // Create and show alert
  const alertDiv = document.createElement('div');
  alertDiv.className = 'overlap-alert';
  alertDiv.innerHTML = `
    <p>Time conflict detected! This overlaps with:</p>
    <p><strong>${conflictingTask.name}</strong> at ${timeDisplay} (${conflictingTask.hours} hour${conflictingTask.hours !== 1 ? 's' : ''})</p>
    <button class="close-alert">×</button>
  `;
  
  document.querySelector('.planner-section').prepend(alertDiv);
  
  // Add event listener to close button
  alertDiv.querySelector('.close-alert').addEventListener('click', function() {
    alertDiv.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

// Add a new task
function addTask(e) {
  e.preventDefault();
  
  const taskName = taskInput.value.trim();
  const taskTimeValue = taskTime.value;
  const taskHoursValue = parseFloat(taskHours.value);
  
  if (taskName === '' || taskTimeValue === '' || isNaN(taskHoursValue)) {
    alert('Please fill in all fields');
    return;
  }
  
  // Check for time conflicts
  const overlapCheck = hasOverlappingTasks(taskTimeValue, taskHoursValue);
  if (overlapCheck.overlaps) {
    showOverlapError(overlapCheck.conflictingTask);
    return;
  }
  
  const newTask = {
    id: Date.now(),
    name: taskName,
    time: taskTimeValue,
    hours: taskHoursValue
  };
  
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  updateTotalTime();
  
  // Reset form fields
  taskInput.value = '';
  taskTime.value = '';
  taskHours.value = '1';
  
  // Focus on the task input for better UX
  taskInput.focus();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Render tasks to the DOM
function renderTasks() {
  taskList.innerHTML = '';
  completedList.innerHTML = '';
  
  // Sort tasks by time
  const sortedTasks = [...tasks].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  
  // Render pending tasks
  sortedTasks.forEach((task) => {
    const li = createTaskElement(task, false);
    taskList.appendChild(li);
  });
  
  // Sort completed tasks by time
  const sortedCompletedTasks = [...completedTasks].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  
  // Render completed tasks
  sortedCompletedTasks.forEach((task) => {
    const li = createTaskElement(task, true);
    completedList.appendChild(li);
  });
}

// Create a task element (list item)
function createTaskElement(task, isCompleted) {
  const li = document.createElement('li');
  li.className = `task-item ${isCompleted ? 'completed-task' : ''}`;
  li.dataset.id = task.id;
  
  // Format time for display (12-hour format)
  const timeDisplay = formatTime(task.time);
  
  li.innerHTML = `
    <div class="task-content">
      <span class="task-name">${task.name}</span>
      <span class="task-time">${timeDisplay}</span>
      <span class="task-hours">${task.hours} hour${task.hours !== 1 ? 's' : ''}</span>
    </div>
    <div class="task-actions">
      ${!isCompleted ? `<button class="complete-btn" title="Mark as completed">✓</button>` : ''}
      <button class="delete-btn" title="Delete task">✕</button>
    </div>
  `;
  
  // Add event listeners for action buttons
  if (!isCompleted) {
    li.querySelector('.complete-btn').addEventListener('click', () => completeTask(task.id));
  }
  li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id, isCompleted));
  
  return li;
}

// Format time to 12-hour format
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Calculate and update total estimated time
function updateTotalTime() {
  let totalHours = 0;
  
  // Sum hours from pending tasks
  tasks.forEach(task => {
    totalHours += parseFloat(task.hours || 0);
  });
  
  // Update the display with one decimal place
  totalTimeElement.textContent = totalHours.toFixed(1);
}

// Mark a task as completed
function completeTask(id) {
  // Find the task in the tasks array
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    const completedTask = tasks.splice(taskIndex, 1)[0];
    completedTasks.push(completedTask);
    
    saveTasks();
    renderTasks();
    updateTotalTime();
    
    // Trigger confetti
    startConfetti();
    
    // Stop confetti after 3 seconds
    setTimeout(() => {
      stopConfetti();
    }, 3000);
  }
}

// Delete a task
function deleteTask(id, isCompleted) {
  if (isCompleted) {
    completedTasks = completedTasks.filter(task => task.id !== id);
  } else {
    tasks = tasks.filter(task => task.id !== id);
    updateTotalTime();
  }
  
  saveTasks();
  renderTasks();
}

// Motivational quotes
const quotes = [
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "It's not the load that breaks you down, it's the way you carry it.", author: "Lou Holtz" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" }
];

// Get a random quote
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // Add spin animation to dice
  const diceElement = document.querySelector('.dice');
  diceElement.classList.add('spin');
  
  // Remove spin class after animation completes
  setTimeout(() => {
    diceElement.classList.remove('spin');
  }, 500);
  
  quoteText.textContent = `"${quote.text}"`;
  quoteAuthor.textContent = `- ${quote.author}`;
  
  // Add simple animation
  quoteText.style.opacity = 0;
  quoteAuthor.style.opacity = 0;
  
  setTimeout(() => {
    quoteText.style.opacity = 1;
    quoteAuthor.style.opacity = 1;
  }, 100);
}

// Toggle light/dark theme
function toggleTheme() {
  const body = document.body;
  
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }
}

// Load theme preference from localStorage
function loadThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
  }
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', init);