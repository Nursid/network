import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import CustomNode from './CustomNode';
import { Button, Input } from 'reactstrap';
import '@xyflow/react/dist/style.css';
 
// Initialize a new dagre graph for each layout calculation
const createNewDagreGraph = () => {
  return new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
};

const nodeWidth = 220;
const nodeHeight = 250;

// Helper function to generate node ID
const generateNodeId = (prefix, ponId, stepNumber, subStep = null) => {
  if (subStep !== null) {
    return `${prefix}-${ponId}-s${stepNumber}-${subStep}`;
  }
  return `${prefix}-${ponId}-s${stepNumber}`;
};

// Helper function to generate node label
const generateNodeLabel = (prefix, ponId, stepNumber, subStep = null) => {
  if (subStep !== null) {
    return `Step-${stepNumber}(${String.fromCharCode(97 + subStep)}) - OLT-99 PON ${ponId}`;
  }
  return `Step ${stepNumber} - OLT-99 PON ${ponId}`;
};
 
const Flow = () => {
  console.log("Flow component rendered");
  
  // Use refs to track the latest state without triggering re-renders
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const handleStepNodeSelectRef = useRef(null);
  const handleDeleteNodeRef = useRef(null);

  const nodeTypes = useMemo(() => ({ CustomNode: CustomNode }), []);
  
  // Initialize with EPON and 8 PON ports
  const createInitialNodes = () => {
    console.log("Creating initial nodes");
    
    const eponNode = {
      id: 'epon-1',
      data: { 
        label: 'EPON', 
        nodeType: 'EPON',
      },
    type: 'CustomNode',
    style: { 
        backgroundColor: '#3498db',
        border: '1px solid #2980b9',
        borderRadius: '10px'
      },
      position: { x: 0, y: 0 }
    };
    
    const ponNodes = [];
    const edges = [];
    
    // Create 8 PON nodes
    for (let i = 1; i <= 8; i++) {
      const ponId = i;
      const ponNode = {
        id: `pon-${ponId}`,
        data: { 
          label: `PON${ponId}`, 
          ponNumber: ponId,
          nodeType: 'PON',
          ponId: ponId,
        },
        type: 'CustomNode',
        style: { 
          backgroundColor: i % 2 === 0 ? '#e74c3c' : '#f1c40f',
          border: '1px solid #333',
          borderRadius: '10px'
        },
        position: { x: (i - 4) * 120, y: 100 }
      };
      
      ponNodes.push(ponNode);
      
      // Connect EPON to each PON
      const edge = {
        id: `e-epon-pon${ponId}`,
        source: 'epon-1',
        target: `pon-${ponId}`,
        animated: true,
        type: ConnectionLineType.SmoothStep
      };
      
      edges.push(edge);
    }
    
    const result = { nodes: [eponNode, ...ponNodes], edges };
    console.log("Initial nodes created:", result.nodes.length, "nodes and", result.edges.length, "edges");
    return result;
  };

  // Initialize React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchId, setSearchId] = useState('');
  
  // Initialize the nodes on mount
  useEffect(() => {
    const initialData = createInitialNodes();
    setNodes(initialData.nodes);
    setEdges(initialData.edges);
    
    // Update refs
    nodesRef.current = initialData.nodes;
    edgesRef.current = initialData.edges;
  }, []);
  
  // Update refs when state changes
  useEffect(() => {
    nodesRef.current = nodes;
    console.log("Nodes updated, count:", nodes.length);
  }, [nodes]);
  
  useEffect(() => {
    edgesRef.current = edges;
    console.log("Edges updated, count:", edges.length);
  }, [edges]);

  // Handle onConnect event
  const onConnect = useCallback(
    (params) => {
      console.log("onConnect called with params:", params);
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      );
    },
    [],
  );

  // Layout helper function
  const getLayoutedElements = useCallback((nodeList, edgeList) => {
    console.log("Running layout with", nodeList.length, "nodes");
    
    // Group nodes by PON ID
    const nodesByPonId = {};
    nodeList.forEach(node => {
      const ponId = node.data?.ponId || 'default';
      if (!nodesByPonId[ponId]) {
        nodesByPonId[ponId] = [];
      }
      nodesByPonId[ponId].push(node);
    });
    
    // Position nodes by group
    const positionedNodes = [...nodeList]; // Start with a copy of all nodes
    
    // First position the EPON node at the top
    const eponNode = positionedNodes.find(n => n.id === 'epon-1');
    if (eponNode) {
      eponNode.position = { x: 0, y: 0 };
    }
    
    // Then position each PON group
    Object.keys(nodesByPonId)
      .filter(ponId => ponId !== 'default')
      .forEach((ponId) => {
        const ponNodes = nodesByPonId[ponId];
        const ponNode = ponNodes.find(n => n.id === `pon-${ponId}`);
        
        if (ponNode) {
          // Position PON node
          const baseX = (parseInt(ponId) - 4.5) * 250;
          ponNode.position = { x: baseX, y: 100 };
          
          // Position OLT node if it exists
          const oltNode = ponNodes.find(n => n.id === `olt-${ponId}-s1`);
          if (oltNode) {
            oltNode.position = { x: baseX, y: 250 };
            
            // Position child nodes
            const childNodes = ponNodes.filter(n => 
              n.id !== ponNode.id && 
              n.id !== oltNode.id
            );
            
            // Arrange children in a grid
            const cols = Math.min(4, Math.ceil(Math.sqrt(childNodes.length)));
            childNodes.forEach((childNode, i) => {
              const row = Math.floor(i / cols);
              const col = i % cols;
              childNode.position = {
                x: baseX + (col - Math.floor(cols/2)) * 120,
                y: 400 + row * 150
              };
            });
          }
        }
      });
    
    // Set connection points
    return {
      nodes: positionedNodes.map(node => ({
        ...node,
        targetPosition: 'top',
        sourcePosition: 'bottom'
      })),
      edges: edgeList
    };
  }, []);

  // Apply layout
  const applyLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodesRef.current,
      edgesRef.current
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [getLayoutedElements]);
  
  // Run layout on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nodes.length > 0) {
        applyLayout();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [applyLayout]);

  // Handle PON selection
  const handlePonSelect = useCallback((ponId) => {
    console.log("PON selected:", ponId);
    
    // Check if OLT node already exists
    const oltNodeId = `olt-${ponId}-s1`;
    if (nodesRef.current.some(node => node.id === oltNodeId)) {
      console.log("OLT node already exists for PON", ponId);
      return;
    }
    
    // Create OLT node
    const oltNode = {
      id: oltNodeId,
      data: { 
        label: `Step 1 - OLT-99 PON ${ponId}`,
        nodeType: 'OLT',
        ponId: ponId,
        ponOp: '',
        splitterType: 'Splitter',
        splitterValue: '',
        outputOp: '',
        currentOp: '',
        distance: '',
        fms: '',
        fmsPort: '',
        description: '',
                 },
                type: 'CustomNode',
      style: { 
        backgroundColor: '#2ecc71',
        border: '1px solid #27ae60',
        borderRadius: '10px'
      },
      position: { x: 0, y: 200 }
    };
    
    // Create edge from PON to OLT
            const newEdge = {
      id: `e-pon${ponId}-${oltNodeId}`,
      source: `pon-${ponId}`,
      target: oltNodeId,
                animated: true,
      type: ConnectionLineType.SmoothStep
    };
    
    // Update state and refs
    const updatedNodes = [...nodesRef.current, oltNode];
    const updatedEdges = [...edgesRef.current, newEdge];
    
    nodesRef.current = updatedNodes;
    edgesRef.current = updatedEdges;
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    
    // Apply layout after state updates
    setTimeout(applyLayout, 100);
  }, [applyLayout]);

  // Handle node deletion
  const handleDeleteNode = useCallback((nodeId) => {
    console.log('Delete node:', nodeId);
    
    // Find all child nodes and edges connected to this node
    const getChildNodesAndEdges = (id) => {
      const childEdges = edgesRef.current.filter(e => e.source === id);
      const childNodeIds = childEdges.map(e => e.target);
      
      let allNodeIds = [...childNodeIds];
      let allEdgeIds = childEdges.map(e => e.id);
      
      // Recursively find all descendants
      childNodeIds.forEach(childId => {
        const descendants = getChildNodesAndEdges(childId);
        allNodeIds = [...allNodeIds, ...descendants.nodeIds];
        allEdgeIds = [...allEdgeIds, ...descendants.edgeIds];
      });
      
      return { nodeIds: allNodeIds, edgeIds: allEdgeIds };
    };
    
    // Get all nodes and edges to delete
    const { nodeIds, edgeIds } = getChildNodesAndEdges(nodeId);
    nodeIds.push(nodeId); // Add the node itself
    
    // Also find edges where this node is a target
    const parentEdges = edgesRef.current.filter(e => e.target === nodeId);
    edgeIds.push(...parentEdges.map(e => e.id));
    
    // Filter out deleted nodes and edges
    const updatedNodes = nodesRef.current.filter(node => !nodeIds.includes(node.id));
    const updatedEdges = edgesRef.current.filter(edge => !edgeIds.includes(edge.id));
    
    // Update state and refs
    nodesRef.current = updatedNodes;
    edgesRef.current = updatedEdges;
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    
    // Re-apply layout
    setTimeout(() => applyLayout(), 100);
  }, [applyLayout]);

  // Store the latest handleDeleteNode in ref
  useEffect(() => {
    handleDeleteNodeRef.current = handleDeleteNode;
  }, [handleDeleteNode]);

  // Handle node update
  const handleNodeUpdate = useCallback((nodeId, updatedData) => {
    console.log('Update node:', nodeId, 'with data:', updatedData);
    
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === nodeId) {
          let newStyle = {};
          
          // Apply styling based on device type
          if (updatedData.deviceType === 'ONT') {
            newStyle = { background: '#e74c3c' };
          } else if (updatedData.deviceType === 'ONU') {
            newStyle = { background: '#f39c12' };
          } else if (updatedData.splitterType === 'Splitter') {
            newStyle = { background: '#95a5a6' };
          }
          
          // Check if this is a splitter selection that should create child nodes
          if (updatedData.splitterType === 'Splitter' && updatedData.splitterValue && 
              (!node.data.splitterValue || node.data.splitterValue !== updatedData.splitterValue)) {
            // Schedule a call to handle the splitter selection
            setTimeout(() => handleStepNodeSelectRef.current(nodeId, updatedData), 0);
          }
          
          // Check if this is a device type selection that should create a child node
          if (updatedData.splitterType === 'Device' && updatedData.deviceType && 
              (!node.data.deviceType || node.data.deviceType !== updatedData.deviceType)) {
            // Schedule a call to handle the device selection
            setTimeout(() => handleStepNodeSelectRef.current(nodeId, updatedData), 0);
          }
          
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedData,
              onUpdate: handleNodeUpdate,
              onDelete: handleDeleteNodeRef.current
            },
            style: {
              ...node.style,
              ...newStyle
            }
          };
        }
        return node;
      })
    );
  }, []);

  // Handle PON node click (OLT creation)
  const handlePonNodeClick = useCallback((event, node) => {
    event.preventDefault();
    console.log('PON Node clicked to create OLT:', node);

    // Create a new OLT node
    const newOltId = `olt-${node.data.ponNumber}-s1`;
    const newOltNode = {
      id: newOltId,
      type: 'CustomNode',
      position: { x: node.position.x, y: node.position.y + 150 },
      data: {
        label: `Step 1 - OLT-99 PON ${node.data.ponNumber}`,
        nodeType: 'OLT',
        ponNumber: node.data.ponNumber,
        ponId: node.data.ponNumber,
        onUpdate: handleNodeUpdate,
        onDelete: handleDeleteNodeRef.current
      }
    };

    // Create a new edge
    const newEdge = {
      id: `e-${node.id}-${newOltId}`,
      source: node.id,
      target: newOltId,
      animated: true,
      type: ConnectionLineType.SmoothStep
    };

    // Update state without removing existing nodes
    setNodes(prevNodes => [...prevNodes, newOltNode]);
    setEdges(prevEdges => [...prevEdges, newEdge]);

    // Update layout
    setTimeout(() => applyLayout(), 50);
  }, [applyLayout, handleNodeUpdate]);

  // Handle step node select (when a splitter value is chosen)
  const handleStepNodeSelect = useCallback((nodeId, updatedData) => {
    console.log('Step node selected:', nodeId, 'with data:', updatedData);
    
    try {
      // Find the node that was selected
      const selectedNode = nodesRef.current.find(node => node.id === nodeId);
      if (!selectedNode) {
        console.error('Selected node not found:', nodeId);
        return;
      }

      // Get the number of child nodes based on splitter value
      let numChildren = 0;
      if (updatedData.splitterValue === '1/2') numChildren = 2;
      else if (updatedData.splitterValue === '1/4') numChildren = 4;
      else if (updatedData.splitterValue === '1/8') numChildren = 8;
      else if (updatedData.splitterValue === '1/16') numChildren = 16;
      else if (updatedData.splitterType === 'Device' && 
               (updatedData.deviceType === 'ONT' || updatedData.deviceType === 'ONU')) {
        numChildren = 1;
      }
      else return; // no valid selection

      console.log(`Creating ${numChildren} child nodes for ${nodeId}`);

      // Extract step number from the parent node id or label
      let stepNumber = 1;
      const stepMatch = selectedNode.id.match(/s(\d+)/);
      if (stepMatch) {
        stepNumber = parseInt(stepMatch[1], 10) + 1;
      }

      const newNodes = [];
      const newEdges = [];

      // Get existing child nodes for this parent
      const existingChildIds = edgesRef.current
        .filter(edge => edge.source === nodeId)
        .map(edge => edge.target);
      
      // Create new nodes and edges
      for (let i = 0; i < numChildren; i++) {
        // Skip if we already have enough child nodes
        if (i < existingChildIds.length) continue;
        
        // Generate label based on splitter type and number of children
        let nodeType = 'Step';
        let nodeLabel = '';
        
        if (updatedData.splitterType === 'Splitter') {
          // For splitter nodes use alphabetical sub-steps (a, b, c, etc.)
          nodeLabel = `Step-${stepNumber}(${String.fromCharCode(97 + i)}) - OLT-99 PON ${selectedNode.data.ponId}`;
        } else if (updatedData.deviceType) {
          // For device nodes use the device type
          nodeType = updatedData.deviceType;
          nodeLabel = `${updatedData.deviceType} - OLT-99 PON ${selectedNode.data.ponId}`;
        }
        
        // Create unique ID for new node
        const newNodeId = `child-${nodeId}-${i}-${Date.now()}`;
        
        // Create new node
        const newNode = {
          id: newNodeId,
          type: 'CustomNode',
          position: { 
            x: selectedNode.position.x + (i - Math.floor(numChildren/2)) * 100, 
            y: selectedNode.position.y + 150 
          },
          data: {
            label: nodeLabel,
            nodeType: nodeType,
            splitterType: updatedData.splitterType === 'Splitter' ? 'Splitter' : 'Device',
            ponNumber: selectedNode.data.ponNumber,
            ponId: selectedNode.data.ponId,
            onUpdate: handleNodeUpdate,
            onDelete: handleDeleteNodeRef.current
          }
        };
        
        // Create new edge
        const newEdge = {
          id: `e-${nodeId}-${newNodeId}`,
          source: nodeId,
          target: newNodeId,
          animated: true,
          type: ConnectionLineType.SmoothStep
        };
        
        newNodes.push(newNode);
        newEdges.push(newEdge);
      }

      // Update nodes and edges states
      if (newNodes.length > 0) {
        // Update state without causing state conflicts
        setNodes(prevNodes => [...prevNodes, ...newNodes]);
        setEdges(prevEdges => [...prevEdges, ...newEdges]);
        
        // Also update refs
        nodesRef.current = [...nodesRef.current, ...newNodes];
        edgesRef.current = [...edgesRef.current, ...newEdges];
        
        // Update layout
        setTimeout(() => applyLayout(), 50);
      }
    } catch (error) {
      console.error('Error in handleStepNodeSelect:', error);
    }
  }, [applyLayout, handleNodeUpdate]);

  // Store the latest handleStepNodeSelect in ref
  useEffect(() => {
    handleStepNodeSelectRef.current = handleStepNodeSelect;
  }, [handleStepNodeSelect]);

  // Function to search for nodes and highlight them
  const searchConnectedNodes = useCallback(() => {
    if (!searchId) return;
    
    const foundNode = nodesRef.current.find(node => node.id === searchId);
    if (!foundNode) {
      alert('Node not found');
      return;
    }
    
    // Find all connected nodes
    const getFlow = (startNodeId) => {
    const visitedNodes = new Set();
    const flowNodes = [];
    const flowEdges = [];

    function dfs(nodeId) {
        if (visitedNodes.has(nodeId)) return;
        visitedNodes.add(nodeId);

        const node = nodesRef.current.find((n) => n.id === nodeId);
        if (node) flowNodes.push(node);

        const connectedEdges = edgesRef.current.filter((e) => e.source === nodeId);
        connectedEdges.forEach((edge) => {
            flowEdges.push(edge);
          dfs(edge.target);
        });
    }

    dfs(startNodeId);
      return { flowNodes, flowEdges };
    };
    
    const { flowNodes, flowEdges } = getFlow(foundNode.id);
    
    // Highlight the found nodes
    setNodes(nodesRef.current.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: flowNodes.some(n => n.id === node.id) ? 1 : 0.3
      }
    })));
    
    setEdges(edgesRef.current.map(edge => ({
      ...edge,
      style: {
        ...edge.style,
        opacity: flowEdges.some(e => e.id === edge.id) ? 1 : 0.3
      }
    })));
  }, [searchId]);

  // Function to reset highlight
  const resetHighlight = useCallback(() => {
    setNodes(nodesRef.current.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: 1
      }
    })));
    
    setEdges(edgesRef.current.map(edge => ({
      ...edge,
      style: {
        ...edge.style,
        opacity: 1
      }
    })));
  }, []);

  // Function to handle form submission
  const onSubmit = useCallback(() => {
    const networkData = {
      nodes: nodesRef.current,
      edges: edgesRef.current,
    };
    console.log("Network configuration saved:", networkData);
    alert('Network configuration saved!');
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e) => setSearchId(e.target.value), []);

  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: '#34495e' }}>
      <div className="d-flex justify-content-between align-items-center w-100 p-2">
        <div className="d-flex flex-row gap-2 align-items-center">
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '24px', marginRight: '15px' }}>
            NETWORK STRUCTURE
          </div>
    <Input 
      type="text" 
            className="form-control w-50 me-2" 
            placeholder="Enter Node ID (e.g., pon-1, olt-1-s1)" 
      value={searchId} 
      onChange={handleSearchChange}
    />
          <Button color="primary" className="me-2" onClick={searchConnectedNodes}>
      Search
          </Button>
          <Button color="secondary" onClick={resetHighlight}>
            Reset
          </Button>
          <Button color="info" onClick={applyLayout}>
            Refresh Layout
          </Button>
  </div>

        <div className="d-flex justify-content-end">
          <Button color="success" onClick={onSubmit}>
            Save Network Configuration
          </Button>
  </div>
