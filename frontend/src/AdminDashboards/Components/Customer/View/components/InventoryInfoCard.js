import React from 'react';
import { Card, CardBody, CardHeader, Badge } from "reactstrap";
import * as MdIcons from "react-icons/md";

const InventoryInfoCard = ({ data }) => {
  // Helper function to parse and display inventory items
  const displayInventoryItems = (items) => {
    if (!items) return <span className="text-muted">No items selected</span>;
    
    try {
      const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
      if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
        return <span className="text-muted">No items selected</span>;
      }
      
      return (
        <div className="inventory-items">
          {parsedItems.map((item, index) => (
            <div key={index} className="inventory-item mb-2">
              <Badge color="info" className="inventory-badge">
                {item.item?.label || item.item || 'Unknown Item'} 
                <span className="ms-1 fw-bold">×{item.quantity || 1}</span>
              </Badge>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return <span className="text-danger">Invalid inventory data</span>;
    }
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <CardHeader className="bg-light border-0 py-3">
        <div className="d-flex align-items-center">
          <MdIcons.MdInventory className="text-info me-2" size={20} />
          <h6 className="mb-0 fw-semibold">Inventory Items</h6>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <div className="inventory-field">
          <div className="inventory-label mb-2">Selected Items</div>
          <div className="inventory-value">
            {displayInventoryItems(data?.selectedItems)}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default InventoryInfoCard; 