document.addEventListener('DOMContentLoaded', function() {
    const inputBox = document.getElementById('input-box');
    const listContainer = document.getElementById('list-container');

    // Load saved tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskElement(task);
    });

    document.querySelector('button').addEventListener('click', addTask);

    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = inputBox.value.trim();

        if (taskText === '') {
            showError('Tehtävä ei voi olla tyhjä');
            return;
        }
        if (taskText.length < 3) {
            alert('Tehtävän tulee olla vähintään 3 merkkiä pitkä');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(task);
        createTaskElement(task);
        saveTasks();

        inputBox.value = '';
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        if (task.completed) {
            li.classList.add('checked');
        }

        li.textContent = task.text;

        li.addEventListener('click', function() {
            task.completed = !task.completed;
            if (task.completed) {
                li.classList.add('checked');
            } else {
                li.classList.remove('checked');
            }
            saveTasks();
        });

        const deleteSpan = document.createElement('span');
        deleteSpan.textContent = 'Poista';
        deleteSpan.addEventListener('click', function(event) {
            event.stopPropagation();
            listContainer.removeChild(li);
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
        });

        li.appendChild(deleteSpan);
        listContainer.appendChild(li);
    }

    function showError(message) {
        inputBox.classList.add('error');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        inputBox.parentNode.appendChild(errorMessage);
        setTimeout(() => {
            inputBox.classList.remove('error');
            inputBox.parentNode.removeChild(errorMessage);
        }, 3000);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
