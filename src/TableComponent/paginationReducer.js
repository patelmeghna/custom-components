// src/paginationReducer.js
const initialState = {
  data: [],
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
};

export const actionTypes = {
  SET_DATA: "SET_DATA",
  SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
};

export function paginationReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_DATA:
      return {
        ...state,
        data: action.payload.data,
        totalPages: Math.ceil(action.payload.data.length / state.pageSize),
      };
    case actionTypes.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}

export const setData = (data) => ({
  type: actionTypes.SET_DATA,
  payload: { data },
});

export const setCurrentPage = (page) => ({
  type: actionTypes.SET_CURRENT_PAGE,
  payload: page,
});
