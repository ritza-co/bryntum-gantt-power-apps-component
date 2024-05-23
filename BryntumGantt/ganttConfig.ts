import type { BryntumGanttProps } from "@bryntum/gantt-react";


const ganttConfig: Partial<BryntumGanttProps> = {
  columns: [{ type: "name", field: "name", width: 250 }],
  viewPreset: "weekAndDayLetter",
  barMargin: 10,
  selectionMode: {
    multiSelect: false,
  },
};


export { ganttConfig };