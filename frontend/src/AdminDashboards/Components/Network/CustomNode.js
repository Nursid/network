import React from 'react';
import { Handle } from '@xyflow/react';
import { useState } from 'react';


const CustomNode = ({ data }) => {


  const [fields, setFields] = useState({
    title: data.title || '',
    description: data.description || '',
    address: data.address || '',
    nodeType: data.nodeType || 'Splitter',
    nodeTypeValue: data.nodeTypeValue || '',
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

  const [showFractionOptions, setShowFractionOptions] = useState(fields?.nodeType ||false);

  const [columns, setColumns] = useState([]);

  const handlePrimaryChange = (e) => {
    const { name, value } = e.target;
    if (['Splitter', 'Switch', 'ONU', 'ONT', 'Copper'].includes(value)) {
      setShowFractionOptions(true);
      setFields((prevFields) => ({ ...prevFields, [name]: value }));
    if (data.onUpdate) {
      data.onUpdate({ ...fields, [name]: value });
    }
    } else {
      setShowFractionOptions(false);
    }
  };

  const handleColumnChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index] = value;
    setColumns(newColumns);
  };

  const addColumn = () => {
    setColumns((prevColumns) => [...prevColumns, '']);
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
      <div>
        {columns.map((column, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Field ${index + 1}`}
            value={column}
            onChange={(e) => handleColumnChange(index, e.target.value)}
            style={{ marginBottom: '5px', width: '100%', margin: 0, padding: 0, fontSize: '9px' }}
          />
        ))}
      </div>
      <button onClick={addColumn} style={{ fontSize: '9px', padding: '5px' }}>
        Add Field
      </button>

      <select
        onChange={handlePrimaryChange}
        defaultValue=""
        style={{ marginBottom: '5px', width: '100%', margin: 0, padding: 0, fontSize: '12px' }}
        value={fields?.nodeType}
      >
        <option value="" disabled>
          Select an option
        </option>
        <option value="Splitter" selected>Splitter</option>
        <option value="Switch">Switch</option>
        <option value="ONU">ONU</option>
        <option value="ONT">ONT</option>
        <option value="Copper">Copper</option>
      </select>

      {/* Conditional Secondary Select */}
      {showFractionOptions && (
        <select
          defaultValue=""
          style={{ marginBottom: '5px', width: '100%', margin: 0, padding: 0, fontSize: '12px' }}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="1/2">1/2</option>
          <option value="1/4">1/4</option>
          <option value="1/8">1/8</option>
          <option value="1/16">1/16</option>
        </select>
      )}
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default CustomNode;