</div>

    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      nodeTypes={nodeTypes}
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        fitViewOptions={{ padding: 0.2 }}
        style={{ background: '#2c3e50' }}
        nodesDraggable={true}
        elementsSelectable={true}
        onNodeClick={(event, node) => {
          console.log("Node clicked:", node);
          if (node.data.nodeType === 'PON') {
            // Check if OLT node already exists for this PON
            const oltNodeId = `olt-${node.data.ponId}-s1`;
            const oltExists = nodesRef.current.some(n => n.id === oltNodeId);
            
            if (!oltExists) {
              handlePonNodeClick(event, node);
            } else {
              console.log("OLT node already exists for PON", node.data.ponId);
            }
          }
        }}
      >
        <Background color="#aaa" gap={16} />
 <Controls />
        <Panel position="top-right">
          <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
            <div><strong>EPON Network Structure</strong></div>
            <div style={{ fontSize: '12px' }}>Click on PON to create OLT</div>
            <div style={{ fontSize: '12px' }}>Choose splitter value to create child nodes</div>
            <div style={{ fontSize: '12px', marginTop: '5px', color: '#27ae60' }}>
              <strong>Total Nodes:</strong> {nodes.length}
            </div>
          </div>
        </Panel>
    </ReactFlow>
    </div>
  );
};

export default Flow;
