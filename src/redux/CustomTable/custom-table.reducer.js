import { CustomTableActionTypes } from './custom-table.types';

const INITIAL_STATE = {
    getTableValues:[]
}

const CustomTable = (state = INITIAL_STATE, action) => {
      switch (action.type) {
            case CustomTableActionTypes.GET_TABLE_DATA:
                  return {
                        ...state,
                        getTableValues: action.payload,
                  }
            default:
                  return state;
      }
}

export default CustomTable;