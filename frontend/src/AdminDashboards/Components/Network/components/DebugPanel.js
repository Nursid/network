import React from 'react';
import { Panel } from '@xyflow/react';

const DebugPanel = ({ debugInfo, nodes, edges }) => {
  // Calculate summary statistics from nodes
  const calculateSummary = () => {
    if (!nodes || nodes.length === 0) {
      return {
        ont: { splitter1: 0, splitter2: 0, total: 0 },
        onu: { splitter1: 0, splitter2: 0, total: 0 },
        router: { splitter1: 0, splitter2: 0, total: 0 },
        ontOnu: { splitter1: 0, splitter2: 0, total: 0 },
        users: { splitter1: 0, splitter2: 0, total: 0 },
        loop: { splitter1: 0, splitter2: 0, total: 0 },
        jcBox: { splitter1: 0, splitter2: 0, total: 0 },
        maxDistance: { splitter1: 0, splitter2: 0, total: 0 },
        lastOP: { splitter1: 0, splitter2: 0, total: 0 }
      };
    }

    const summary = {
      ont: { splitter1: 0, splitter2: 0, total: 0 },
      onu: { splitter1: 0, splitter2: 0, total: 0 },
      router: { splitter1: 0, splitter2: 0, total: 0 },
      ontOnu: { splitter1: 0, splitter2: 0, total: 0 },
      users: { splitter1: 0, splitter2: 0, total: 0 },
      loop: { splitter1: 0, splitter2: 0, total: 0 },
      jcBox: { splitter1: 0, splitter2: 0, total: 0 },
      maxDistance: { splitter1: 0, splitter2: 0, total: 0 }, // Example values
      lastOP: { splitter1: 0, splitter2: 0, total: 0 } // Example values
    };

    // Count different node types
    nodes.forEach(node => {
      const label = node.data?.label?.toLowerCase() || '';
      const ponId = node.data?.ponId || '';
      
      // Determine which splitter this node belongs to (simplified logic)
      const isSplitter1 = ponId.includes('1') || ponId.includes('3') || ponId.includes('5') || ponId.includes('7');
      const isSplitter2 = !isSplitter1 && ponId !== '';

      if (label.includes('ont') && !label.includes('onu')) {
        if (isSplitter1) summary.ont.splitter1++;
        else if (isSplitter2) summary.ont.splitter2++;
        summary.ont.total++;
      } else if (label.includes('onu') && !label.includes('ont')) {
        if (isSplitter1) summary.onu.splitter1++;
        else if (isSplitter2) summary.onu.splitter2++;
        summary.onu.total++;
      } else if (label.includes('router')) {
        if (isSplitter1) summary.router.splitter1++;
        else if (isSplitter2) summary.router.splitter2++;
        summary.router.total++;
      } else if (label.includes('ont') && label.includes('onu')) {
        if (isSplitter1) summary.ontOnu.splitter1++;
        else if (isSplitter2) summary.ontOnu.splitter2++;
        summary.ontOnu.total++;
      } else if (label.includes('user')) {
        if (isSplitter1) summary.users.splitter1++;
        else if (isSplitter2) summary.users.splitter2++;
        summary.users.total++;
      } else if (label.includes('loop')) {
        if (isSplitter1) summary.loop.splitter1++;
        else if (isSplitter2) summary.loop.splitter2++;
        summary.loop.total++;
      } else if (label.includes('jc') || label.includes('box')) {
        if (isSplitter1) summary.jcBox.splitter1++;
        else if (isSplitter2) summary.jcBox.splitter2++;
        summary.jcBox.total++;
      }
    });

    return summary;
  };

  const summary = calculateSummary();

  return (
    <Panel position="top-left" style={{ 
      background: '#ffffff', 
      padding: '15px', 
      border: '2px solid #333',
      borderRadius: '8px',
      minWidth: '300px',
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
          Report PON 1
        </div>
        
        {/* Table Header */}
        <div style={{ display: 'flex', backgroundColor: '#4a90e2', color: 'white', fontWeight: 'bold' }}>
          <div style={{ flex: '2', padding: '6px', borderRight: '1px solid #fff' }}>Component</div>
          <div style={{ flex: '1', padding: '6px', borderRight: '1px solid #fff', textAlign: 'center' }}>[A]</div>
          <div style={{ flex: '1', padding: '6px', borderRight: '1px solid #fff', textAlign: 'center' }}>[B]</div>
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
          { label: 'T. JCBox', data: summary.jcBox, bgColor: '#e8f4fd' },
          { label: 'Max. Distance', data: summary.maxDistance, bgColor: '#ffffff' },
          { label: 'Last OP', data: summary.lastOP, bgColor: '#e8f4fd' }
        ].map((row, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            backgroundColor: row.bgColor,
            borderBottom: '1px solid #ddd'
          }}>
            <div style={{ flex: '2', padding: '6px', borderRight: '1px solid #ddd', fontWeight: '500' }}>
              {row.label}
            </div>
            <div style={{ flex: '1', padding: '6px', borderRight: '1px solid #ddd', textAlign: 'center' }}>
              {row.data.splitter1}
            </div>
            <div style={{ flex: '1', padding: '6px', borderRight: '1px solid #ddd', textAlign: 'center' }}>
              {row.data.splitter2}
            </div>
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