import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import { API_URL } from '../../../../../config';
import axios from 'axios';
import './InventoryModal.css';

const InventoryModal = ({ isOpen, toggle, data, onSave }) => {
  const [formData, setFormData] = useState({
    inventory_items: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    if (data && isOpen) {
      // Parse existing inventory items from customer data
      let existingItems = [];
      try {
        if (data.inventory_items) {
          existingItems = typeof data.inventory_items === 'string' 
            ? JSON.parse(data.inventory_items) 
            : data.inventory_items;
        }
      } catch (error) {
        console.error('Error parsing inventory_items:', error);
        existingItems = [];
      }
      
      setFormData({
        inventory_items: existingItems
      });
      setErrors({});
    }
    fetchInventoryItems();
  }, [data, isOpen]);

  // Update form data when inventory items are loaded to set default selections
  useEffect(() => {
    if (inventoryItems.length > 0 && formData.inventory_items.length > 0) {
      // Update existing items with full item details from inventory list
      const updatedItems = formData.inventory_items.map(existingItem => {
        if (existingItem.item && typeof existingItem.item === 'string') {
          // If item is just a string (item name), find the full item object
          const fullItem = inventoryItems.find(invItem => 
            invItem.label === existingItem.item || invItem.name === existingItem.item
          );
          if (fullItem) {
            return {
              ...existingItem,
              item: fullItem
            };
          }
        }
        return existingItem;
      });
      
      setFormData(prev => ({
        ...prev,
        inventory_items: updatedItems
      }));
    }
  }, [inventoryItems]);

  const fetchInventoryItems = async () => {
    try {
      // Fetch available inventory items from API
      const response = await axios.get(`${API_URL}/inventry/getall`);
      const items = response.data || [];
      
      // Transform the API response to match our expected format
      const transformedItems = items.map(item => ({
        id: item.id,
        label: item.item, // Use 'item' field as label
        qty: parseInt(item.qty) || 0,
        name: item.item,
        type: 'Hardware' // Default type since API doesn't provide it
      }));
      
      setInventoryItems(transformedItems);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      // Fallback to sample data if API fails
    }
  };

  const handleInventoryItemAdd = () => {
    setFormData(prev => ({
      ...prev,
      inventory_items: [...prev.inventory_items, { item: null, quantity: 1 }]
    }));
  };

  const handleInventoryItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      inventory_items: prev.inventory_items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));

    // Clear errors when user makes changes
    if (errors[`item_${index}`]) {
      setErrors(prev => ({
        ...prev,
        [`item_${index}`]: ''
      }));
    }
  };

  const handleInventoryItemRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      inventory_items: prev.inventory_items.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    formData.inventory_items.forEach((item, index) => {
      if (!item.item) {
        newErrors[`item_${index}`] = 'Please select an item';
      }
      if (!item.quantity || item.quantity < 1) {
        newErrors[`quantity_${index}`] = 'Quantity must be at least 1';
      }
      if (item.item && item.quantity > item.item.qty) {
        newErrors[`quantity_${index}`] = `Quantity cannot exceed available stock (${item.item.qty})`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        inventory_items: JSON.stringify(formData.inventory_items),
        customer_id: data.customer_id
      };

      // Here you would make the API call to update the inventory
      // const response = await axios.put(`${API_URL}/customer/update-inventory/${data.customer_id}`, updateData);
      
      // Call the onSave callback with updated data
      onSave(updateData);
      
      // Close modal after successful save
      toggle();
      
    } catch (error) {
      console.error('Error updating inventory:', error);
      // Handle error - you might want to show a toast notification
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (data) {
      let existingItems = [];
      try {
        if (data.inventory_items) {
          existingItems = typeof data.inventory_items === 'string' 
            ? JSON.parse(data.inventory_items) 
            : data.inventory_items;
        }
      } catch (error) {
        console.error('Error parsing inventory_items:', error);
        existingItems = [];
      }
      setFormData({
        inventory_items: existingItems
      });
    }
    setErrors({});
    toggle();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      toggle={handleCancel} 
      size="xl" 
      centered
      className="inventory-modal"
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader toggle={handleCancel} className="bg-primary text-white">
        <div className="d-flex align-items-center">
          <BsIcons.BsBox className="me-2" />
          Edit Inventory Details
        </div>
      </ModalHeader>
      
      <ModalBody className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <h5 className="mb-3">Inventory Items</h5>
              <p className="text-muted mb-4">Assign required hardware or inventory items (e.g., router, modem).</p>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Button 
                  color="success" 
                  size="sm" 
                  onClick={handleInventoryItemAdd}
                  type="button"
                >
                  <FaIcons.FaPlus className="me-2" /> Add Item
                </Button>
                <span className="text-muted">
                  Total Items: {formData.inventory_items.length}
                </span>
              </div>
            </Col>
          </Row>

          {formData.inventory_items.map((item, index) => (
            <Row key={index} className="mb-3 p-3 border rounded inventory-item-row">
              <Col md={5}>
                <FormGroup>
                  <Label className="fw-semibold">Item</Label>
                  <Input
                    type="select"
                    value={item.item ? item.item.id : ''}
                    onChange={(e) => {
                      const selectedItem = inventoryItems.find(i => i.id === parseInt(e.target.value));
                      handleInventoryItemChange(index, 'item', selectedItem);
                    }}
                    invalid={!!errors[`item_${index}`]}
                  >
                    <option value="">Select an item</option>
                    {inventoryItems.map(invItem => (
                      <option key={invItem.id} value={invItem.id}>
                        {invItem.label} - Available: {invItem.qty}
                      </option>
                    ))}
                  </Input>
                  {errors[`item_${index}`] && (
                    <div className="invalid-feedback d-block">{errors[`item_${index}`]}</div>
                  )}
                </FormGroup>
              </Col>
              
              <Col md={3}>
                <FormGroup>
                  <Label className="fw-semibold">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    max={item.item ? item.item.qty : ''}
                    value={item.quantity}
                    onChange={(e) => handleInventoryItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    invalid={!!errors[`quantity_${index}`]}
                  />
                  {errors[`quantity_${index}`] && (
                    <div className="invalid-feedback d-block">{errors[`quantity_${index}`]}</div>
                  )}
                </FormGroup>
              </Col>
              
              <Col md={3}>
                <FormGroup>
                  <Label className="fw-semibold">Available</Label>
                  <Input
                    type="text"
                    value={item.item ? item.item.qty : ''}
                    disabled
                    className="bg-light"
                  />
                </FormGroup>
              </Col>
              
              <Col md={1}>
                <FormGroup>
                  <Label>&nbsp;</Label>
                  <Button 
                    color="danger" 
                    size="sm" 
                    onClick={() => handleInventoryItemRemove(index)}
                    className="d-block w-100"
                    type="button"
                  >
                    <FaIcons.FaTrash />
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          ))}

          {formData.inventory_items.length === 0 && (
            <Row>
              <Col md={12}>
                <div className="text-center p-4 border rounded bg-light">
                  <BsIcons.BsBox className="text-muted mb-2" style={{ fontSize: '2rem' }} />
                  <p className="mb-0 text-muted">No inventory items selected. Click "Add Item" to add items.</p>
                </div>
              </Col>
            </Row>
          )}

          {/* Summary Section */}
          {formData.inventory_items.length > 0 && (
            <Row className="mt-4">
              <Col md={12}>
                <div className="bg-light p-3 rounded">
                  <h6 className="mb-3">Inventory Summary</h6>
                  <Row>
                    {formData.inventory_items.map((item, index) => (
                      <Col md={6} key={index} className="mb-2">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">
                            {item.item ? item.item.label || item.item.name : 'No item selected'}
                          </span>
                          <span className="fw-semibold">
                            {item.quantity}x
                          </span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </ModalBody>
      
      <ModalFooter className="bg-light">
        <Button
          color="secondary"
          onClick={handleCancel}
          disabled={loading}
          className="me-2"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            <>
              <BsIcons.BsCheckLg className="me-2" />
              Save Changes
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default InventoryModal;
