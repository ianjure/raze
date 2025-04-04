const modal = document.querySelector(".confirm-modal");
const columnsContainer = document.querySelector(".columns");
const columns = columnsContainer.querySelectorAll(".column");

const token = localStorage.getItem("token");

const loadTasks = async () => {
    try {
        const response = await fetch("/api/task/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json(); // Extract full response JSON
        const tasks = result.data; // Extract tasks array

        if (response.ok) {
            tasks.forEach(taskData => {
                const taskElement = createTask(taskData._id, taskData.task);

                // Find the column with the matching status
                const column = document.querySelector(`.column[data-status="${taskData.status}"]`);
                const tasksContainer = column?.querySelector(".tasks");

                if (tasksContainer) {
                    tasksContainer.appendChild(taskElement);
                } else {
                    console.warn(`No column found for status: ${taskData.status}`);
                }
            });
        } else {
            showToast("Failed to load tasks", "error");
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
        showToast("Error loading tasks. Please try again.", "error");
    }
};

// Call function to load tasks on page load
loadTasks();


// functions
const handleDragover = (event) => {
    event.preventDefault(); // allow drop

    const draggedTask = document.querySelector(".dragging");
    const target = event.target.closest(".task, .tasks");

    if (!target || target === draggedTask) return;

    if (target.classList.contains("tasks")) {
        // target is the tasks element
        const lastTask = target.lastElementChild;
        if (!lastTask) {
            // tasks is empty
            target.appendChild(draggedTask);
        } else {
            const { bottom } = lastTask.getBoundingClientRect();
            event.clientY > bottom && target.appendChild(draggedTask);
        }
    } else {
        // target is another
        const { top, height } = target.getBoundingClientRect();
        const distance = top + height / 2;

        if (event.clientY < distance) {
            target.before(draggedTask);
        } else {
            target.after(draggedTask);
        }
    }
};
  
const handleDrop = async (event) => {
    event.preventDefault();

    // Get the task ID from the dragged element
    const taskId = event.dataTransfer.getData("text/plain");
    if (!taskId) return console.error("Error: No task ID found");

    // Identify the target column
    const targetColumn = event.target.closest(".column");
    if (!targetColumn) return console.error("Error: Drop target not found");

    // Extract the new status from the column's data attribute
    const newStatus = targetColumn.dataset.status;
    if (!newStatus) return console.error("Error: Column status not defined");

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

        const data = await response.json();
        if (response.ok) {
            console.log(`Task ${taskId} updated to status: ${newStatus}`);
        } else {
            showToast(data.message, "error");
        }
    } catch (error) {
        console.error("Task update failed:", error);
        showToast("Error updating task. Please try again.", "error");
    }
};
  
const handleDragend = (event) => {
    event.target.classList.remove("dragging");
};
  
const handleDragstart = (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", event.target.id);
    requestAnimationFrame(() => event.target.classList.add("dragging"));
};
  
const handleDelete = (event) => {
    currentTask = event.target.closest(".task");

    // show preview
    modal.querySelector(".preview").innerText = currentTask.innerText.substring(0, 100);
    modal.showModal();
};
  
const handleEdit = (event) => {
    const task = event.target.closest(".task");
    const input = createTaskInput(task.innerText);
    task.replaceWith(input);
    input.focus();

    // move cursor to the end
    const selection = window.getSelection();
    selection.selectAllChildren(input);
    selection.collapseToEnd();
};
  
const handleBlur = (event) => {
    const input = event.target;
    const content = input.innerText.trim() || "Untitled";
    const task = createTask(content.replace(/\n/g, "<br>"));
    input.replaceWith(task);
};
  
const handleAdd = async (event) => {
    const tasksEl = event.target.closest(".column").lastElementChild;
    const input = createTaskInput();
    tasksEl.appendChild(input);
    input.focus();

    // Wait for user input before capturing text
    input.addEventListener("blur", async () => {
        const task = input.innerText.trim();
        if (!task) {
            input.remove(); // Remove empty task input
            return;
        }

        // Save task to database
        try {
            const response = await fetch("/api/task/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ task })
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);
            } else {
                showToast(data.message, "error");
            }
        } catch (error) {
            console.error("Create Task Failed:", error);
            showToast("Error creating task. Please try again.", "error");
        }
    });
};
  
const updateTaskCount = (column) => {
    const tasks = column.querySelector(".tasks").children;
    const taskCount = tasks.length;
    column.querySelector(".column-title h3").dataset.tasks = taskCount;
};
  
const observeTaskChanges = () => {
    for (const column of columns) {
        const observer = new MutationObserver(() => updateTaskCount(column));
        observer.observe(column.querySelector(".tasks"), { childList: true });
    }
};
  
observeTaskChanges();

const createTask = (id, content) => {
    const task = document.createElement("div");
    task.className = "task";
    task.draggable = true;
    task.id = `${id}`;
    task.innerHTML = `
        <div>${content}</div>
        <menu>
            <button data-edit><i class="bi bi-pencil-square"></i></button>
            <button data-delete><i class="bi bi-trash"></i></button>
        </menu>`;
    task.addEventListener("dragstart", handleDragstart);
    task.addEventListener("dragend", handleDragend);
    return task;
};

const createTaskInput = (text = "") => {
    const input = document.createElement("div");
    input.className = "task-input";
    input.dataset.placeholder = "Task name";
    input.contentEditable = true;
    input.innerText = text;
    input.addEventListener("blur", handleBlur);
    return input;
};
  
  //* event listeners
  
// dragover and drop
tasksElements = columnsContainer.querySelectorAll(".tasks");
    for (const tasksEl of tasksElements) {
        tasksEl.addEventListener("dragover", handleDragover);
        tasksEl.addEventListener("drop", handleDrop);
}
  
// add, edit and delete task
columnsContainer.addEventListener("click", (event) => {
    if (event.target.closest("button[data-add]")) {
        handleAdd(event);
    } else if (event.target.closest("button[data-edit]")) {
        handleEdit(event);
    } else if (event.target.closest("button[data-delete]")) {
        handleDelete(event);
    }
});
  
// Confirm Deletion
modal.addEventListener("submit", async () => {
    if (!currentTask) return;

    const taskId = currentTask.id?.replace("task-", ""); // Extract ID from element
    if (!taskId) return;

    try {
        const response = await fetch(`/api/task/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            currentTask.remove(); // Remove from DOM
            showToast("Task deleted successfully", "success");
        } else {
            const error = await response.json();
            showToast(error.message || "Failed to delete task", "error");
        }
    } catch (error) {
        console.error("Delete error:", error);
        showToast("Error deleting task. Try again.", "error");
    }
});

// cancel deletion
modal.querySelector("#cancel").addEventListener("click", () => modal.close());

// clear current task
modal.addEventListener("close", () => (currentTask = null));