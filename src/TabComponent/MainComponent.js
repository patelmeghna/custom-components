import React from 'react';
import TabComponent from './CustomTab';

const MainComponents = () => {
  const tabs = [
    {
      id: 'tab1',
      label: 'Ashika',
      content: <p> Hello How Are YOu ?</p>,
      onClick: () => {
        console.log("it is working")
      }
    },
    {
      id: 'tab2',
      label: 'Suthar',
      content: <p> Hello Hello Hello Hello Hello Hello  Hello Hello Hello Hello Hello Hello Hello I Am good </p>,
      onClick: () => {
        console.log("it is working now")
      }
    },

  ];

//   const handleCustomClick = (tabId) => {
//     console.log(`Custom click on tab with ID: ${tabId}`);
//   };

  return (
    <div>
      <h5>Custom Tab Component</h5>
      <TabComponent tabs={tabs} />
    </div>
  );
};

export default MainComponents;