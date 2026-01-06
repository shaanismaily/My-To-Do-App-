/* ---------- DOM ELEMENTS (SAFE) ---------- */
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");
const taskForm = document.getElementById("task-form");
const taskContainer = document.querySelector(".tasks-container");

/* ---------- STATE ---------- */
let taskData = [];
let currentTaskId = localStorage.getItem("editingTaskId");

/* ---------- INIT STORAGE ---------- */
try {
  const storedData = JSON.parse(localStorage.getItem("data"));
  taskData = Array.isArray(storedData) ? storedData : [];
} catch {
  taskData = [];
}

/* ---------- HELPERS ---------- */
const saveToStorage = () => {
  localStorage.setItem("data", JSON.stringify(taskData));
};

const resetForm = () => {
  if (!titleInput) return;
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  localStorage.removeItem("editingTaskId");
  currentTaskId = null;
};

/* ---------- ADD / UPDATE ---------- */
const addOrUpdateTask = () => {
  if (!titleInput.value.trim()) {
    alert("Please provide a title");
    return;
  }

  if (currentTaskId) {
    const index = taskData.findIndex(t => t.id === currentTaskId);
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
      id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
      title: titleInput.value,
      date: dateInput.value,
      description: descriptionInput.value,
    });
  }

  saveToStorage();
  resetForm();

  // redirect ONLY if form exists (index.html)
  // if (taskForm) {
  //   window.location.href = "tasks.html";
  // }
};

/* ---------- RENDER ---------- */
const render = () => {
  if (!taskContainer) return;

  taskContainer.innerHTML = "";

  if (!taskData.length) {
    taskContainer.innerHTML = "<p>No tasks found</p>";
    return;
  }

  taskData.forEach(task => {
    const article = document.createElement("article");
    article.className = "task";
    article.dataset.id = task.id;

    article.innerHTML = `
      <div class="task-header flex">
        <div class="task-title">
          <input type="checkbox" id="task-${task.id}">
          <label for="task-${task.id}">${task.title}</label>
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
};

/* ---------- FORM SUBMIT ---------- */
if (taskForm) {
  // EDIT MODE PREFILL
  if (currentTaskId) {
    const task = taskData.find(t => t.id === currentTaskId);
    if (task) {
      titleInput.value = task.title;
      dateInput.value = task.date;
      descriptionInput.value = task.description;
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
    const index = taskData.findIndex(t => t.id === taskId);

    if (e.target.classList.contains("edit-btn")) {
      localStorage.setItem("editingTaskId", taskId);
      window.location.href = "index.html";
    }

    if (e.target.classList.contains("delete-btn")) {
      taskData.splice(index, 1);
      saveToStorage();
      render();
    }
  });
}

/* ---------- INITIAL RENDER ---------- */
render();


const filterBtns = document.querySelectorAll("input[type='radio']");

if (taskContainer) {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", popUp);
  })
}
function popUp() {
  alert("Work in progress on filter function");
}
