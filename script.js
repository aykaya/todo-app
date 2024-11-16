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

    // Save after adding
    saveTasksToLocalStorage();
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
    saveTasksToLocalStorage(); // Save after toggling
}

function deleteTask(button) {
    button.parentElement.remove();
    saveTasksToLocalStorage(); // Save after deleting
}

// Add ability to press Enter to add task
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
}); 

function saveTasksToLocalStorage() {
    const taskList = document.getElementById('taskList');
    const tasks = [];
    
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('span').classList.contains('completed'),
            dueDate: li.querySelector('.due-date')?.textContent || null
        });
    });
    
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('myTasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        const taskList = document.getElementById('taskList');
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span onclick="toggleComplete(this)" ${task.completed ? 'class="completed"' : ''}>${task.text}</span>
                ${task.dueDate ? `<span class="due-date">${task.dueDate}</span>` : ''}
                <button onclick="deleteTask(this)">Delete</button>
            `;
            taskList.appendChild(li);
        });
    }
}

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage); 