import type { BryntumGanttProps } from '@bryntum/gantt-react';


const ganttConfig: Partial<BryntumGanttProps> = {
    taskStore : {
        // @ts-ignore
        tree              : true,
        transformFlatData : true,
    },
    columns       : [{ type : 'name', field : 'name', width : 250 }],
    viewPreset    : 'weekAndDayLetter',
    barMargin     : 10,
    selectionMode : {
        multiSelect : false
    }
};


export { ganttConfig };