import React, { useState, useEffect } from 'react';
import { Handle } from '@xyflow/react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllCustomersFilterByFlow } from '../../../../../Store/Actions/Dashboard/Customer/CustomerActions';

const SwitchPNode = ({ data }) => {
  const dispatch = useDispatch();
  const { data: customers, isLoading } = useSelector(state => state.GetAllCustomerFilterByFlowReducer)

  const [fields, setFields] = useState({
    ports: data.ports || '',
    vlanConfig: data.vlanConfig || '',
    mac: data.mac || '',
    userId: data.userId || '',
    ipAddress: data.ipAddress || '',
    subnetMask: data.subnetMask || '',
    gateway: data.gateway || '',
    managementInterface: data.managementInterface || '',
    currentGoogleLocation: data.currentGoogleLocation || '',
    description: data.description || ''
  });

  useEffect(() => {
    dispatch(GetAllCustomersFilterByFlow());
  }, [dispatch]);

  useEffect(() => {
    setFields({
      ports: data.ports || '',
      vlanConfig: data.vlanConfig || '',
      mac: data.mac || '',
      userId: data.userId || '',
      ipAddress: data.ipAddress || '',
      subnetMask: data.subnetMask || '',
      gateway: data.gateway || '',
      managementInterface: data.managementInterface || '',
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
    
    if (window.confirm("Are you sure you want to delete this Switch-P node?")) {
      if (data.onDelete) {
        data.onDelete(data.id);
      }
    }
  };

  return (
    <div
      style={{ 
        padding: 12, 
        border: '2px solid #9b59b6', 
        borderRadius: 8, 
        width: '250px',
        backgroundColor: '#f4f1f8',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(155, 89, 182, 0.2)'
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
        color: '#9b59b6',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{ marginRight: '8px' }}>🔀</span>
        Switch-P Device
      </div>
      
      <div style={{fontSize: '12px', marginBottom: '10px', color: '#666', fontStyle: 'italic'}}>
        {data.label}
      </div>

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Ports:</div>
      <input
        type="text"
        name="ports"
        value={fields.ports}
        onChange={handleFieldChange}
        placeholder="e.g., 24, 48"
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #9b59b6',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>VLAN Config:</div>
      <input
        type="text"
        name="vlanConfig"
        value={fields.vlanConfig}
        onChange={handleFieldChange}
        placeholder="VLAN configuration"
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #9b59b6',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>MAC Address:</div>
      <input
        type="text"
        name="mac"
        value={fields.mac}
        onChange={handleFieldChange}
        placeholder="XX:XX:XX:XX:XX:XX"
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #9b59b6',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>IP Address:</div>
      <input
        type="text"
        name="ipAddress"
        value={fields.ipAddress}
        onChange={handleFieldChange}
        placeholder="192.168.1.1"
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #9b59b6',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Subnet Mask:</div>
      <input
        type="text"
        name="subnetMask"
        value={fields.subnetMask}
        onChange={handleFieldChange}
        placeholder="255.255.255.0"
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #9b59b6',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Gateway:</div>
      <input
        type="text"
        name="gateway"
        value={fields.gateway}
        onChange={handleFieldChange}
        placeholder="192.168.1.1"
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #9b59b6',
          borderRadius: '4px'
        }}
      />

      <div style={{fontSize: '12px', marginBottom: '3px', fontWeight: '500'}}>Management Interface:</div>
      <input
        type="text"
        name="managementInterface"
        value={fields.managementInterface}
        onChange={handleFieldChange}
        placeholder="Web UI, SSH, SNMP"
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #9b59b6',
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
          border: '1px solid #9b59b6',
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
        placeholder="Enter Google Maps location"
        style={{ 
          marginBottom: '8px', 
          width: '100%', 
          padding: '4px', 
          fontSize: '11px',
          border: '1px solid #9b59b6',
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
          border: '1px solid #9b59b6',
          borderRadius: '4px',
          resize: 'vertical'
        }}
      />

      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default SwitchPNode; 