document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterAll = document.getElementById('filterAll');
    const filterActive = document.getElementById('filterActive');
    const filterCompleted = document.getElementById('filterCompleted');
    const editTaskInput = document.getElementById('editTaskInput');
    const saveEditBtn = document.getElementById('saveEditBtn');
    let editingTaskId = null;

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    };

    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const addTaskToDOM = (task) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-description${task.completed ? ' completed' : ''}">${task.description}</span>
            <button class="complete-btn" onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="remove-btn" onclick="removeTask(${task.id})">Remove</button>
        `;
        taskList.appendChild(li);
    };

    const addTask = () => {
        const description = taskInput.value.trim();
        if (description === '') return;

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = {
            id: Math.random(),
            description: description,
            completed: false
        };
        tasks.push(newTask);
        saveTasks(tasks);
        addTaskToDOM(newTask);
        taskInput.value = '';
    };

    const updateTaskDescription = (taskId, newDescription) => {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.description = newDescription;
            saveTasks(tasks);
            updateTaskList();
        }
    };

    window.toggleTask = (taskId) => {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasks(tasks);
            updateTaskList();
        }
    };

    window.removeTask = (taskId) => {
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks(tasks);
        updateTaskList();
    };

    window.editTask = (taskId) => {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            editingTaskId = taskId;
            editTaskInput.value = task.description;
            editTaskInput.style.display = 'inline-block'; // Show the edit input
            saveEditBtn.style.display = 'inline-block'; // Show the save button
        }
    };

    const saveEdit = () => {
        if (editingTaskId !== null) {
            const newDescription = editTaskInput.value.trim();
            updateTaskDescription(editingTaskId, newDescription);
            editTaskInput.style.display = 'none'; // Hide the edit input
            saveEditBtn.style.display = 'none'; // Hide the save button
            editingTaskId = null;
        }
    };

    const updateTaskList = () => {
        taskList.innerHTML = '';
        loadTasks();
    };

    const applyFilter = (filter) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
        });
        taskList.innerHTML = '';
        filteredTasks.forEach(task => addTaskToDOM(task));
    };

    filterAll.addEventListener('click', () => applyFilter('all'));
    filterActive.addEventListener('click', () => applyFilter('active'));
    filterCompleted.addEventListener('click', () => applyFilter('completed'));

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    saveEditBtn.addEventListener('click', saveEdit);

    // Initially hide the edit input and save button
    editTaskInput.style.display = 'none';
    saveEditBtn.style.display = 'none';

    loadTasks();
});
