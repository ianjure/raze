// Select elements and get the token from the local storage
const modal = document.querySelector(".confirm-modal");
const modalAll = document.querySelector(".all-confirm-modal");
const columnsContainer = document.querySelector(".columns");
const columns = columnsContainer.querySelectorAll(".column");
const token = localStorage.getItem("token");

// Set the current task to null
let currentTask = null;


// ----- Drag-and-Drop: To Handle Drag-and-Drop Functionality ---- //

// Function to handle drag start event
const handleDragStart = (event) => {
    // Set the drag effect and data to be transferred
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", event.target.id);
    requestAnimationFrame(() => event.target.classList.add("dragging"));
};

// Function to handle drag over event
const handleDragOver = (event) => {
    // Prevent default behavior to allow drop
    event.preventDefault();

    // Get the dragged task and the target element
    const draggedTask = document.querySelector(".dragging");
    const target = event.target.closest(".task, .tasks");

    // If target is not valid or is the same as dragged task, return
    if (!target || target === draggedTask) return;

    // Check if target is a tasks element or another task
    // If target is a tasks element, append the dragged task to it
    if (target.classList.contains("tasks")) {
        const lastTask = target.lastElementChild;
        if (!lastTask) {
            target.appendChild(draggedTask);
        } else {
            const { bottom } = lastTask.getBoundingClientRect();
            event.clientY > bottom && target.appendChild(draggedTask);
        }

    // If target is another task, insert the dragged task before or after it based on mouse position
    } else {
        const { top, height } = target.getBoundingClientRect();
        const distance = top + height / 2;
        if (event.clientY < distance) {
            target.before(draggedTask);
        } else {
            target.after(draggedTask);
        }
    }
};

