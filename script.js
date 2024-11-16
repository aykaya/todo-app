function addTask() {
    const input = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('taskDueDate');
    const taskText = input.value.trim();
    const dueDate = dueDateInput.value;
    
    if (taskText === '') return; // Don't add empty tasks
    
    const taskList = document.getElementById('taskList');
    
    // Create new list item
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="task-content">
            <span onclick="toggleComplete(this)">${taskText}</span>
            ${dueDate ? `<span class="due-date">${formatDueDate(dueDate)}</span>` : ''}
        </div>
        <button onclick="deleteTask(this)">Delete</button>
    `;
    
    // Add to list
    taskList.appendChild(li);
    
    // Clear inputs
    input.value = '';
    dueDateInput.value = '';

    // Start checking for overdue tasks
    checkOverdueTasks();
}

function formatDueDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit'
    });
}

function checkOverdueTasks() {
    const dueDates = document.querySelectorAll('.due-date');
    const now = new Date();

    dueDates.forEach(dateSpan => {
        const dueDate = new Date(dateSpan.textContent);
        if (dueDate < now) {
            dateSpan.classList.add('overdue');
        } else {
            dateSpan.classList.remove('overdue');
        }
    });
}

// Check for overdue tasks every minute
setInterval(checkOverdueTasks, 60000);

function toggleComplete(element) {
    element.classList.toggle('completed');
}

function deleteTask(button) {
    button.parentElement.remove();
}

// Add ability to press Enter to add task
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
}); 