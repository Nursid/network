import React from 'react';
import { Handle } from '@xyflow/react';
import { useState } from 'react';
const CustomNode = ({ data }) => {


  const [fields, setFields] = useState({
    title: data.title || '',
    description: data.description || '',
    address: data.address || '',
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));

    if (data.onUpdate) {
      data.onUpdate({ ...fields, [name]: value });
    }
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    const numChildren = selectedValue === '1/2' ? 2 :
                        selectedValue === '1/4' ? 4 :
                        selectedValue === '1/8' ? 8 :
                        selectedValue === '1/16' ? 16 : 0;
        data.onSelect(event, data.id, numChildren);
  };

  

  return (
    <div
      style={{ padding: 10, border: '1px solid black', borderRadius: 5, width: '200px' }}
    >
      <div style={{fontSize: '10px'}}>{data.label}</div>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={fields.title}
        onChange={handleFieldChange}
        style={{ marginBottom: '5px', width: '100%', margin: 0, padding: 0, fontSize: '9px' }}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={fields.description}
        onChange={handleFieldChange}
        style={{ marginBottom: '5px', width: '100%', margin: 0, padding: 0, fontSize: '9px' }}
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={fields.address}
        onChange={handleFieldChange}
        style={{ marginBottom: '5px', width: '100%', margin: 0, padding: 0, fontSize: '9px' }}
      />

      <select onChange={handleChange} defaultValue=""  style={{ marginBottom: '5px', width: '100%', margin: 0, padding: 0, fontSize: '9px' }}>
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
