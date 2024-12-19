import * as React from 'react';
import { BryntumGantt } from '@bryntum/gantt-react';
import { FunctionComponent, useRef } from 'react';
import {
    GanttDependency,
    GanttDependencyDataverse,
    GanttTask,
    GanttTaskDataverse,
    IBryntumGanttComponentProps,
    SyncData
} from './BryntumGanttComponent.types';
import LoadingSpinner from './LoadingSpinner';
import { ganttConfig } from './ganttConfig';
import { databasePrefix, dependenciesDataverseTableName, tasksDataverseTableName } from './constants';
import { DependencyModel, TaskModel } from '@bryntum/gantt';

function removeTasksDataColumnPrefixes(entities: ComponentFramework.WebApi.Entity[]) {
    return entities.map((entity: ComponentFramework.WebApi.Entity) => {
        return {
            id                     : entity[`${databasePrefix}${tasksDataverseTableName}id`],
            name                   : entity[`${databasePrefix}name`],
            startDate              : entity[`${databasePrefix}startdate`],
            endDate                : entity[`${databasePrefix}enddate`],
            effort                 : entity[`${databasePrefix}effort`],
            effortUnit             : entity[`${databasePrefix}effortunit`],
            duration               : entity[`${databasePrefix}duration`],
            durationUnit           : entity[`${databasePrefix}durationunit`],
            percentDone            : entity[`${databasePrefix}percentdone`],
            schedulingMode         : entity[`${databasePrefix}schedulingmode`],
            note                   : entity[`${databasePrefix}note`],
            constraintType         : entity[`${databasePrefix}constrainttype`],
            constraintDate         : entity[`${databasePrefix}constraintdate`],
            manuallyScheduled      : entity[`${databasePrefix}manuallyscheduled`],
            unscheduled            : entity[`${databasePrefix}unscheduled`],
            ignoreResourceCalendar : entity[`${databasePrefix}ignoreresourcecalendar`],
            effortDriven           : entity[`${databasePrefix}effortdriven`],
            inactive               : entity[`${databasePrefix}inactive`],
            cls                    : entity[`${databasePrefix}cls`],
            iconCls                : entity[`${databasePrefix}iconcls`],
            color                  : entity[`${databasePrefix}color`],
            parentIndex            : entity[`${databasePrefix}parentindex`],
            expanded               : entity[`${databasePrefix}expanded`],
            calendar               : entity[`${databasePrefix}calendar`],
            deadline               : entity[`${databasePrefix}deadline`],
            direction              : entity[`${databasePrefix}direction`],
            index                  : entity[`${databasePrefix}index`]
        } as Partial<TaskModel>;
    });
}

function removeDependenciesDataColumnPrefixes(entities: ComponentFramework.WebApi.Entity[]) {
    return entities.map((entity: ComponentFramework.WebApi.Entity) => {
        return {
            id       : entity[`${databasePrefix}${dependenciesDataverseTableName}id`],
            type     : entity[`${databasePrefix}type`],
            cls      : entity[`${databasePrefix}cls`],
            lag      : entity[`${databasePrefix}lag`],
            lagUnit  : entity[`${databasePrefix}lagunit`],
            active   : entity[`${databasePrefix}active`],
            from     : entity[`${databasePrefix}from`][`${databasePrefix}${tasksDataverseTableName}id`],
            to       : entity[`${databasePrefix}to`][`${databasePrefix}${tasksDataverseTableName}id`],
            fromSide : entity[`${databasePrefix}fromside`],
            toSide   : entity[`${databasePrefix}toside`]
        } as Partial<DependencyModel>;
    });
}

