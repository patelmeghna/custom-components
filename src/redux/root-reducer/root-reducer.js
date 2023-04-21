import { combineReducers } from 'redux';
import CustomTable from '../CustomTable/custom-table.reducer';

const rootReducer = combineReducers({
      CustomTable: CustomTable,
})

export default rootReducer;