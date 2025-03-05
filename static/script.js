// Load todos when the page loads
document.addEventListener('DOMContentLoaded', loadTodos);

function loadTodos() {
    // Add loading state
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.add('loading');
    });

    fetch('/api/todos')
        .then(response => response.json())
        .then(data => {
            for (const category in data) {
                const ul = document.getElementById(`${category}-todos`);
                ul.innerHTML = '';

                if (data[category].length === 0) {
                    ul.innerHTML = `
                        <div class="empty-state">
                            No tasks yet. Add one above!
                        </div>
                    `;
                } else {
                    data[category].forEach(task => {
                        addTodoToList(category, task);
                    });
                }
            }

            // Remove loading state
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('loading');
            });
        })
        .catch(error => {
            console.error('Error loading todos:', error);
            showNotification('Error loading tasks', 'error');
        });
}

function addTodo() {
    const categorySelect = document.getElementById('category');
    const taskInput = document.getElementById('task');

    const category = categorySelect.value;
    const task = taskInput.value.trim();

    if (task) {
        // Disable input and button while submitting
        taskInput.disabled = true;
        categorySelect.disabled = true;

        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category, task })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    addTodoToList(category, task);
                    taskInput.value = '';
                    showNotification('Task added successfully!', 'success');
                }
            })
            .catch(error => {
                console.error('Error adding todo:', error);
                showNotification('Error adding task', 'error');
            })
            .finally(() => {
                // Re-enable input and button
                taskInput.disabled = false;
                categorySelect.disabled = false;
                taskInput.focus();
            });
    }
}

function addTodoToList(category, task) {
    const ul = document.getElementById(`${category}-todos`);

    // Remove empty state if it exists
    const emptyState = ul.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const li = document.createElement('li');
    li.style.opacity = '0';
    li.style.transform = 'translateY(20px)';

    li.innerHTML = `
        <span>${task}</span>
        <button class="delete-btn" onclick="deleteTodo('${category}', '${task}')">
            Delete
        </button>
    `;

    ul.appendChild(li);

    // Trigger reflow
    li.offsetHeight;

    // Add animation
    li.style.transition = 'all 0.3s ease-out';
    li.style.opacity = '1';
    li.style.transform = 'translateY(0)';
}
[]
function deleteTodo(category, task) {
    const taskElement = Array.from(document.querySelectorAll('li')).find(
        li => li.textContent.includes(task)
    );

    if (taskElement) {
        taskElement.style.transition = 'all 0.3s ease-out';
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'translateX(100px)';
    }

    setTimeout(() => {
        fetch('/api/todos', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category, task })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadTodos();
                    showNotification('Task deleted successfully!', 'success');
                }
            })
            .catch(error => {
                console.error('Error deleting todo:', error);
                showNotification('Error deleting task', 'error');
            });
    }, 300);
}

// Add notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'task') {
        addTodo();
    }
}); 