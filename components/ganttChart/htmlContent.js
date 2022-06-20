import { cssStyles } from "./style.js";

export function createHtmlContentFragment() {
  const content = `
  <style>
    ${cssStyles()}
  </style>

  <div id="gantt-container">

    <div id="settings">
      <fieldset id="select-from">
          <legend>From</legend>
          <select id="from-select-month" name="from-select-month"></select>
          <select id="from-select-year" name="from-select-year"></select>
      </fieldset>

      <fieldset id="select-to">
          <legend>To</legend>
          <select id="to-select-month" name="to-select-month"></select>
          <select id="to-select-year" name="to-select-year"></select>
      </fieldset>

      </div>

      <div id="gantt-grid-container">
        <div id="gantt-grid-container__tasks"></div>
        <div id="gantt-grid-container__time"></div>
      </div>

      <div id="add-forms-container">

        <form id="add-task">
          <h1>Add task</h1>
          <input placeholder="add task name">
          <button>
            Add
          </button>
        </form>

        <form id="add-task-duration">
        <h1>Add task duration</h1>
        <fieldset id="task">
          <label for="select-task">Which task?</label>
          <select id="select-task" name="select-task"></select>
        </fieldset>
        <fieldset id="date">
          <label for="start-date">Start date:</label>
          <input type="date" id="start-date" name="start-date"
              value="2022-01-01"
              min="2022-01-01" max="2050-12-31"
          >
          <label for="end-date">End date:</label>
          <input type="date" id="end-date" name="end-date"
            value="2022-01-03"
            min="2022-01-01" max="2050-12-31"
          >
        </fieldset>
        <button>
          Add
        </button>
      </form>

      <div>
    </div>
  `;

  // turn the HTML string into a document fragment
  const contentFragment = document
    .createRange()
    .createContextualFragment(content);
  return contentFragment;
}
