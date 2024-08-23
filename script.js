document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    // Add event listeners for Enter key on input fields
    document.getElementById('task-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    document.getElementById('habit-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addHabit();
        }
    });
});

function loadTasks() {
    loadFromLocalStorage('tasks', 'task-list');
    loadFromLocalStorage('habits', 'habit-list');
}

function loadFromLocalStorage(key, listId) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    items.forEach(item => addItemToDOM(item.text, listId, item.completed));
}

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        addItemToDOM(taskText, 'task-list');
        saveToLocalStorage('tasks', { text: taskText, completed: false });
        taskInput.value = '';
    }
}

function addHabit() {
    const habitInput = document.getElementById('habit-input');
    const habitText = habitInput.value.trim();
    if (habitText !== '') {
        addItemToDOM(habitText, 'habit-list');
        saveToLocalStorage('habits', { text: habitText, completed: false });
        habitInput.value = '';
    }
}

function addItemToDOM(itemText, listId, completed = false) {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.onclick = function() {
        toggleComplete(this);
        updateLocalStorage(listId === 'task-list' ? 'tasks' : 'habits', itemText, this.checked);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = function() {
        deleteItem(this, listId);
        removeFromLocalStorage(listId === 'task-list' ? 'tasks' : 'habits', itemText);
    };
    
    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(itemText));
    listItem.appendChild(deleteBtn);
    if (completed) {
        listItem.classList.add('completed');
    }
    
    document.getElementById(listId).appendChild(listItem);
}

function toggleComplete(checkbox) {
    const listItem = checkbox.parentNode;
    listItem.classList.toggle('completed');
}

function deleteItem(deleteBtn, listId) {
    const listItem = deleteBtn.parentNode;
    listItem.remove();
}

function saveToLocalStorage(key, item) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    items.push(item);
    localStorage.setItem(key, JSON.stringify(items));
}

function updateLocalStorage(key, text, completed) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    const updatedItems = items.map(item => 
        item.text === text ? { ...item, completed: completed } : item
    );
    localStorage.setItem(key, JSON.stringify(updatedItems));
}

function removeFromLocalStorage(key, text) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    const updatedItems = items.filter(item => item.text !== text);
    localStorage.setItem(key, JSON.stringify(updatedItems));
}
