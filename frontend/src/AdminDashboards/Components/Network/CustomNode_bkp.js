import React from 'react';
import { Handle } from '@xyflow/react';
import { useState, useEffect } from 'react';

const CustomNode = ({ data, id }) => {
  const [fields, setFields] = useState({
    ponOp: data.ponOp || '',
    splitterType: data.splitterType || 'Splitter',
    splitterValue: data.splitterValue || '',
    outputOp: data.outputOp || '',
    currentOp: data.currentOp || '',
    distance: data.distance || '',
    fms: data.fms || '',
    fmsPort: data.fmsPort || '',
    deviceType: data.deviceType || '',
    mac: data.mac || '',
    description: data.description || '',
  });

  const [showSplitterOptions, setShowSplitterOptions] = useState(false);
  const [showDeviceOptions, setShowDeviceOptions] = useState(false);

  // Update state when data changes from parent
  useEffect(() => {
    setFields({
      ponOp: data.ponOp || '',
      splitterType: data.splitterType || 'Splitter',
      splitterValue: data.splitterValue || '',
      outputOp: data.outputOp || '',
      currentOp: data.currentOp || '',
      distance: data.distance || '',
      fms: data.fms || '',
      fmsPort: data.fmsPort || '',
      deviceType: data.deviceType || '',
      mac: data.mac || '',
      description: data.description || '',
    });
  }, [data]);

  // Control visibility of options based on splitter type
  useEffect(() => {
    if (fields.splitterType === 'Splitter') {
      setShowSplitterOptions(true);
      setShowDeviceOptions(false);
    } else if (fields.splitterType === 'Device') {
      setShowSplitterOptions(false);
      setShowDeviceOptions(true);
    }
  }, [fields.splitterType]);

  // Generic field change handler
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));

    // Notify parent of changes
    if (data.onUpdate) {
      data.onUpdate(id, { ...fields, [name]: value });
    }
  };

  // Handle splitter type change
  const handleSplitterTypeChange = (e) => {
    const { value } = e.target;
    setFields((prevFields) => ({ ...prevFields, splitterType: value }));
    
    // Notify parent of changes
    if (data.onUpdate) {
      data.onUpdate(id, { ...fields, splitterType: value });
    }
  };

  // Handle splitter value change
  const handleSplitterValueChange = (e) => {
    const selectedValue = e.target.value;
    setFields((prevFields) => ({ ...prevFields, splitterValue: selectedValue }));
    
    // Notify parent of changes
    if (data.onUpdate) {
      data.onUpdate(id, { ...fields, splitterValue: selectedValue });
    }
  };

  // Handle device type change
  const handleDeviceTypeChange = (e) => {
    const { value } = e.target;
    setFields((prevFields) => ({ ...prevFields, deviceType: value }));

    // Notify parent of changes
    if (data.onUpdate) {
      data.onUpdate(id, { ...fields, deviceType: value });
    }
  };

  // Get node color based on type
  const getNodeColor = () => {
    if (data.nodeType === 'EPON') return '#3498db';
    if (data.nodeType === 'PON') return data.ponNumber % 2 === 0 ? '#e74c3c' : '#f1c40f';
    if (data.nodeType === 'OLT') return '#2ecc71';
    if (fields.deviceType === 'ONT') return '#e74c3c';
    if (fields.deviceType === 'ONU') return '#f39c12';
    return '#95a5a6';
  };

  // Handle the PON node click
  const handlePonClick = () => {
    console.log("PON node clicked, nodeType:", data.nodeType, "onSelect:", !!data.onSelect);
    if (data.nodeType === 'PON' && data.onSelect) {
      data.onSelect();
    }
  };

  // Handle node deletion
  const handleDeleteNode = (e) => {
    e.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  // Simple nodes for EPON and PON
  if (data.nodeType === 'EPON' || data.nodeType === 'PON') {
    return (
      <div
        style={{ 
          padding: 10, 
          border: '1px solid black', 
          borderRadius: 5, 
          width: '120px',
          backgroundColor: getNodeColor(),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          cursor: data.nodeType === 'PON' ? 'pointer' : 'default'
        }}
        onClick={handlePonClick}
      >
        <div style={{fontSize: '14px'}}>{data.label}</div>
        {data.nodeType === 'EPON' ? (
          <Handle type="source" position="bottom" />
        ) : (
          <>
            <Handle type="target" position="top" />
            <Handle type="source" position="bottom" />
          </>
        )}
      </div>
    );
  }

  // Full node with input fields for OLT and other nodes
  return (
    <div
      style={{ 
        padding: 10, 
        border: '1px solid black', 
        borderRadius: 5, 
        width: '220px',
        backgroundColor: getNodeColor(),
        position: 'relative'
      }}
    >
      <div style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '10px'}}>
        {data.label}
        {(data.nodeType === 'OLT' || data.nodeType === 'Step') && (
          <span 
            onClick={handleDeleteNode} 
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              cursor: 'pointer',
              color: 'red',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ✕
          </span>
        )}
      </div>

      {/* Input fields */}
      <div style={{ fontSize: '10px', marginBottom: '3px' }}>PON OP:</div>
      <input
        type="text"
        name="ponOp"
        placeholder="PON OP"
        value={fields.ponOp}
        onChange={handleFieldChange}
        style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px' }}
      />

      {/* Splitter Type Selection */}
      <div style={{ fontSize: '10px', marginBottom: '3px' }}>Splitter/Device:</div>
      <select
        name="splitterType"
        onChange={handleSplitterTypeChange}
        value={fields.splitterType}
        style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px' }}
      >
        <option value="Splitter">Splitter</option>
        <option value="Device">Device</option>
      </select>

      {/* Conditional Splitter Options */}
      {showSplitterOptions && (
        <>
          <div style={{ fontSize: '10px', marginBottom: '3px' }}>Splitter Value:</div>
          <select
            name="splitterValue"
            value={fields.splitterValue}
            onChange={handleSplitterValueChange}
            style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px' }}
          >
            <option value="" disabled>Select a ratio</option>
            <option value="1/2">1/2</option>
            <option value="1/4">1/4</option>
            <option value="1/8">1/8</option>
            <option value="1/16">1/16</option>
          </select>
        </>
      )}

      {/* Conditional Device Options */}
      {showDeviceOptions && (
        <>
          <div style={{ fontSize: '10px', marginBottom: '3px' }}>Device Type:</div>
          <select
            name="deviceType"
            value={fields.deviceType}
            onChange={handleDeviceTypeChange}
            style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px' }}
          >
            <option value="" disabled>Select a device</option>
            <option value="ONT">ONT</option>
            <option value="ONU">ONU</option>
          </select>
          
          <div style={{ fontSize: '10px', marginBottom: '3px' }}>MAC:</div>
          <input
            type="text"
            name="mac"
            placeholder="MAC Address"
            value={fields.mac}
            onChange={handleFieldChange}
            style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px' }}
          />
        </>
      )}

      <div style={{ fontSize: '10px', marginBottom: '3px' }}>Output OP:</div>
      <input
        type="text"
        name="outputOp"
        placeholder="Output OP"
        value={fields.outputOp}
        onChange={handleFieldChange}
        style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px' }}
      />

      <div style={{ fontSize: '10px', marginBottom: '3px' }}>Current OP:</div>
      <input
        type="text"
        name="currentOp"
        placeholder="Current OP"
        value={fields.currentOp}
        onChange={handleFieldChange}
        style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px' }}
      />

      <div style={{ fontSize: '10px', marginBottom: '3px' }}>Distance (meters):</div>
      <input
        type="text"
        name="distance"
        placeholder="Distance"
        value={fields.distance}
        onChange={handleFieldChange}
        style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px' }}
      />

      <div style={{ fontSize: '10px', marginBottom: '3px' }}>FMS:</div>
      <input
        type="text"
        name="fms"
        placeholder="FMS"
        value={fields.fms}
        onChange={handleFieldChange}
        style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px' }}
      />

      <div style={{ fontSize: '10px', marginBottom: '3px' }}>FMS Port:</div>
      <input
        type="text"
        name="fmsPort"
        placeholder="FMS Port"
        value={fields.fmsPort}
        onChange={handleFieldChange}
        style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px' }}
      />

      <div style={{ fontSize: '10px', marginBottom: '3px' }}>Description:</div>
      <textarea
        name="description"
        placeholder="Description"
        value={fields.description}
        onChange={handleFieldChange}
        style={{ marginBottom: '5px', width: '100%', padding: '2px', fontSize: '9px', minHeight: '40px' }}
      />

      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default CustomNode;
