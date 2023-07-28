import React, {useReducer} from "react";

const initialState = {
  activeTab: null,
};

const tabReducer = (state, action) => {
  switch (action.type) {
    case "SET_TAB":
        console.log(action.payload)
      return { ...state, activeTab: action.payload };
      default:
        return state;
  }
};

const TabComponent = () => {
  const [state, dispatch] = useReducer(tabReducer, initialState);

  const handleTabClick = (tab) => {
    dispatch({ type: "SET_TAB", payload: tab });
  };



  console.log('as',state)
  return (
   <div>
    <div>
      <button onClick={() => handleTabClick("tab1")}>Tab 1</button>
      <button onClick={() => handleTabClick("tab2")}>Tab 2</button>
      {state.activeTab === "tab1" && <div>HEllo Tab 1</div>}
      {state.activeTab === "tab2" && <div>Hello Tab 2</div>}
      
    </div>
   </div>
  );
}


export default TabComponent;
