import { GanttChart } from "./components/ganttChart/ganttChart.js";

document.addEventListener("DOMContentLoaded", () => {
  // get data - could get from server
  const tasks = [
    { id: 1, name: "Task 1" },
    { id: 2, name: "Task 2" },
    { id: 3, name: "Task 3" },
    { id: 4, name: "Task 4" },
    { id: 5, name: "Task 5" },
    { id: 6, name: "Task 6" },
    { id: 7, name: "Task 7" },
    { id: 8, name: "Task 8" },
  ];

  const taskDurations = [
    {
      id: "1",
      start: new Date("2022/1/2"),
      end: new Date("2022/1/8"),
      task: 1,
    },
    {
      id: "2",
      start: new Date("2022/1/10"),
      end: new Date("2022/1/15"),
      task: 2,
    },
    {
      id: "3",
      start: new Date("2022/1/11"),
      end: new Date("2022/1/18"),
      task: 4,
    },
  ];

  const ganttCharts = document.querySelectorAll("[role=gantt-chart]");
  ganttCharts.forEach((gantChart) => {
    new GanttChart(gantChart, tasks, taskDurations);
  });
});