// Function to handle drop event
const handleDrop = async (event) => {
    event.preventDefault();

    // Get the task ID from the dragged element
    const taskId = event.dataTransfer.getData("text/plain").replace("task-", "");
    if (!taskId) return console.error("Error: No task ID found.");

    // Identify the target column
    const targetColumn = event.target.closest(".column");
    if (!targetColumn) return console.error("Error: Drop target not found.");

    // Extract the new status from the column's data attribute
    const newStatus = targetColumn.dataset.status;
    if (!newStatus) return console.error("Error: Column status not defined.");

    // Update the task status in the database
    try {
        const response = await fetch(`/api/task/${taskId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: newStatus })
        });

        await response.json();
        if (response.ok) {

            // Get the dragged task element
            const draggedTask = document.querySelector(`#task-${taskId}`);

            // If the task is dropped in the "Done" column, update its properties
            if (newStatus === "Done") {
                draggedTask.draggable = false;
                draggedTask.style.cursor = "not-allowed";
                draggedTask.style.boxShadow = "none";

                // Remove the update button but keep the delete button
                const editButton = draggedTask.querySelector("button[data-edit]");
                if (editButton) editButton.remove();

                // Show updated user experience points and level
                showUserStatus();

                // Show a success message
                showToast("✅ Task marked as done!", "success");
            }
        } else {
            console.log("Error: Failed to update task status.");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to handle drag end event
const handleDragEnd = (event) => {
    event.target.classList.remove("dragging");
};


// ----- Task Creation: To Create Task Elements ----- //

// Function to create a task element
const createTask = (id, content) => {
    const task = document.createElement("div");
    task.className = "task";
    task.draggable = true;
    task.id = `task-${id}`;
    task.innerHTML = `
        <div>${content}</div>
        <menu>
            <button data-edit><i class="bi bi-pencil-square"></i></button>
            <button data-delete><i class="bi bi-trash"></i></button>
        </menu>`;
    task.addEventListener("dragstart", handleDragStart);
    task.addEventListener("dragend", handleDragEnd);
    return task;
};

// Function to create a task input element
const createTaskInput = (text = "") => {
    const input = document.createElement("div");
    input.className = "task-input";
    input.dataset.placeholder = "Task name";
    input.contentEditable = true;
    input.innerText = text;
    input.addEventListener("blur", handleBlur);
    return input;
};


// ----- Constant Events: To Handle Loading Tasks and Updating Task Count ----- //

// Function to load tasks from the server
const loadTasks = async () => {
    try {
        // Send a GET request to the server
        const response = await fetch("/api/task/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        // Extract the tasks from the response
        const result = await response.json();
        const tasks = result.data;

        // If the response is successful, create task elements and append them to the corresponding columns
        if (response.ok) {
            tasks.forEach(taskData => {
                const taskElement = createTask(taskData._id, taskData.task);

                // Find the column with the matching status
                const column = document.querySelector(`.column[data-status="${taskData.status}"]`);
                const tasksContainer = column?.querySelector(".tasks");

                // If the task is in the "Done" column, apply the necessary changes
                if (taskData.status === "Done") {
                    taskElement.draggable = false;
                    taskElement.style.cursor = "default";
                    taskElement.style.boxShadow = "none";

                    // Remove the update button but keep the delete button
                    const editButton = taskElement.querySelector("button[data-edit]");
                    if (editButton) editButton.remove();
                }

                // Append the task element to the tasks container
                if (tasksContainer) {
                    tasksContainer.appendChild(taskElement);
                }
            });
        } else {
            console.log("Error: Failed to load tasks.");
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to update task count in each column
const updateTaskCount = (column) => {
    const tasks = column.querySelector(".tasks").children;
    const taskCount = tasks.length;
    column.querySelector(".column-title h3").dataset.tasks = taskCount;
};

// Function to toggle the visibility of the 'Delete All' button in the 'Done' column
const toggleDeleteAllButton = () => {
    const doneColumn = document.querySelector('.column[data-status="Done"]');
    const deleteAllButton = doneColumn.querySelector("button[data-delete]");
    const tasksContainer = doneColumn.querySelector(".tasks");
    const taskCount = tasksContainer.children.length;

    // Show the button if there are more than 1 task, hide it otherwise
    deleteAllButton.style.display = taskCount > 1 ? "block" : "none";
};

// Call toggleDeleteAllButton initially to set the correct state
toggleDeleteAllButton();

// Function to observe changes in task count
const observeTaskChanges = () => {
    for (const column of columns) {
        const observer = new MutationObserver(() => {
            updateTaskCount(column);
            if (column.dataset.status === "Done") {
                toggleDeleteAllButton();
            }
        });
        observer.observe(column.querySelector(".tasks"), { childList: true });
    }
};

// Call function to load tasks on page load and observe changes
loadTasks();
observeTaskChanges();


// -- Task Actions: To Handle Task Creation, Editing, and Deletion -- //

// Function to handle adding a new task
const handleAdd = async (event) => {
    // Get the column where the task will be added
    const tasksEl = event.target.closest(".column").lastElementChild;
    const input = createTaskInput();
    tasksEl.appendChild(input);
    input.focus();
};

// Function to handle editing a task
const handleEdit = (event) => {
    // Get the task element to be edited
    const task = event.target.closest(".task");
    const input = createTaskInput(task.innerText);

    // Pass the task ID to the input field
    input.dataset.taskId = task.id.replace("task-", "");

    task.replaceWith(input);
    input.focus();

    // Select the text in the input field
    const selection = window.getSelection();
    selection.selectAllChildren(input);
    selection.collapseToEnd();
};

// Function to handle deleting a task
const handleDelete = (event) => {
    // Get the task element to be deleted
    currentTask = event.target.closest(".task");

    // Show the modal for confirmation
    const taskText = currentTask.innerText;
    modal.querySelector(".preview").innerText = taskText.length > 20 ? taskText.substring(0, 20) + "..." : taskText;
    modal.showModal();
};

// Function to handle deleting all tasks in 'Done' column
const handleDeleteAll = (event) => {
    modalAll.showModal();
};

// Function to handle task input blur event
const handleBlur = async (event) => {
    // Get the task input element and its content
    const input = event.target;
    const content = input.innerText.trim() || "Untitled";

    // If the content is empty, remove the input and return
    if (!content) {
        input.remove();
        return;
    }

    // Check if the input has a data attribute for the task ID (indicating an update)
    const taskId = input.dataset.taskId;

    try {
        let response;
        if (taskId) {
            // Update the existing task (PATCH request)
            response = await fetch(`/api/task/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ task: content })
            });
        } else {
            // Create a new task (POST request)
            response = await fetch("/api/task/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ task: content })
            });
        }

        const data = await response.json();

        // If the response is successful, create or update the task element
        if (response.ok) {
            const task = createTask(data.data._id || taskId, content.replace(/\n/g, "<br>"));
            input.replaceWith(task);

            if (taskId) {
                showToast("✔️ Task updated successfully!", "success");
            } else {
                showToast("✔️ Task created successfully!", "success");
            }
        } else {
            console.log("Error: Failed to save task.");
            input.remove();
        }
    } catch (error) {
        console.log(error);
        input.remove();
    }
};
  

// ----- Event Listeners: To Add Drag-and-Drop and Task Action Functionality ----- //

// Add drag-and-drop event listeners to each task element
tasksElements = columnsContainer.querySelectorAll(".tasks");
    for (const tasksEl of tasksElements) {
        tasksEl.addEventListener("dragover", handleDragOver);
        tasksEl.addEventListener("drop", handleDrop);
}

// Add task action event listeners to each column
columnsContainer.addEventListener("click", (event) => {
    if (event.target.closest("button[data-add]")) {
        handleAdd(event);
    } else if (event.target.closest("button[data-edit]")) {
        handleEdit(event);
    } else if (event.target.closest("button[data-delete]")) {
        handleDelete(event);
    }
});

// Add task deletion event listener to the modal for confirmation
modal.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get the task ID from the current task element
    const taskId = currentTask.id?.replace("task-", "");
    if (!taskId) return console.error("Error: No task ID found.");

    // Send a DELETE request to the server to delete the task
    try {
        const response = await fetch(`/api/task/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        // Check if the response is successful
        // If successful, remove the task element from the DOM and show a success message
        if (response.ok) {
            currentTask.remove()
            currentTask = null;
        } else {
            console.log("Error: Failed to delete task.")
        }
    } catch (error) {
        console.log(error);
    }
    
    // Show a success message
    showToast("✔️ Task deleted successfully!", "success");

    // Close the modal
    modal.close();
});

// Add event listener to the cancel button in the modal
modal.querySelector("#cancel").addEventListener("click", () => {
    modal.close()
    currentTask = null;
});

// Add event listener to close the modal when the close button is clicked
modal.addEventListener("close", () => (currentTask = null));

// Add event listener for the delete button in the 'Done' column
document.querySelector(".column-title.done button[data-delete]").addEventListener("click", handleDeleteAll);

// Add task deletion event listener to the modal for confirmation of all tasks
modalAll.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Find the 'Done' column
    const doneColumn = document.querySelector('.column[data-status="Done"]');
    if (!doneColumn) return console.error("Error: 'Done' column not found.");

    // Get all tasks in the 'Done' column
    const tasksContainer = doneColumn.querySelector(".tasks");
    const tasks = tasksContainer.querySelectorAll(".task");

    // Iterate over each task and delete it
    for (const task of tasks) {
        const taskId = task.id.replace("task-", "");
        try {
            const response = await fetch(`/api/task/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                task.remove(); // Remove the task from the DOM
            } else {
                console.log(`Error: Failed to delete task with ID ${taskId}.`);
            }
        } catch (error) {
            console.log(`Error: Failed to delete task with ID ${taskId}.`, error);
        }
    }

    // Show a success message
    showToast("✔️ Tasks deleted successfully!", "success");

    // Close the modal
    modalAll.close();
});

// Add event listener to the cancel button in the modal
modalAll.querySelector("#cancel").addEventListener("click", () => {
    modalAll.close()
});
