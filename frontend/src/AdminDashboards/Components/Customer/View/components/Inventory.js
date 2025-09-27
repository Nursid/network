import React, { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col } from "reactstrap";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
import InventoryModal from './InventoryModal';

const Inventory = ({ data, onDataUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    if(data && data.inventory_items.length > 0 ){
      console.log("data.inventory_items-",data.inventory_items)
      setInventoryItems(JSON.parse(data.inventory_items));
    }else{
      setInventoryItems([]);
    } 
  }, [data]);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSave = (updatedData) => {
    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  return (
    <Card className="shadow-sm" style={{ border: '1px solid #28a745', borderRadius: '8px' }}>
      <CardBody className="p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 text-center w-100">Inventory Details</h4>
          <BsIcons.BsPencil 
            className="text-warning" 
            style={{ fontSize: '18px', cursor: 'pointer' }} 
            onClick={handleEdit}
            title="Edit inventory details"
          />
        </div>
        {/* Customer Information */}
        <div className="customer-details mb-4">
          <Row className="g-3">
            {inventoryItems.length > 0 && (
              <>
            <Col md={12}>
              <div className="table-responsive">
                <table className="table table-bordered table-striped mb-0">
                  <thead className="table-success">
                    <tr>
                      <th style={{ width: "60%" }}>Title</th>
                      <th style={{ width: "40%" }}>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryItems.map((item, index) => (
                      <>
                      <tr key={index}>
                        <td>
                          {item.item?.label || item.item || 'Unknown Item'}
                        </td>
                        <td>
                          {item.quantity || 0}
                        </td>
                      </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>  
            </Col>
            </>
            )}
            {inventoryItems.length === 0 && (
              <Col md={12} className="text-center">
                <div className="justify-content-between align-items-center">
                  <span className="text-muted">No inventory items selected</span>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </CardBody>
      
      {/* Modal for editing */}
      <InventoryModal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
        data={data}
        onSave={handleSave}
      />
    </Card>
  );
};

export default Inventory; 