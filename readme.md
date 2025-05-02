## Project Overview
Smart Daily Planner is an interactive web application designed to help users organize their day effectively. It provides a clean, intuitive interface for managing tasks with time scheduling, preventing scheduling conflicts, and tracking completed activities.

## Key Features

### Task Management
- **Add Tasks:** Create new tasks with specific names, start times, and estimated duration
- **Time Conflict Detection:** Automatically detects and prevents overlapping task schedules
- **Task Sorting:** Tasks automatically sort by scheduled time
- **Task Completion:** Mark tasks as complete with visual feedback (confetti animation)
- **Task Deletion:** Remove tasks from either pending or completed lists

### User Experience
- **Motivational Quotes:** Random inspirational quotes to boost motivation
- **Dark/Light Mode:** Toggle between color themes for comfortable viewing in any environment
- **Visual Feedback:** Smooth animations for task additions, completions, and alerts
- **Persistence:** All tasks and settings are saved in browser local storage

## Technical Implementation
The application is built using vanilla JavaScript, HTML, and CSS with a focus on:

1. **Clean Architecture:** Separation of data management and UI rendering
2. **Responsive Design:** Works seamlessly across desktop and mobile devices
3. **Time Management:** Intelligent handling of time conflicts and scheduling
4. **Local Storage:** Data persists between sessions using browser storage
5. **Animations:** Subtle animations enhance the user experience

## How to Use
1. Enter a task name, start time, and estimated duration
2. Click "Add Task" to schedule the task
3. Tasks appear in the "Pending Tasks" section, sorted by time
4. Click the check mark to complete a task (with celebratory confetti!)
5. Completed tasks move to the "Completed Tasks" section
6. Click the X to delete any task
7. Toggle between light and dark modes using the sun/moon button
8. Click the dice to view a new motivational quote