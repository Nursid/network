import React, { useState, useEffect, useRef } from 'react';
import { Handle } from '@xyflow/react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllCustomersFilterByFlow } from '../../../../../Store/Actions/Dashboard/Customer/CustomerActions';
import { API_URL } from '../../../../../config';

const OnuNode = ({ data }) => {
  const dispatch = useDispatch();
  const { data: customers, isLoading } = useSelector(state => state.GetAllCustomerFilterByFlowReducer)
  const childDeviceSelectRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  
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
    description: data.description || '',
    attachment: data.attachment || ''
  });

  // Separate state for device creation dropdown
  const [childDeviceType, setChildDeviceType] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    dispatch(GetAllCustomersFilterByFlow());
  }, [dispatch]);

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
      description: data.description || '',
      attachment: data.attachment || ''
    });
  }, [data]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const debouncedUpdate = (updatedFields) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (data.onUpdate) {
        data.onUpdate(updatedFields);
      }
    }, 500);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    
    // Handle file upload
    if (name === 'attachment' && e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
      return;
    }
    
    // Handle child device type separately
    if (name === 'childDeviceType') {
      setChildDeviceType(value);
      
      // If a value is selected, create a new device node
      if (value && data.onDeviceSelect) {
        data.onDeviceSelect(null, data.id, value);
      }
      return; // Don't update other fields for device creation
    }
    
    // Handle other fields normally
    const updatedFields = { ...fields, [name]: value };
    setFields(updatedFields);

    debouncedUpdate(updatedFields);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_URL}/api/flow/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status) {
        const newFields = { ...fields, attachment: result.data.url };
        setFields(newFields);
        
        if (data.onUpdate) {
          data.onUpdate(newFields);
        }
      } else {
        alert('Failed to upload image: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploadingImage(false);
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

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Create Device:</div>
      <select
        ref={childDeviceSelectRef}
        name="childDeviceType"
        value={childDeviceType}
        onChange={handleFieldChange}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      >
        <option value="">Select Device to Create</option>
        <option value="router">Router</option>
        <option value="switch-p">Switch-P</option>
        <option value="switch-s">Switch-S</option>
      </select>

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
      <select
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
        disabled={isLoading}
      >
        <option value="">{isLoading ? "Loading customers..." : "Select Customer"}</option>
        {customers?.data?.length > 0 ? (
          customers.data.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.id})
            </option>
          ))
        ) : !isLoading && (
          <option value="" disabled>No customers found</option>
        )}
      </select>

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

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Attachment:</div>
      <input
        type="file"
        name="attachment"
        onChange={handleFieldChange}
        accept="image/*"
        disabled={uploadingImage}
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #27ae60',
          borderRadius: '4px'
        }}
      />
      {uploadingImage && (
        <div style={{fontSize: '11px', color: '#27ae60', marginBottom: '8px'}}>
          Uploading image...
        </div>
      )}
      {fields.attachment && !uploadingImage && (
        <div style={{marginBottom: '8px'}}>
          <img 
            src={`${API_URL}${fields.attachment}`} 
            alt="Attachment" 
            onClick={() => window.open(`${API_URL}${fields.attachment}`, '_blank')}
            style={{
              width: '100%',
              maxHeight: '100px',
              objectFit: 'cover',
              borderRadius: '4px',
              border: '1px solid #27ae60',
              cursor: 'pointer'
            }}
            title="Click to open in new tab"
          />
        </div>
      )}

      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default OnuNode; 