const BryntumGanttComponent: FunctionComponent<IBryntumGanttComponentProps> = (
    props
) => {
    const [data, setData] = React.useState<{
    tasks: TaskModel[];
    dependencies: DependencyModel[];
  }>();

    const gantt = useRef<BryntumGantt>(null);

    React.useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async() => {
        try {
            const tasksPromise = props?.context?.webAPI.retrieveMultipleRecords(
        `${databasePrefix}${tasksDataverseTableName}`,
        `?$orderby=${databasePrefix}index asc`
            );
            const dependenciesPromise:
        | Promise<ComponentFramework.WebApi.RetrieveMultipleResponse>
        | undefined = props?.context?.webAPI.retrieveMultipleRecords(
        `${databasePrefix}${dependenciesDataverseTableName}`,
        `?$select=${databasePrefix}type,${databasePrefix}lag,${databasePrefix}lagunit,${databasePrefix}active,${databasePrefix}fromside,${databasePrefix}toside,${databasePrefix}from,${databasePrefix}to&$expand=${databasePrefix}from($select=${databasePrefix}${tasksDataverseTableName}id),${databasePrefix}to($select=${databasePrefix}${tasksDataverseTableName}id)`
        );

            const [tasks, dependencies] = await Promise.all([
                tasksPromise,
                dependenciesPromise
            ]);
            if (tasks && dependencies) {
                setData({
                    tasks        : removeTasksDataColumnPrefixes(tasks.entities) as TaskModel[] ,
                    dependencies : removeDependenciesDataColumnPrefixes(
                        dependencies.entities
                    ) as DependencyModel[]
                });
            }
        }
        catch (e) {
            console.error(e);
            if (e instanceof Error) {
                if (e.name === 'PCFNonImplementedError') {
                    console.log('PCFNonImplementedError: ', e.message);
                    // You can add fallback data tasks and dependencies state for the development mode browser test harness
                    // webAPI is not available in the test harness
                }
            }
            throw e;
        }
    };

    const syncData = ({ store, action, records }: SyncData) => {
        const storeId = store.id;
        if (storeId === 'tasks') {
            if (action === 'add') {
                for (let i = 0; i < records.length; i++) {
                    try {
                        const newTask = records[i] as GanttTask;
                        const insertData: Partial<GanttTaskDataverse> = {
                            [`${databasePrefix}name`]           : newTask.name,
                            [`${databasePrefix}startdate`]      : newTask.startDate,
                            [`${databasePrefix}enddate`]        : newTask.endDate,
                            [`${databasePrefix}effort`]         : newTask.effort,
                            [`${databasePrefix}effortunit`]     : newTask.effortUnit,
                            [`${databasePrefix}duration`]       : newTask.duration,
                            [`${databasePrefix}durationunit`]   : newTask.durationUnit,
                            [`${databasePrefix}percentdone`]    : newTask.percentDone,
                            [`${databasePrefix}schedulingmode`] : newTask.schedulingMode,
                            [`${databasePrefix}constrainttype`] : newTask.constraintType,
                            [`${databasePrefix}constraintdate`] : newTask.constraintDate,
                            [`${databasePrefix}manuallyscheduled`] :
                newTask.manuallyScheduled !== undefined &&
                newTask.manuallyScheduled !== null
                    ? Number(newTask.manuallyScheduled)
                    : newTask.manuallyScheduled,
                            [`${databasePrefix}unscheduled`] :
                newTask.unscheduled !== undefined &&
                newTask.unscheduled !== null
                    ? Number(newTask.unscheduled)
                    : newTask.unscheduled,
                            [`${databasePrefix}effortdriven`] :
                newTask.effortDriven !== undefined &&
                newTask.effortDriven !== null
                    ? Number(newTask.effortDriven)
                    : newTask.effortDriven,
                            [`${databasePrefix}inactive`] :
                newTask.inactive !== undefined && newTask.inactive !== null
                    ? Number(newTask.inactive)
                    : newTask.inactive,
                            [`${databasePrefix}cls`]         : newTask.cls,
                            [`${databasePrefix}parentindex`] : newTask.parentIndex,
                            [`${databasePrefix}calendar`] :
                newTask.calendar !== undefined && newTask.calendar !== null
                    ? Number(newTask.calendar)
                    : newTask.calendar,
                            [`${databasePrefix}direction`] : newTask.direction
                        };

                        if (newTask.ignoreResourceCalendar !== null) {
                            insertData[`${databasePrefix}ignoreresourcecalendar`] =
                newTask.ignoreResourceCalendar;
                        }
                        if (newTask.note !== null) {
                            insertData[`${databasePrefix}note`] = newTask.note;
                        }
                        if (newTask.iconCls !== null) {
                            insertData[`${databasePrefix}iconcls`] = newTask.iconCls;
                        }
                        if (newTask.color !== null) {
                            insertData[`${databasePrefix}color`] = newTask.color;
                        }
                        if (newTask.expanded !== null) {
                            insertData[`${databasePrefix}expanded`] = Number(
                                newTask.expanded
                            );
                        }
                        if (newTask.deadline !== null) {
                            insertData[`${databasePrefix}deadline`] = newTask.deadline;
                        }
                        if (newTask.index !== null) {
                            insertData[`${databasePrefix}index`] = newTask.index;
                        }

                        return props?.context?.webAPI
                            .createRecord(
                `${databasePrefix}${tasksDataverseTableName}`,
                insertData
                            )
                            .then((res) => {
                                if (gantt?.current?.instance) {
                                    gantt.current.instance.taskStore.applyChangeset({
                                        updated : [
                                            // Will set proper id for added task
                                            {
                                                $PhantomId : newTask.id,
                                                id         : res.id
                                            }
                                        ]
                                    });
                                }
                            });
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
            if (action === 'remove') {
                if (records[0].data.id.startsWith('_generated')) return;
                records.forEach((record) => {
                    try {
                        return props?.context?.webAPI
                            .deleteRecord(
                `${databasePrefix}${tasksDataverseTableName}`,
                record.data.id
                            )
                            .then((res) => {
                                console.log('deleteRecord: ', { res });
                            });
                    }
                    catch (error) {
                        console.error(error);
                    }
                });
            }

            if (action === 'update') {
                for (let i = 0; i < records.length; i++) {
                    try {
                        if (records[i].data.id.startsWith('_generated')) continue;
                        const task = records[i];
                        const updateData: Partial<GanttTaskDataverse> = {
                            [`${databasePrefix}name`]           : task.name,
                            [`${databasePrefix}startdate`]      : task.startDate,
                            [`${databasePrefix}enddate`]        : task.endDate,
                            [`${databasePrefix}effort`]         : task.effort,
                            [`${databasePrefix}effortunit`]     : task.effortUnit,
                            [`${databasePrefix}duration`]       : task.duration,
                            [`${databasePrefix}durationunit`]   : task.durationUnit,
                            [`${databasePrefix}percentdone`]    : task.percentDone,
                            [`${databasePrefix}schedulingmode`] : task.schedulingMode,
                            [`${databasePrefix}constrainttype`] : task.constraintType,
                            [`${databasePrefix}constraintdate`] : task.constraintDate,
                            [`${databasePrefix}manuallyscheduled`] :
                task.manuallyScheduled !== undefined &&
                task.manuallyScheduled !== null
                    ? Number(task.manuallyScheduled)
                    : task.manuallyScheduled,
                            [`${databasePrefix}unscheduled`] :
                task.unscheduled !== undefined && task.unscheduled !== null
                    ? Number(task.unscheduled)
                    : task.unscheduled,
                            [`${databasePrefix}effortdriven`] :
                task.effortDriven !== undefined && task.effortDriven !== null
                    ? Number(task.effortDriven)
                    : task.effortDriven,
                            [`${databasePrefix}inactive`] :
                task.inactive !== undefined && task.inactive !== null
                    ? Number(task.inactive)
                    : task.inactive,
                            [`${databasePrefix}cls`]         : task.cls,
                            [`${databasePrefix}parentindex`] : task.parentIndex,
                            [`${databasePrefix}calendar`] :
                task.calendar !== undefined && task.calendar !== null
                    ? Number(task.calendar)
                    : task.calendar,
                            [`${databasePrefix}direction`] : task.direction
                        };

                        if (task.ignoreResourceCalendar !== null) {
                            updateData[`${databasePrefix}ignoreresourcecalendar`] = Number(
                                task.ignoreResourceCalendar
                            );
                        }
                        if (task.note !== null) {
                            updateData[`${databasePrefix}note`] = task.note;
                        }
                        if (task.iconCls !== null) {
                            updateData[`${databasePrefix}iconcls`] = task.iconCls;
                        }
                        if (task.color !== null) {
                            updateData[`${databasePrefix}color`] = task.color;
                        }
                        if (task.expanded !== null) {
                            updateData[`${databasePrefix}expanded`] = Number(task.expanded);
                        }
                        if (task.deadline !== null) {
                            updateData[`${databasePrefix}deadline`] = task.deadline;
                        }
                        if (task.index !== null) {
                            updateData[`${databasePrefix}index`] = task.index;
                        }

                        return props?.context?.webAPI
                            .updateRecord(
                `${databasePrefix}${tasksDataverseTableName}`,
                task.id,
                updateData
                            )
                            .then((res) => {
                                console.log('webAPI.updateRecord for tasks response: ', res);
                            });
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
        }
        if (storeId === 'dependencies') {
            if (action === 'add') {
                for (let i = 0; i < records.length; i++) {
                    try {
                        const newDep = records[i];
                        const insertData: Partial<GanttDependencyDataverse> = {
                            [`${databasePrefix}type`] :
                newDep.type !== undefined && newDep.type !== null
                    ? Number(newDep.type)
                    : newDep.type,
                            [`${databasePrefix}lag`]     : newDep.lag,
                            // case sensitive
                            [`${databasePrefix}lagunit`] : newDep.lagUnit,
                            [`${databasePrefix}active`] :
                newDep.active !== undefined && newDep.active !== null
                    ? Number(newDep.active)
                    : newDep.active,
                            [`${databasePrefix}from@odata.bind`] : `/${databasePrefix}${tasksDataverseTableName}es(${newDep.from})`,
                            [`${databasePrefix}to@odata.bind`]   : `/${databasePrefix}${tasksDataverseTableName}es(${newDep.to})`
                        };

                        if (newDep.cls !== null && newDep.cls !== '') {
                            insertData[`${databasePrefix}cls`] = newDep.cls;
                        }
                        if (newDep.fromSide !== null) {
                            insertData[`${databasePrefix}fromside`] = newDep.fromSide;
                        }
                        if (newDep.toSide !== null) {
                            insertData[`${databasePrefix}toside`] = newDep.toSide;
                        }

                        return props?.context?.webAPI
                            .createRecord(
                `${databasePrefix}${dependenciesDataverseTableName}`,
                insertData
                            )
                            .then((res) => {
                                if (gantt?.current?.instance) {
                                    // @ts-ignore
                                    gantt.current.instance.dependencyStore.applyChangeset({
                                        updated : [
                                            // Will set proper id for added dependency
                                            {
                                                $PhantomId : newDep.id,
                                                id         : res.id
                                            }
                                        ]
                                    });
                                }
                            });
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
            if (action === 'remove') {
                if (records[0].data.id.startsWith('_generated')) return;
                records.forEach((record) => {
                    try {
                        return props?.context?.webAPI
                            .deleteRecord(
                `${databasePrefix}${dependenciesDataverseTableName}`,
                record.data.id
                            )
                            .then((res) => {
                                console.log('deleteRecord: ', { res });
                            });
                    }
                    catch (error) {
                        console.error(error);
                    }
                });
            }
            if (action === 'update') {
                for (let i = 0; i < records.length; i++) {
                    try {
                        if (records[i].data.id.startsWith('_generated')) continue;
                        const dep = records[i] as GanttDependency;
                        const updateData: Partial<GanttDependencyDataverse> = {
                            [`${databasePrefix}type`] :
                dep.type !== undefined && dep.type !== null
                    ? Number(dep.type)
                    : dep.type,
                            [`${databasePrefix}lag`]     : dep.lag,
                            // case sensitive
                            [`${databasePrefix}lagunit`] : dep.lagUnit,
                            [`${databasePrefix}active`] :
                dep.active !== undefined && dep.active !== null
                    ? Number(dep.active)
                    : dep.active,
                            [`${databasePrefix}from@odata.bind`] : `/${databasePrefix}${tasksDataverseTableName}es(${dep.from})`,
                            [`${databasePrefix}to@odata.bind`]   : `/${databasePrefix}${tasksDataverseTableName}es(${dep.to})`
                        };

                        if (dep.cls !== null && dep.cls !== '') {
                            updateData[`${databasePrefix}cls`] = dep.cls;
                        }
                        if (dep.fromSide !== null) {
                            updateData[`${databasePrefix}fromside`] = dep.fromSide;
                        }
                        if (dep.toSide !== null) {
                            updateData[`${databasePrefix}toside`] = dep.toSide;
                        }

                        return props?.context?.webAPI
                            .updateRecord(
                `${databasePrefix}${dependenciesDataverseTableName}`,
                dep.id,
                updateData
                            )
                            .then((res) => {
                                console.log(
                                    'webAPI.updateRecord for dependencies response: ',
                                    res
                                );
                            });
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
        }
    };

    return data ? (
        // @ts-ignore
        <BryntumGantt
            ref={gantt}
            tasks={data.tasks}
            dependencies={data.dependencies}
            onDataChange={syncData}
            {...ganttConfig}
        />
    ) : (
        <LoadingSpinner />
    );
};

// If you plan to use stateful React collections for data binding please check this guide
// https://bryntum.com/products/gantt/docs/guide/Gantt/integration/react/data-binding

export default BryntumGanttComponent;