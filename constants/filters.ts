export const FILTER_OPTIONS = {
  ALL: "all",
  COMPLETED: "completed",
  UNCOMPLETED: "uncompleted",
} as const;

export type FilterOption = (typeof FILTER_OPTIONS)[keyof typeof FILTER_OPTIONS];
