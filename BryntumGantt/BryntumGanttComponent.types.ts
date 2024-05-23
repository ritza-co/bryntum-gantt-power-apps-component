import { databasePrefix } from "./constants";
import { IInputs } from "./generated/ManifestTypes";

export interface IBryntumGanttComponentProps {
  context?: ComponentFramework.Context<IInputs>;
}

type RecordItem = {
  data: GanttTask | GanttDependency;
  meta: {
    modified: Partial<GanttTask> | Partial<GanttDependency>;
  };
} & GanttTask &
  GanttDependency;

export type SyncData = {
  action: "dataset" | "add" | "remove" | "update";
  records: RecordItem[];
  store: {
    id: "tasks" | "dependencies";
  };
};

export type GanttTask = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  effort: number;
  effortUnit: string;
  duration: number;
  durationUnit: string;
  percentDone: number;
  schedulingMode: string;
  note: string;
  constraintType: string;
  constraintDate: string;
  manuallyScheduled: number;
  unscheduled: number;
  ignoreResourceCalendar: number;
  effortDriven: number;
  inactive: number;
  cls: string;
  iconCls: string;
  color: string;
  parentIndex: number;
  expanded: number;
  calendar: number;
  deadline: string;
  direction: string;
  index: number;
};

const KEY_ID = `${databasePrefix}id` as const;
const KEY_NAME = `${databasePrefix}name` as const;
const KEY_START_DATE = `${databasePrefix}startdate` as const;
const KEY_END_DATE = `${databasePrefix}enddate` as const;
const KEY_EFFORT = `${databasePrefix}effort` as const;
const KEY_EFFORT_UNIT = `${databasePrefix}effortunit` as const;
const KEY_DURATION = `${databasePrefix}duration` as const;
const KEY_DURATION_UNIT = `${databasePrefix}durationunit` as const;
const KEY_PERCENT_DONE = `${databasePrefix}percentdone` as const;
const KEY_SCHEDULING_MODE = `${databasePrefix}schedulingmode` as const;
const KEY_NOTE = `${databasePrefix}note` as const;
const KEY_CONSTRAINT_TYPE = `${databasePrefix}constrainttype` as const;
const KEY_CONSTRAINT_DATE = `${databasePrefix}constraintdate` as const;
const KEY_MANUALLY_SCHEDULED = `${databasePrefix}manuallyscheduled` as const;
const KEY_UNSCHEDULED = `${databasePrefix}unscheduled` as const;
const KEY_IGNORE_RESOURCE_CALENDAR =
  `${databasePrefix}ignoreresourcecalendar` as const;
const KEY_EFFORT_DRIVEN = `${databasePrefix}effortdriven` as const;
const KEY_INACTIVE = `${databasePrefix}inactive` as const;
const KEY_CLS = `${databasePrefix}cls` as const;
const KEY_ICON_CLS = `${databasePrefix}iconcls` as const;
const KEY_COLOR = `${databasePrefix}color` as const;
const KEY_PARENT_INDEX = `${databasePrefix}parentindex` as const;
const KEY_EXPANDED = `${databasePrefix}expanded` as const;
const KEY_CALENDAR = `${databasePrefix}calendar` as const;
const KEY_DEADLINE = `${databasePrefix}deadline` as const;
const KEY_DIRECTION = `${databasePrefix}direction` as const;
const KEY_INDEX = `${databasePrefix}index` as const;

export type GanttTaskDataverse = {
  [KEY_ID]: string;
  [KEY_NAME]: string;
  [KEY_START_DATE]: string;
  [KEY_END_DATE]: string;
  [KEY_EFFORT]: number;
  [KEY_EFFORT_UNIT]: string;
  [KEY_DURATION]: number;
  [KEY_DURATION_UNIT]: string;
  [KEY_PERCENT_DONE]: number;
  [KEY_SCHEDULING_MODE]: string;
  [KEY_NOTE]: string;
  [KEY_CONSTRAINT_TYPE]: string;
  [KEY_CONSTRAINT_DATE]: string;
  [KEY_MANUALLY_SCHEDULED]: number;
  [KEY_UNSCHEDULED]: number;
  [KEY_IGNORE_RESOURCE_CALENDAR]: number;
  [KEY_EFFORT_DRIVEN]: number;
  [KEY_INACTIVE]: number;
  [KEY_CLS]: string;
  [KEY_ICON_CLS]: string;
  [KEY_COLOR]: string;
  [KEY_PARENT_INDEX]: number;
  [KEY_EXPANDED]: number;
  [KEY_CALENDAR]: number;
  [KEY_DEADLINE]: string;
  [KEY_DIRECTION]: string;
  [KEY_INDEX]: number;
};

export type GanttDependency = {
  id: string;
  type: number;
  cls: string;
  lag: number;
  lagUnit: string;
  active: number;
  from: string;
  to: string;
  fromSide: string;
  toSide: string;
};

const KEY_TYPE = `${databasePrefix}type` as const;
const KEY_LAG = `${databasePrefix}lag` as const;
const KEY_LAG_UNIT = `${databasePrefix}lagunit` as const;
const KEY_ACTIVE = `${databasePrefix}active` as const;
const KEY_FROM = `${databasePrefix}from@odata.bind` as const;
const KEY_TO = `${databasePrefix}to@odata.bind` as const;
const KEY_FROM_SIDE = `${databasePrefix}fromside` as const;
const KEY_TO_SIDE = `${databasePrefix}toside` as const;

export type GanttDependencyDataverse = {
  [KEY_ID]: string;
  [KEY_TYPE]: number;
  [KEY_CLS]: string;
  [KEY_LAG]: number;
  [KEY_LAG_UNIT]: string;
  [KEY_ACTIVE]: number;
  [KEY_FROM]: string;
  [KEY_TO]: string;
  [KEY_FROM_SIDE]: string;
  [KEY_TO_SIDE]: string;
};
