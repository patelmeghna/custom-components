import React, {useReducer} from "react";
import MainComponents from "./MainComponent";

// const initialState = {
//   activeTab: null,
// };

// const tabReducer = (state, action) => {
//   switch (action.type) {
//     case "SET_TAB":
//         console.log(action.payload)
//       return { ...state, activeTab: action.payload };
//       default:
//         return state;
//   }
// };

// const TabComponent = () => {
//   const [state, dispatch] = useReducer(tabReducer, initialState);

//   const handleTabClick = (tab) => {
//     dispatch({ type: "SET_TAB", payload: tab });
//   };



//   console.log('as',state)
//   return (
//    <div>
//     <div>
//       <button onClick={() => handleTabClick("tab1")}>Tab 1</button>
//       <button onClick={() => handleTabClick("tab2")}>Tab 2</button>
//       {state.activeTab === "tab1" && <div>HEllo Tab 1</div>}
//       {state.activeTab === "tab2" && <div>Hello Tab 2</div>}
      
//     </div>
//    </div>
//   );
// }


// export default TabComponent;



const tabsReducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_TAB':
      return {
        ...state,
        activeTab: action.payload,
      };
    default:
      return state;
  }
};

const TabComponent = ({ tabs , onCustomClick }) => {
  const initialState = {
    activeTab: null
  };

  const [state, dispatch] = useReducer(tabsReducer, initialState);

  const handleTabClick = (tabId) => {
    const clickedTab = tabs.find((tab) => tab.id === tabId);
    if (clickedTab && typeof clickedTab.onClick === 'function') {
      clickedTab.onClick();
    }
    dispatch({ type: 'SELECT_TAB', payload: tabId });
    console.log(tabId)


    // if (onCustomClick) {
    //   onCustomClick(tabId);
    // }
  };

  return (
    <div>
      <div className="tab-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${state.activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane ${state.activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabComponent;