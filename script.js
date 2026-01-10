/* ---------- DOM ELEMENTS ---------- */
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");
const addOrUpdateTaskBtn = document.querySelector(".btn-primary");
const taskForm = document.getElementById("task-form");
const taskContainer = document.querySelector(".tasks-container");
const filterBtns = document.querySelectorAll("input[name='filter']");
const navLinks = document.querySelectorAll(".nav-links a");
const currentPage = window.location.pathname.split("/").pop();
const btnContainer = document.querySelector(".btn-container");

navLinks.forEach((link) => {
  const linkPage = link.getAttribute("href");

  if (
    currentPage === linkPage ||
    (currentPage === "" && linkPage === "index.html")
  ) {
    link.classList.add("active");
  }
});

/* ---------- STATE ---------- */
let taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTaskId = localStorage.getItem("editingTaskId");
let activeFilter = "all";

/* ---------- STORAGE ---------- */
function saveToStorage() {
  localStorage.setItem("data", JSON.stringify(taskData));
}

/* ---------- ADD / UPDATE ---------- */
function addOrUpdateTask() {
  if (!titleInput.value.trim()) {
    alert("Please provide a title!");
    return;
  }

  if (currentTaskId) {
    const index = taskData.findIndex((t) => t.id === currentTaskId);
    if (index !== -1) {
      taskData[index] = {
        ...taskData[index],
        title: titleInput.value,
        date: dateInput.value,
        description: descriptionInput.value,
      };
    }
  } else {
    taskData.unshift({
      id: `${titleInput.value
        .toLowerCase()
        .split(" ")
        .join("-")}-${Date.now()}`,
      title: titleInput.value,
      date: dateInput.value,
      description: descriptionInput.value,
      completed: false,
    });
  }

  saveToStorage();
  resetForm();
  renderUI();
}

/* ---------- RESET ---------- */
function resetForm() {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  currentTaskId = null;
  localStorage.removeItem("editingTaskId");
  addOrUpdateTaskBtn.textContent = "Add Task";
}

/* ---------- FILTER ---------- */
filterBtns.forEach((btn) => {
  btn.addEventListener("change", (e) => {
    activeFilter = e.target.value;
    renderUI();
  });
});

/* ---------- RENDER ---------- */
function renderUI() {
  if (!taskContainer) return;

  taskContainer.innerHTML = "";

  let visibleTasks = [...taskData];

  if (activeFilter === "completed") {
    visibleTasks = taskData.filter((task) => task.completed);
  } else if (activeFilter === "pending") {
    visibleTasks = taskData.filter((task) => !task.completed);
  }

  if (!visibleTasks.length) {
    taskContainer.innerHTML = `
        <p>No tasks found</p>
    `;
    btnContainer.innerHTML = `
      <button type="button" class="btn-primary-task btn">
        <a href="index.html">Add Task</a>
      </button>
    `
    return;
  }

  visibleTasks.forEach((task) => {
    const article = document.createElement("article");
    article.className = `task ${task.completed ? "completed" : ""}`;
    article.dataset.id = task.id;

    article.innerHTML = `
      <div class="task-header flex">
        <div class="task-title">
          <input 
            id="${task.id}" 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? "checked" : ""}
          >
          <label for="${task.id}">${task.title}</label>
        </div>
        <div class="task-date">${task.date || ""}</div>
      </div>

      <p class="task-description">${task.description || ""}</p>

      <div class="edit-dlt-btn-container">
        <button type="button" class="btn edit-btn">Edit</button>
        <button type="button" class="btn delete-btn">Delete</button>
      </div>
    `;

    taskContainer.appendChild(article);
  });
}

/* ---------- FORM ---------- */
if (taskForm) {
  if (currentTaskId) {
    const task = taskData.find((t) => t.id === currentTaskId);
    if (task) {
      titleInput.value = task.title;
      dateInput.value = task.date;
      descriptionInput.value = task.description;
      addOrUpdateTaskBtn.textContent = "Update Task";
    }
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addOrUpdateTask();
  });
}

/* ---------- TASK ACTIONS ---------- */
if (taskContainer) {
  taskContainer.addEventListener("click", (e) => {
    const article = e.target.closest(".task");
    if (!article) return;

    const taskId = article.dataset.id;
    const index = taskData.findIndex((t) => t.id === taskId);
    if (index === -1) return;

    if (e.target.classList.contains("task-checkbox")) {
      taskData[index].completed = e.target.checked;
      saveToStorage();
      renderUI();
      return;
    }

    if (e.target.classList.contains("edit-btn")) {
      localStorage.setItem("editingTaskId", taskId);
      window.location.href = "index.html";
    }

    if (e.target.classList.contains("delete-btn")) {
      taskData.splice(index, 1);
      saveToStorage();
      renderUI();
    }
  });
}

/* ---------- INIT ---------- */
renderUI();
