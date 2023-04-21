import { CustomTableActionTypes } from "./custom-table.types";

export const setTableValues = (value) => ({
    type: CustomTableActionTypes.GET_TABLE_DATA,
    payload: value,
});