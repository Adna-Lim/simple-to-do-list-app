const listTitle = document.getElementById('listTitle');
const taskList = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTaskButton');

let tasks = [];

// Function to display tasks
function displayTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('li');
        taskElement.className = task.completed ? 'completed' : '';

        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        taskInfo.innerHTML = `
            <input type="checkbox" id="checkbox${index}" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${index})">
            <span id="taskTitle${index}" onclick="toggleComplete(${index})">${task.title}</span>
        `;
        taskElement.appendChild(taskInfo);

        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.innerHTML = `
            <button class="edit" onclick="editTask(${index})"><i class="fas fa-edit"></i></button>
            <button class="remove" onclick="removeTask(${index})">-</button>
        `;
        taskElement.appendChild(actions);

        taskList.appendChild(taskElement);
    });
}

// Function to add a new task
function addTask() {
    const title = prompt('Enter a new task:');
    if (title && title.trim() !== '') {
        const newTask = {
            title: title.trim(),
            completed: false
        };
        tasks.push(newTask);
        displayTasks();
        saveTasks();
    }
}

// Function to edit a task
function editTask(index) {
    const newTitle = prompt('Enter new title:', tasks[index].title);
    if (newTitle !== null && newTitle.trim() !== '') {
        tasks[index].title = newTitle.trim();
        displayTasks();
        saveTasks();
    }
}

// Function to remove a task
function removeTask(index) {
    tasks.splice(index, 1);
    displayTasks();
    saveTasks();
}

// Function to toggle task completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    displayTasks();
    saveTasks();
}

// Event listener for "+" button click
addTaskButton.addEventListener('click', addTask);

// Event listener for title change
listTitle.addEventListener('input', function() {
    // No action needed on input event
});

// Function to save tasks to the server
function saveTasks() {
    fetch('/tasks', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save tasks.');
        }
    })
    .catch(error => {
        console.error('Error saving tasks:', error);
    });
}

// Initial display of tasks
fetch('/tasks')
    .then(response => response.json())
    .then(data => {
        tasks = data;
        displayTasks();
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });
