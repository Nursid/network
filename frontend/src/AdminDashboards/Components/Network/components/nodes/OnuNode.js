import React, { useState, useEffect } from 'react';
import { Handle } from '@xyflow/react';

const OnuNode = ({ data }) => {
  const [fields, setFields] = useState({
    ponOp: data.ponOp || '',
    outputOp: data.outputOp || '',
    currentOp: data.currentOp || '',
    distance: data.distance || '',
    fms: data.fms || '',
    fmsPort: data.fmsPort || '',
    mac: data.mac || '',
    userId: data.userId || '',
    currentGoogleLocation: data.currentGoogleLocation || '',
    description: data.description || ''
  });

  useEffect(() => {
    setFields({
      ponOp: data.ponOp || '',
      outputOp: data.outputOp || '',
      currentOp: data.currentOp || '',
      distance: data.distance || '',
      fms: data.fms || '',
      fmsPort: data.fmsPort || '',
      mac: data.mac || '',
      userId: data.userId || '',
      currentGoogleLocation: data.currentGoogleLocation || '',
      description: data.description || ''
    });
  }, [data]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));

    if (data.onUpdate) {
      data.onUpdate({ ...fields, [name]: value });
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this ONU node?")) {
      if (data.onDelete) {
        data.onDelete(data.id);
      }
    }
  };

  return (
    <div
      style={{ 
        padding: 12, 
        border: '2px solid #27ae60', 
        borderRadius: 8, 
        width: '220px',
        backgroundColor: '#e8f5e8',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(39, 174, 96, 0.2)'
      }}
    >
      <button
        onClick={handleDeleteClick}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '22px',
          height: '22px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        ✕
      </button>

      <div style={{
        fontSize: '16px', 
        fontWeight: 'bold', 
        marginBottom: '8px',
        color: '#27ae60',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{ marginRight: '8px' }}>📡</span>
        ONU Device
      </div>
      
      <div style={{fontSize: '12px', marginBottom: '10px', color: '#666', fontStyle: 'italic'}}>
        {data.label}
      </div>

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>PON OP:</div>
      <input
        type="text"
        name="ponOp"
        value={fields.ponOp}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Output OP:</div>
      <input
        type="text"
        name="outputOp"
        value={fields.outputOp}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Current OP:</div>
      <input
        type="text"
        name="currentOp"
        value={fields.currentOp}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Distance (m):</div>
      <input
        type="text"
        name="distance"
        value={fields.distance}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>MAC Address:</div>
      <input
        type="text"
        name="mac"
        value={fields.mac}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>FMS:</div>
      <input
        type="text"
        name="fms"
        value={fields.fms}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>FMS PORT:</div>
      <input
        type="text"
        name="fmsPort"
        value={fields.fmsPort}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>User ID:</div>
      <input
        type="text"
        name="userId"
        value={fields.userId}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Google Location:</div>
      <input
        type="text"
        name="currentGoogleLocation"
        value={fields.currentGoogleLocation}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Description:</div>
      <textarea
        name="description"
        value={fields.description}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px', 
          minHeight: '50px',
          border: '1px solid #27ae60',
          borderRadius: '4px',
          resize: 'vertical'
        }}
      />

      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default OnuNode; 