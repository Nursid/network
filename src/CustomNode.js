import React from 'react';
import { Handle } from '@xyflow/react';

const CustomNode = ({ data }) => {
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    const numChildren = selectedValue === '1/2' ? 2 :
                        selectedValue === '1/4' ? 4 :
                        selectedValue === '1/8' ? 8 :
                        selectedValue === '1/16' ? 16 : 0;

    // Call the addNode function with the number of children to add
    // if (numChildren > 0) {
    //   for (let i = 0; i < numChildren; i++) {
        data.onSelect(event, data.id, numChildren); // Call to addNode with the current node's ID
    //   }
    // }
  };

  return (
    <div
      style={{ padding: 10, border: '1px solid black', borderRadius: 5 }}
    >
      <div>{data.label}</div>
      <select onChange={handleChange} defaultValue="">
        <option value="" disabled>Select an option</option>
        <option value="1/2">1/2</option>
        <option value="1/4">1/4</option>
        <option value="1/8">1/8</option>
        <option value="1/16">1/16</option>
      </select>
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default CustomNode;
