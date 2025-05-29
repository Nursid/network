import React from 'react';
import { Panel } from '@xyflow/react';

const DebugPanel = ({ debugInfo, nodes, edges, flowData }) => {
  // Get dynamic PON count from flowData (same as NetworkFlow.js)
  const portCount = flowData?.port || 8;
  
  // Create dynamic PON structure
  const createPonStructure = () => {
    const ponStructure = { total: 0 };
    for (let i = 1; i <= portCount; i++) {
      ponStructure[`pon${i}`] = 0;
    }
    return ponStructure;
  };

  // Calculate summary statistics from nodes
  const calculateSummary = () => {
    if (!nodes || nodes.length === 0) {
      return {
        ont: createPonStructure(),
        onu: createPonStructure(),
        router: createPonStructure(),
        ontOnu: createPonStructure(),
        users: createPonStructure(),
        loop: createPonStructure(),
        jcBox: createPonStructure(),
        maxDistance: createPonStructure(),
        lastOP: createPonStructure()
      };
    }

    // Function to find which PON a node belongs to by tracing back through connections
    const findPonForNode = (nodeId) => {
      if (!edges || !nodes) return '';
      
      // Check if node has direct ponId
      const node = nodes.find(n => n.id === nodeId);
      if (node?.data?.ponId) {
        // Extract PON number from ponId (e.g., "pon-1" -> "pon1")
        const ponId = node.data.ponId;
        for (let i = 1; i <= portCount; i++) {
          if (ponId.includes(`${i}`) || ponId.toLowerCase().includes(`pon${i}`) || ponId === `pon-${i}`) {
            return `pon${i}`;
          }
        }
      }
      
      // If no direct ponId, trace back through edges
      const visited = new Set();
      const queue = [nodeId];
      
      while (queue.length > 0) {
        const currentNodeId = queue.shift();
        
        if (visited.has(currentNodeId)) continue;
        visited.add(currentNodeId);
        
        // Find the current node
        const currentNode = nodes.find(n => n.id === currentNodeId);
        if (!currentNode) continue;
        
        // Check if this node is a PON node
        if (currentNode.data?.label?.includes('PON') && !currentNode.data.label.includes('EPON')) {
          // Extract PON number from label
          const match = currentNode.data.label.match(/PON\s*(\d+)/i);
          if (match) {
            return `pon${match[1]}`;
          }
        }
        
        // Check if this node has a ponId
        if (currentNode.data?.ponId) {
          for (let i = 1; i <= portCount; i++) {
            if (currentNode.data.ponId.includes(`${i}`) || 
                currentNode.data.ponId.toLowerCase().includes(`pon${i}`) || 
                currentNode.data.ponId === `pon-${i}`) {
              return `pon${i}`;
            }
          }
        }
        
        // Find parent nodes (nodes that have edges pointing to this node)
        const parentEdges = edges.filter(edge => edge.target === currentNodeId);
        parentEdges.forEach(edge => {
          if (!visited.has(edge.source)) {
            queue.push(edge.source);
          }
        });
      }
      
      return ''; // No PON found
    };

    const summary = {
      ont: createPonStructure(),
      onu: createPonStructure(),
      router: createPonStructure(),
      ontOnu: createPonStructure(),
      users: createPonStructure(),
      loop: createPonStructure(),
      jcBox: createPonStructure(),
      maxDistance: createPonStructure(),
      lastOP: createPonStructure()
    };

    // Count different node types
    nodes.forEach(node => {
      const label = node.data?.label?.toLowerCase() || '';
      
      // Find which PON this node belongs to (either directly or through network tracing)
      const ponKey = findPonForNode(node.id);

      if (label.includes('ont') && !label.includes('onu')) {
        if (ponKey) summary.ont[ponKey]++;
        summary.ont.total++;
      } else if (label.includes('onu') && !label.includes('ont')) {
        if (ponKey) summary.onu[ponKey]++;
        summary.onu.total++;
      } else if (label.includes('router')) {
        if (ponKey) summary.router[ponKey]++;
        summary.router.total++;
      } else if (label.includes('ont') && label.includes('onu')) {
        if (ponKey) summary.ontOnu[ponKey]++;
        summary.ontOnu.total++;
      } else if (label.includes('loop')) {
        if (ponKey) summary.loop[ponKey]++;
        summary.loop.total++;
      } else if (label.includes('jc') || label.includes('box')) {
        if (ponKey) summary.jcBox[ponKey]++;
        summary.jcBox.total++;
      }
    });

    // Calculate Total Users = ONT + Router for each PON (dynamic)
    for (let i = 1; i <= portCount; i++) {
      const ponKey = `pon${i}`;
      summary.users[ponKey] = summary.ont[ponKey] + summary.router[ponKey];
    }
    summary.users.total = summary.ont.total + summary.router.total;

    // Calculate ONT+ONU = ONT + ONU for each PON (dynamic)
    for (let i = 1; i <= portCount; i++) {
      const ponKey = `pon${i}`;
      summary.ontOnu[ponKey] = summary.ont[ponKey] + summary.onu[ponKey];
    }
    summary.ontOnu.total = summary.ont.total + summary.onu.total;

    return summary;
  };

  const summary = calculateSummary();

  // Create dynamic table headers
  const createTableHeaders = () => {
    const headers = [];
    for (let i = 1; i <= portCount; i++) {
      headers.push(
        <div key={`pon${i}`} style={{ flex: '1', padding: '6px', borderRight: '1px solid #fff', textAlign: 'center' }}>
          PON{i}
        </div>
      );
    }
    return headers;
  };

  // Create dynamic table cells for each row
  const createTableCells = (rowData) => {
    const cells = [];
    for (let i = 1; i <= portCount; i++) {
      const ponKey = `pon${i}`;
      cells.push(
        <div key={ponKey} style={{ flex: '1', padding: '6px', borderRight: '1px solid #ddd', textAlign: 'center' }}>
          {rowData[ponKey]}
        </div>
      );
    }
    return cells;
  };

  // Calculate dynamic width based on number of PONs
  const dynamicWidth = Math.max(400, 200 + (portCount * 80));

  return (
    <Panel position="top-left" style={{ 
      background: '#ffffff', 
      padding: '15px', 
      border: '2px solid #333',
      borderRadius: '8px',
      minWidth: `${dynamicWidth}px`,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      marginTop: '80px'
    }}>
      <div style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: '#ffff00', 
          color: '#000', 
          padding: '8px', 
          textAlign: 'center', 
          fontWeight: 'bold',
          marginBottom: '2px'
        }}>
          Summary for ({flowData?.olt_name}) containing ({portCount} PONs)
        </div>
        
        {/* Table Header */}
        <div style={{ display: 'flex', backgroundColor: '#4a90e2', color: 'white', fontWeight: 'bold' }}>
          <div style={{ flex: '2', padding: '6px', borderRight: '1px solid #fff' }}>Component</div>
          {createTableHeaders()}
          <div style={{ flex: '1', padding: '6px', textAlign: 'center' }}>Total</div>
        </div>

        {/* Table Rows */}
        {[
          { label: 'ONT', data: summary.ont, bgColor: '#e8f4fd' },
          { label: 'ONU', data: summary.onu, bgColor: '#ffffff' },
          { label: 'Router', data: summary.router, bgColor: '#e8f4fd' },
          { label: 'ONT+ONU', data: summary.ontOnu, bgColor: '#ffff00' },
          { label: 'T. Users', data: summary.users, bgColor: '#e8f4fd' },
          { label: 'T. Loop', data: summary.loop, bgColor: '#ffffff' },
          { label: 'T. JCBox', data: summary.jcBox, bgColor: '#e8f4fd' }
        ].map((row, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            backgroundColor: row.bgColor,
            borderBottom: '1px solid #ddd'
          }}>
            <div style={{ flex: '2', padding: '6px', borderRight: '1px solid #ddd', fontWeight: '500' }}>
              {row.label}
            </div>
            {createTableCells(row.data)}
            <div style={{ 
              flex: '1', 
              padding: '6px', 
              textAlign: 'center',
              backgroundColor: row.label === 'ONT+ONU' ? '#ffff00' : 'inherit',
              fontWeight: row.label === 'ONT+ONU' ? 'bold' : 'normal'
            }}>
              {row.data.total}
            </div>
          </div>
        ))}

        {/* Debug Info Section */}
        {/* <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          borderTop: '2px solid #333'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Debug Info:</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <div>Nodes (React): {debugInfo.nodeCount || 0}</div>
            <div>Nodes (Store): {debugInfo.storeCount || 0}</div>
            <div>Edges: {debugInfo.edgeCount || 0}</div>
            <div>Last Action: {debugInfo.action || 'None'}</div>
          </div>
        </div> */}
      </div>
    </Panel>
  );
};

export default DebugPanel; 