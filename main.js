let input = document.querySelector(".input");
let submit = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let messageDiv = document.querySelector(".message");
let clearAllBtn = document.querySelector(".clear-all");


// Empty Array To Store The Tasks
let arrayOfTasks = [];
let isEditing = false;
let editTaskId = null;

// Check if there's tasks in local storage
if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

// Trigger initial display of tasks and check button visibility
getDataFromLocalStorage();
toggleClearAllButton();

// Add or Update Task
submit.onclick = function () {
  if (input.value !== "") {
    if (isEditing) {
      updateTaskInArray(editTaskId, input.value);
      showMessage("Task updated successfully!", "#36369b");
      isEditing = false;
      editTaskId = null;
      submit.innerText = "Add";
    } else {
      addTaskToArray(input.value);
      showMessage("Task added successfully!", "#4CAF50");
    }
    input.value = "";
    toggleClearAllButton();
  }
};

// Clear All Tasks
clearAllBtn.onclick = function () {
  arrayOfTasks = [];
  addDataToLocalStorageFrom(arrayOfTasks);
  tasksDiv.innerHTML = "";
  showMessage("All tasks have been cleared!", "#f44336");
  toggleClearAllButton();
};

// Click on task element to delete or edit
tasksDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    deleteTaskWith(e.target.parentElement.getAttribute("data-id"));
    e.target.parentElement.remove();
    showMessage("Task deleted successfully!", "#f44336");
  }

  if (e.target.classList.contains("edit")) {
    editTaskId = e.target.parentElement.getAttribute("data-id");
    let task = arrayOfTasks.find((t) => t.id == editTaskId);
    input.value = task.title;
    isEditing = true;
    submit.innerText = "Update";
  }

  if (e.target.classList.contains("task")) {
    toggleStatusTaskWith(e.target.getAttribute("data-id"));
    e.target.classList.toggle("done");
  }
});

// Add Task to Array
function addTaskToArray(taskText) {
  const task = { id: Date.now(), title: taskText, completed: false };
  arrayOfTasks.push(task);
  addElementsToPageFrom(arrayOfTasks);
  addDataToLocalStorageFrom(arrayOfTasks);
}

// Update Task in Array
function updateTaskInArray(taskId, updatedText) {
  arrayOfTasks = arrayOfTasks.map((task) => {
    if (task.id == taskId) {
      return { ...task, title: updatedText };
    }
    return task;
  });
  addElementsToPageFrom(arrayOfTasks);
  addDataToLocalStorageFrom(arrayOfTasks);
}

// Display tasks from array
function addElementsToPageFrom(arrayOfTasks) {
  tasksDiv.innerHTML = "";
  arrayOfTasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "task";
    if (task.completed) div.classList.add("done");
    div.setAttribute("data-id", task.id);
    div.appendChild(document.createTextNode(task.title));

    let editSpan = document.createElement("span");
    editSpan.className = "edit";
    editSpan.appendChild(document.createTextNode("Edit"));
    div.appendChild(editSpan);

    let deleteSpan = document.createElement("span");
    deleteSpan.className = "del";
    deleteSpan.appendChild(document.createTextNode("Delete"));
    div.appendChild(deleteSpan);

    tasksDiv.appendChild(div);
  });
  toggleClearAllButton();
}

// Add tasks to local storage
function addDataToLocalStorageFrom(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

// Retrieve data from local storage and render tasks
function getDataFromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    arrayOfTasks = JSON.parse(data);
    addElementsToPageFrom(arrayOfTasks);
  }
}

// Delete task
function deleteTaskWith(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addDataToLocalStorageFrom(arrayOfTasks);
  toggleClearAllButton();
}

// Toggle task status
function toggleStatusTaskWith(taskId) {
  arrayOfTasks = arrayOfTasks.map((task) => {
    if (task.id == taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  addDataToLocalStorageFrom(arrayOfTasks);
}

// Show message to user
function showMessage(message, color = "#4caf50") {
  messageDiv.textContent = message;
  messageDiv.style.backgroundColor = color;
  messageDiv.style.display = "block";
  
  // إخفاء الرسالة بعد ثانيتين
  setTimeout(() => {
      messageDiv.style.display = "none";
  }, 2000);
}

// Toggle Clear All button visibility
function toggleClearAllButton() {
  if (arrayOfTasks.length > 0) {
    clearAllBtn.style.display = "block";
  } else {
    clearAllBtn.style.display = "none";
  }
}
