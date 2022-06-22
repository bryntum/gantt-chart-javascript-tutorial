import { createHtmlContentFragment } from "./htmlContent.js";
import {
  monthDiff,
  dayDiff,
  getDaysInMonth,
  getDayOfWeek,
  createFormattedDateFromStr,
  createFormattedDateFromDate,
} from "./utils.js";

export function GanttChart(ganttChartElement, tasks, taskDurations) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const contentFragment = createHtmlContentFragment();
  let taskDurationElDragged;

  // add date selector values
  let monthOptionsHTMLStrArr = [];
  for (let i = 0; i < months.length; i++) {
    monthOptionsHTMLStrArr.push(`<option value="${i}">${months[i]}</option>`);
  }

  const years = [];
  for (let i = 2022; i <= 2050; i++) {
    years.push(`<option value="${i}">${i}</option>`);
  }

  const fromSelectYear = contentFragment.querySelector("#from-select-year");
  const fromSelectMonth = contentFragment.querySelector("#from-select-month");
  const toSelectYear = contentFragment.querySelector("#to-select-year");
  const toSelectMonth = contentFragment.querySelector("#to-select-month");

  fromSelectMonth.innerHTML = `
      ${monthOptionsHTMLStrArr.join("")}
  `;
  fromSelectYear.innerHTML = `
      ${years.join("")}
  `;
  toSelectMonth.innerHTML = `
      ${monthOptionsHTMLStrArr.join("")}
  `;
  toSelectYear.innerHTML = `
      ${years.join("")}
  `;

  // create grid
  const containerTasks = contentFragment.querySelector(
    "#gantt-grid-container__tasks"
  );
  const containerTimePeriods = contentFragment.querySelector(
    "#gantt-grid-container__time"
  );
  const addTaskForm = contentFragment.querySelector("#add-task");
  const addTaskDurationForm =
    contentFragment.querySelector("#add-task-duration");
  const taskSelect = addTaskDurationForm.querySelector("#select-task");

  function createGrid() {
    const startMonth = new Date(
      parseInt(fromSelectYear.value),
      parseInt(fromSelectMonth.value)
    );
    const endMonth = new Date(
      parseInt(toSelectYear.value),
      parseInt(toSelectMonth.value)
    );
    const numMonths = monthDiff(startMonth, endMonth) + 1;

    // clear first each time it is changed
    containerTasks.innerHTML = "";
    containerTimePeriods.innerHTML = "";

    createTaskRows();
    createMonthsRow(startMonth, numMonths);
    createDaysRow(startMonth, numMonths);
    createDaysOfTheWeekRow(startMonth, numMonths);
    createTaskRowsTimePeriods(startMonth, numMonths);
    addTaskDurations();
  }

  createGrid();

  ganttChartElement.appendChild(contentFragment);

  function createTaskRows() {
    const emptyRow = document.createElement("div");
    emptyRow.className = "gantt-task-row";
    // first 3 rows are empty
    for (let i = 0; i < 3; i++) {
      containerTasks.appendChild(emptyRow.cloneNode(true));
    }

    // add task select values
    let taskOptionsHTMLStrArr = [];

    tasks.forEach((task) => {
      const taskRowEl = document.createElement("div");
      taskRowEl.id = task.id;
      taskRowEl.className = "gantt-task-row";

      const taskRowElInput = document.createElement("input");
      taskRowEl.appendChild(taskRowElInput);
      taskRowElInput.value = task.name;

      // update task name
      taskRowElInput.addEventListener("change", updateTasks);

      taskOptionsHTMLStrArr.push(
        `<option value="${task.id}">${task.name}</option>`
      );

      // add delete button
      const taskRowElDelBtn = document.createElement("button");
      taskRowElDelBtn.innerText = "✕";
      taskRowElDelBtn.addEventListener("click", deleteTask);
      taskRowEl.appendChild(taskRowElDelBtn);

      containerTasks.appendChild(taskRowEl);
    });
    taskSelect.innerHTML = `
      ${taskOptionsHTMLStrArr.join("")}
    `;
  }

  function createMonthsRow(startMonth, numMonths) {
    containerTimePeriods.style.gridTemplateColumns = `repeat(${numMonths}, 1fr)`;

    let month = new Date(startMonth);

    for (let i = 0; i < numMonths; i++) {
      const timePeriodEl = document.createElement("div");
      timePeriodEl.className = "gantt-time-period";
      // to center text vertically
      const timePeriodElSpan = document.createElement("span");
      timePeriodElSpan.innerHTML =
        months[month.getMonth()] + " " + month.getFullYear();
      timePeriodEl.appendChild(timePeriodElSpan);
      containerTimePeriods.appendChild(timePeriodEl);
      month.setMonth(month.getMonth() + 1);
    }
  }

  function createDaysRow(startMonth, numMonths) {
    let month = new Date(startMonth);

    for (let i = 0; i < numMonths; i++) {
      const timePeriodEl = document.createElement("div");
      timePeriodEl.className = "gantt-time-period";
      containerTimePeriods.appendChild(timePeriodEl);

      // add days as children
      const numDays = getDaysInMonth(month.getFullYear(), month.getMonth() + 1);

      for (let i = 1; i <= numDays; i++) {
        let dayEl = document.createElement("div");
        dayEl.className = "gantt-time-period";
        const dayElSpan = document.createElement("span");
        dayElSpan.innerHTML = i;
        dayEl.appendChild(dayElSpan);
        timePeriodEl.appendChild(dayEl);
      }

      month.setMonth(month.getMonth() + 1);
    }
  }

  function createDaysOfTheWeekRow(startMonth, numMonths) {
    let month = new Date(startMonth);

    for (let i = 0; i < numMonths; i++) {
      const timePeriodEl = document.createElement("div");
      timePeriodEl.className = "gantt-time-period day";
      containerTimePeriods.appendChild(timePeriodEl);

      // add days of the week as children
      const currYear = month.getFullYear();
      const currMonth = month.getMonth() + 1;
      const numDays = getDaysInMonth(currYear, currMonth);

      for (let i = 1; i <= numDays; i++) {
        let dayEl = document.createElement("div");
        dayEl.className = "gantt-time-period";
        const dayOfTheWeek = getDayOfWeek(currYear, currMonth - 1, i - 1);
        const dayElSpan = document.createElement("span");
        dayElSpan.innerHTML = dayOfTheWeek;
        dayEl.appendChild(dayElSpan);
        timePeriodEl.appendChild(dayEl);
      }

      month.setMonth(month.getMonth() + 1);
    }
  }

  function createTaskRowsTimePeriods(startMonth, numMonths) {
    const dayElContainer = document.createElement("div");
    dayElContainer.className = "gantt-time-period-cell-container";
    dayElContainer.style.gridTemplateColumns = `repeat(${numMonths}, 1fr)`;

    containerTimePeriods.appendChild(dayElContainer);

    tasks.forEach((task) => {
      let month = new Date(startMonth);
      for (let i = 0; i < numMonths; i++) {
        const timePeriodEl = document.createElement("div");
        timePeriodEl.className = "gantt-time-period";
        dayElContainer.appendChild(timePeriodEl);

        const currYear = month.getFullYear();
        const currMonth = month.getMonth() + 1;

        const numDays = getDaysInMonth(currYear, currMonth);

        for (let i = 1; i <= numDays; i++) {
          let dayEl = document.createElement("div");
          dayEl.className = "gantt-time-period-cell";

          // color weekend cells differently
          const dayOfTheWeek = getDayOfWeek(currYear, currMonth - 1, i - 1);
          if (dayOfTheWeek === "S") {
            dayEl.style.backgroundColor = "#f7f7f7";
          }

          // add task and date data attributes
          const formattedDate = createFormattedDateFromStr(
            currYear,
            currMonth,
            i
          );
          dayEl.dataset.task = task.id;
          dayEl.dataset.date = formattedDate;
          // for drag and drop
          dayEl.ondrop = onTaskDurationDrop;
          timePeriodEl.appendChild(dayEl);
        }

        month.setMonth(month.getMonth() + 1);
      }
    });
  }

  function addTaskDurations() {
    taskDurations.forEach((taskDuration) => {
      const dateStr = createFormattedDateFromDate(taskDuration.start);
      // find gantt-time-period-cell start position
      const startCell = containerTimePeriods.querySelector(
        `div[data-task="${taskDuration.task}"][data-date="${dateStr}"]`
      );

      if (startCell) {
        // taskDuration bar is a child of start date position of specific task
        createTaskDurationEl(taskDuration, startCell);
      }
    });
  }

  function createTaskDurationEl(taskDuration, startCell) {
    const dayElContainer = containerTimePeriods.querySelector(
      ".gantt-time-period-cell-container"
    );
    const taskDurationEl = document.createElement("div");
    taskDurationEl.classList.add("taskDuration");
    taskDurationEl.id = taskDuration.id;

    const days = dayDiff(taskDuration.start, taskDuration.end);
    taskDurationEl.style.width = `calc(${days} * 100%)`;

    // drag and drop
    taskDurationEl.draggable = "true";

    taskDurationEl.addEventListener("dragstart", (e) => {
      taskDurationEl.classList.add("dragging");
      // determine taskDuration element that was dragged
      taskDurationElDragged = e.target;
    });

    taskDurationEl.addEventListener("dragend", () => {
      taskDurationEl.classList.remove("dragging");
    });

    dayElContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    // add event listener for deleting taskDuration
    taskDurationEl.tabIndex = 0;
    taskDurationEl.addEventListener("keydown", (e) => {
      if (e.key === "Delete" || e.key === 'Backspace') {
        deleteTaskDuration(e);
      }
    });

    // append at start pos
    startCell.appendChild(taskDurationEl);

    return days;
  }

  function onTaskDurationDrop(e) {
    const targetCell = e.target;

    // prevent adding on another taskDuration
    if (targetCell.hasAttribute("draggable")) return;

    // find task
    const taskDuration = taskDurations.filter(
      (taskDuration) => taskDuration.id === taskDurationElDragged.id
    )[0];

    const dataTask = targetCell.getAttribute("data-task");
    const dataDate = targetCell.getAttribute("data-date");

    // remove old position from DOM
    taskDurationElDragged.remove();
    // add new position to DOM
    const daysDuration = createTaskDurationEl(taskDuration, targetCell);

    // get new task values
    // get start, calc end using daysDuration - make Date objects - change taskDurations
    const newTask = parseInt(dataTask);
    const newStartDate = new Date(dataDate);
    let newEndDate = new Date(dataDate);
    newEndDate.setDate(newEndDate.getDate() + daysDuration - 1);

    // update taskDurations
    taskDuration.task = newTask;
    taskDuration.start = newStartDate;
    taskDuration.end = newEndDate;

    const newTaskDuration = taskDurations.filter(
      (taskDuration) => taskDuration.id !== taskDurationElDragged.id
    );
    newTaskDuration.push(taskDuration);

    // update original / make API request to update data on backend
    taskDurations = newTaskDuration;
  }

  function deleteTaskDuration(e) {
    const taskDurationToDelete = e.target;
    // remove from DOM
    taskDurationToDelete.remove();
    // update taskDurations
    const newTaskDurations = taskDurations.filter(
      (taskDuration) => taskDuration.id !== taskDurationToDelete.id
    );
    // update original / make API request to update data on backend
    taskDurations = newTaskDurations;
  }

  function handleAddTaskDurationForm(e) {
    e.preventDefault();
    const task = parseInt(e.target.elements["select-task"].value);
    const start = e.target.elements["start-date"].value;
    const end = e.target.elements["end-date"].value;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const timeStamp = Date.now();
    const taskDuration = {
      id: `${timeStamp}`,
      start: startDate,
      end: endDate,
      task: task,
    };

    // add task duration
    taskDurations.push(taskDuration);
    // find gantt-time-period-cell start position
    const startCell = containerTimePeriods.querySelector(
      `div[data-task="${taskDuration.task}"][data-date="${start}"]`
    );

    if (startCell) {
      // taskDuration bar is a child of start date position of specific task
      createTaskDurationEl(taskDuration, startCell);
    }
  }

  function handleAddTaskForm(e) {
    e.preventDefault();
    const newTaskName = e.target.elements[0].value;
    // find largest task number, add 1 for new task - else could end up with tasks with same id
    const maxIdVal = tasks.reduce(function (a, b) {
      return Math.max(a, b.id);
    }, -Infinity);
    // create new task
    tasks.push({ id: maxIdVal + 1, name: newTaskName });
    // re-create grid
    createGrid();
  }

  function updateTasks(e) {
    const { id } = e.target.parentNode;
    const { value } = e.target.parentNode.firstChild;
    const idNum = parseInt(id);
    let newTasks = tasks.filter((task) => task.id !== idNum);
    newTasks.push({ id: idNum, name: value });

    newTasks = newTasks.sort((a, b) => a.id - b.id);
    // update original / make API request to update data on backend
    tasks = newTasks;

    // update tasks select
    let newTaskOptionsHTMLStrArr = [];
    tasks.forEach((task) => {
      newTaskOptionsHTMLStrArr.push(
        `<option value="${task.id}">${task.name}</option>`
      );

      taskSelect.innerHTML = `
        ${newTaskOptionsHTMLStrArr.join("")}
      `;
    });
  }

  function deleteTask(e) {
    const id = parseInt(e.target.parentNode.id);
    // filter out task to delete
    const newTasks = tasks.filter((task) => task.id !== id);
    // update original / make API request to update data on backend
    tasks = newTasks;

    // delete any taskDurations associated with the task
    const newTaskDurations = taskDurations.filter(
      (taskDuration) => taskDuration.task !== id
    );
    taskDurations = newTaskDurations;
    createGrid();
  }

  // re-create Grid if year / month selection changes
  fromSelectYear.addEventListener("change", createGrid);
  fromSelectMonth.addEventListener("change", createGrid);
  toSelectYear.addEventListener("change", createGrid);
  toSelectMonth.addEventListener("change", createGrid);

  addTaskDurationForm.addEventListener("submit", handleAddTaskDurationForm);
  addTaskForm.addEventListener("submit", handleAddTaskForm);
}
