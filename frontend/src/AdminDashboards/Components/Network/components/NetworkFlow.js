import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  ConnectionLineType,
  Panel,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow
} from '@xyflow/react';
import { Button, Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import '@xyflow/react/dist/style.css';
import './NetworkStyles.css';
import Swal from 'sweetalert2';

// Import components
import DebugPanel from './DebugPanel';
import NodeStore from './NodeStore';
import EdgeStore from './EdgeStore';
import { getLayoutedElements, } from './NetworkLayout';
import { 
  createPonClickHandler, 
  createSplitterHandler, 
  createDeviceHandler,
  deleteNodeHandler,
  createNodeOnEdge,
  createOnuDeviceHandler
} from './NodeHandlers';
import CustomNode from '../CustomNode';
import EdgeContextMenu from './EdgeContextMenu';
import PonSelector from './PonSelector';
import axios from 'axios';
import { API_URL } from '../../../../config';
import OnuNode from './nodes/OnuNode';
import OntNode from './nodes/OntNode';
import RouterNode from './nodes/RouterNode';
import SwitchPNode from './nodes/SwitchPNode';
import SwitchSNode from './nodes/SwitchSNode';

// Main NetworkFlow component wrapped with ReactFlowProvider
const NetworkFlow = () => {
  const location = useLocation();
  const flowData = location.state?.flowData;  
  return (
    <ReactFlowProvider>
      <FlowContent flowData={flowData} />
    </ReactFlowProvider>
  );
};

// The main content of the flow component
const FlowContent = ({ flowData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract search context from location state
  const searchContext = location.state?.searchContext;

  // Use useRef to track if the component has mounted
  const isMounted = useRef(false);

  const nodeTypes = useMemo(() => ({ 
    CustomNode: CustomNode,
    OnuNode: OnuNode,
    OntNode: OntNode,
    RouterNode: RouterNode,
    SwitchPNode: SwitchPNode,
    SwitchSNode: SwitchSNode
  }), []);
  const [rfInstance, setRfInstance] = useState(null);
  // Use useRef for idCounter to maintain consistent reference
  const idCounterRef = useRef(1);
  
  // Debug state to show current state
  const [debugInfo, setDebugInfo] = useState({});
  
  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);
  // State for PON selector
  const [ponSelector, setPonSelector] = useState(null);
  // State for showing/hiding the report panel
  const [showReport, setShowReport] = useState(true);

  // React Flow state
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport } = useReactFlow();
  
  // Functions
  const logState = (action) => {
    console.log(`[${action}] Nodes:`, nodes);
    console.log(`[${action}] Edges:`, edges);
    console.log(`[${action}] Node store:`, NodeStore.getAllNodes());
    console.log(`[${action}] Edge store:`, EdgeStore.getAllEdges());
    setDebugInfo({
      action,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      storeCount: NodeStore.getAllNodes().length,
      edgeStoreCount: EdgeStore.getAllEdges().length,
      timestamp: new Date().toISOString()
    });
  };

  // Define onNodeUpdate first - before using it in handler functions
  const onNodeUpdate = useCallback((id, updatedData) => {
    if (!id) {
      console.error("Cannot update node: id is undefined");
      return;
    }
    
    // Also update in store
    const node = NodeStore.getNode(id);
    if (node) {
      // Ensure we're updating ponId correctly for rewiring operations
      if (updatedData.ponId) {
        console.log(`Updating node ${id} with new ponId: ${updatedData.ponId}`);
      }
      node.data = { ...node.data, ...updatedData };
    } else {
      console.warn(`Node ${id} not found in store during update`);
    }
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          // Create a new data object with the updated properties
          const updatedNodeData = { ...node.data, ...updatedData };
          return { ...node, data: updatedNodeData };
        }
        return node;
      })
    );
  }, []);

  // Create ONU device handler directly
  const handleOnuDeviceCreate = createOnuDeviceHandler(
    NodeStore, 
    onNodeUpdate, 
    idCounterRef, 
    () => nodes, // Pass a function that returns current nodes
    setNodes, 
    setEdges,
    logState,
    flowData
  );

  // Now define handlers that use onNodeUpdate
  const handleDeviceSelect = createDeviceHandler(
    NodeStore, 
    onNodeUpdate, 
    idCounterRef,
    () => nodes, // Pass a function that returns current nodes
    setNodes,
    setEdges,
    logState,
    flowData,
    handleOnuDeviceCreate // Pass the ONU device handler
  );
  
  const handleSplitterSelect = createSplitterHandler(
    NodeStore,
    () => nodes, // Pass a function that returns current nodes
    setNodes,
    setEdges,
    onNodeUpdate,
    idCounterRef,
    logState,
    flowData
  );

  // Define handlePonNodeClick after its dependencies
  const handlePonNodeClick = (ponId) => {
    createPonClickHandler(
      ponId,
      idCounterRef,
      NodeStore,
      () => nodes, // Pass a function that returns current nodes
      setNodes,
      setEdges,
      onNodeUpdate,
      handleSplitterSelect,
      handleDeviceSelect,
      logState,
      flowData
    );
  };

  // Setup initial nodes function wrapped in useCallback
  const setupInitialNodes = useCallback(() => {
    // Reset counter and stores
    idCounterRef.current = 1;
    NodeStore.clear();
    EdgeStore.clear();
    
    // Use flowData if available, otherwise use default values
    const eponName = flowData?.name || 'EPON';
    const oltName = flowData?.olt_name || 'OLT';
    const portCount = flowData?.port || 8;
    
    const eponNode = {
      id: 'epon-1',
      type: 'CustomNode',
      data: { 
        label: eponName, 
        nodeType: 'simple',
        color: '#e74c3c',
        id: 'epon-1',
        oltName: oltName
      },
      position: { x: 0, y: 0 }
    };
    
    // Add to nodeStore
    NodeStore.addNode(eponNode);

    const ponNodes = [];
    const ponEdges = [];

    // Create PON nodes based on port count from flowData
    for (let i = 1; i <= portCount; i++) {
      const ponId = `pon-${i}`;
      const ponNode = {
        id: ponId,
        type: 'CustomNode',
        data: { 
          label: `PON ${i}`, 
          nodeType: 'simple',
          color: '#3498db',
          onClick: (id) => handlePonNodeClick(id),
          id: ponId
        },
        position: { x: 0, y: 0 } // Position will be calculated by dagre
      };

      ponNodes.push(ponNode);
      // Add to nodeStore
      NodeStore.addNode(ponNode);

      // Connect EPON to each PON
      const edge = {
        id: `e-epon-1-pon-${i}`,
        source: 'epon-1',
        target: ponId,
        type: 'smoothstep',
        animated: true
      };

      ponEdges.push(edge);
      // Add to EdgeStore
      EdgeStore.addEdge(edge);
    }

    const allNodes = [eponNode, ...ponNodes];
    const allEdges = [...ponEdges];

    setInitialNodes(allNodes);
    setInitialEdges(allEdges);
    
    // Apply layout and set nodes/edges
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      allNodes,
      allEdges
    );
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    
    // Log initial state
    setTimeout(() => {
      logState('Initial Setup');
    }, 100);
  }, [flowData, logState, setNodes, setEdges, setInitialNodes, setInitialEdges, idCounterRef, handlePonNodeClick]);
  
  // Set up initial EPON and PON nodes when component mounts and flowData is available
  useEffect(() => {
    // Only run setup once when component mounts and we have flowData
    if (!isMounted.current && flowData) {
      setupInitialNodes();
      isMounted.current = true;
    }
  }, [flowData, setupInitialNodes]);

  // Custom node change handler to update NodeStore when nodes are moved
  const handleNodesChange = useCallback((changes) => {
    // Apply the changes to the nodes state first
    onNodesChange(changes);
    
    // Update NodeStore with new positions for dragged nodes
    changes.forEach(change => {
      if (change.type === 'position' && change.dragging === false) {
        // Node dragging has completed - update NodeStore
        const node = nodes.find(n => n.id === change.id);
        if (node) {
          NodeStore.updateNodePosition(change.id, change.position);
        }
      }
    });
  }, [nodes, onNodesChange]);

  // Custom edge change handler to update EdgeStore when edges change
  const handleEdgesChange = useCallback((changes) => {
    // Apply the changes to the edges state first
    onEdgesChange(changes);
    
    // Update EdgeStore based on changes
    changes.forEach(change => {
      if (change.type === 'add' && change.item) {
        EdgeStore.addEdge(change.item);
      } else if (change.type === 'remove') {
        EdgeStore.removeEdge(change.id);
      }
    });
  }, [onEdgesChange]);
  
  // Suppress ResizeObserver loop warning
  useEffect(() => {
    // Save the original console error function
    const originalConsoleError = console.error;
    
    // Override console.error to suppress specific ResizeObserver warning
    console.error = (...args) => {
      if (args[0]?.includes?.('ResizeObserver loop') || 
          args[0]?.message?.includes?.('ResizeObserver loop') ||
          (typeof args[0] === 'string' && args[0].includes('ResizeObserver loop'))) {
        // Don't log the ResizeObserver warning
        return;
      }
      // Log all other errors normally
      originalConsoleError(...args);
    };
    
    // Cleanup function to restore original console.error when component unmounts
    return () => {
      console.error = originalConsoleError;
    };
  }, []);
  
  // Handle node deletion
  const handleDeleteNode = useCallback((nodeId) => {
    console.log("Deleting node:", nodeId);
    deleteNodeHandler(
      nodeId,
      NodeStore,
      nodes,
      edges,
      setNodes,
      setEdges,
      logState
    );
  }, [nodes, edges]);

  // Handle PON rewiring
  const handleRewirePon = useCallback((nodeId, newPonId) => {
    // Get the node to rewire
    const nodeToRewire = nodes.find(n => n.id === nodeId);
    if (!nodeToRewire || !nodeToRewire.data.ponId) {
      console.error("Cannot find node to rewire or node does not have ponId");
      return;
    }

    const currentPonId = nodeToRewire.data.ponId;
    
    // Don't do anything if the PON isn't changing
    if (currentPonId === newPonId) {
      console.log("Same PON selected, no changes needed");
      return;
    }
    
    console.log(`Rewiring node ${nodeId} from PON ${currentPonId} to PON ${newPonId}`);
    
    // Find all edges where this node is the target (incoming edges)
    const incomingEdges = edges.filter(e => e.target === nodeId);
    
    // Create a new edge from the new PON to the node
    const newEdge = {
      id: `e-${newPonId}-${nodeId}`,
      source: newPonId,
      target: nodeId,
      type: 'smoothstep',
      animated: true
    };
    
    // Update the node's ponId reference
    onNodeUpdate(nodeId, { ponId: newPonId });
    
    // Update the label to reflect the new PON connection
    const oldLabel = nodeToRewire.data.label;
    let newLabel = oldLabel;
    
    // Extract PON number from the new PON ID
    let newPonNumber;
    if (typeof newPonId === 'string' && newPonId.includes('-')) {
      newPonNumber = newPonId.split('-')[1];
    } else {
      const newPonNode = nodes.find(n => n.id === newPonId);
      const match = newPonNode?.data?.label?.match(/PON (\d+)/);
      newPonNumber = match ? match[1] : 'unknown';
    }
    
    // Update the label to reflect the new PON
    if (oldLabel.includes('PON')) {
      const ponRegex = /PON \d+/;
      newLabel = oldLabel.replace(ponRegex, `PON ${newPonNumber}`);
      onNodeUpdate(nodeId, { label: newLabel });
    }

    // Update all child nodes recursively to ensure they reference the same PON
    const updateChildNodes = (parentId, ponId, ponNumber) => {
      // Find all edges where this parent is the source
      const childEdges = edges.filter(e => e.source === parentId);
      
      // For each child, update its ponId and label
      childEdges.forEach(edge => {
        const childId = edge.target;
        const childNode = nodes.find(n => n.id === childId);
        
        if (childNode) {
          // Update child node ponId
          onNodeUpdate(childId, { ponId: ponId });
          
          // Update child node label
          if (childNode.data.label && childNode.data.label.includes('PON')) {
            const ponRegex = /PON \d+/;
            const newChildLabel = childNode.data.label.replace(ponRegex, `PON ${ponNumber}`);
            onNodeUpdate(childId, { label: newChildLabel });
          }
          
          // Recursively update children of this child
          updateChildNodes(childId, ponId, ponNumber);
        }
      });
    };
    
    // Start the recursive update from the rewired node
    updateChildNodes(nodeId, newPonId, newPonNumber);
    
    // Remove all incoming edges and add the new one
    setEdges(eds => {
      // Keep all edges that don't have this node as a target
      const filteredEdges = eds.filter(e => !incomingEdges.some(ie => ie.id === e.id));
      const updatedEdges = [...filteredEdges, newEdge];
      
      // Update EdgeStore
      incomingEdges.forEach(edge => EdgeStore.removeEdge(edge.id));
      EdgeStore.addEdge(newEdge);
      
      return updatedEdges;
    });
    
    // Log state after update
    setTimeout(() => {
      logState('Rewired Node to New PON');
    }, 100);
    
  }, [nodes, edges, onNodeUpdate]);

  // Function to open the PON selector
  const openPonSelector = useCallback((event, nodeId, clientX, clientY) => {
    // Prevent event propagation
    event.stopPropagation();
    
    // Get all available PON nodes
    const ponNodes = nodes.filter(node => 
      node.data.label && 
      (node.data.label.includes('PON') && !node.data.label.includes('EPON'))
    );
    
    // Get the current PON ID from the node
    const nodeToRewire = nodes.find(n => n.id === nodeId);
    const currentPonId = nodeToRewire?.data?.ponId;
    
    if (!currentPonId) {
      console.error("Cannot find current PON ID for node");
      return;
    }
    
    // Format the PON options
    const ponOptions = ponNodes.map(ponNode => ({
      id: ponNode.id,
      label: ponNode.data.label
    }));
    
    // Set the PON selector state
    setPonSelector({
      x: clientX,
      y: clientY,
      nodeId,
      currentPonId,
      ponOptions
    });
  }, [nodes]);

  // Keep nodeStore in sync with nodes state
  useEffect(() => {
    // Only sync if we're not in the middle of restoration
    // This prevents interference during the restore process
    if (isMounted.current) {
      // Clear the store first
      NodeStore.clear();
      
      // Add all current nodes to the store
      nodes.forEach(node => {
        NodeStore.addNode(node);
      });
      
      // console.log("Node store updated:", NodeStore.getAllNodes().length, "nodes");
    }
  }, [nodes]);

  // Keep edgeStore in sync with edges state
  useEffect(() => {
    // Only sync if we're not in the middle of restoration
    // This prevents interference during the restore process
    if (isMounted.current) {
      // Clear the store first
      EdgeStore.clear();
      
      // Add all current edges to the store
      edges.forEach(edge => {
        EdgeStore.addEdge(edge);
      });
      
      // console.log("Edge store updated:", EdgeStore.getAllEdges().length, "edges");
    }
  }, [edges]);

  // Apply layout and update the flow when nodes or edges change
  useEffect(() => {
    // Avoid layout calculations during initial render
    if (!isMounted.current) return;
    
    if (nodes.length > 0 && edges.length > 0) {
      // Use a ref to track if we're already calculating layout
      const layoutTimeoutRef = { current: null };
      
      // Clear any existing timeout
      if (layoutTimeoutRef.current) {
        clearTimeout(layoutTimeoutRef.current);
      }
      
      // Debounce layout calculations to reduce ResizeObserver calls
      layoutTimeoutRef.current = setTimeout(() => {
        applyLayout();
        layoutTimeoutRef.current = null;
      }, 300); // Wait for 300ms of inactivity before recalculating layout
      
      // Clear timeout on cleanup
      return () => {
        if (layoutTimeoutRef.current) {
          clearTimeout(layoutTimeoutRef.current);
        }
      };
    }
  }, [nodes.length, edges.length]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = { ...params, type: ConnectionLineType.SmoothStep, animated: true };
      setEdges((eds) => {
        const updatedEdges = addEdge(newEdge, eds);
        // Add to EdgeStore
        EdgeStore.addEdge(newEdge);
        return updatedEdges;
      });
    },
    [],
  );

  const applyLayout = () => {
    // Create a separate copy of nodes and edges to avoid state mutation issues
    const nodesCopy = [...nodes];
    const edgesCopy = [...edges];
    
    // Only proceed if we have nodes and edges
    if (nodesCopy.length === 0 || edgesCopy.length === 0) {
      return;
    }
    
    try {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodesCopy, 
        edgesCopy
      );
      
      // Batch state updates by requesting animation frame
      // This helps prevent multiple sequential DOM updates that trigger ResizeObserver
      window.requestAnimationFrame(() => {
        setNodes(layoutedNodes);
      });
    } catch (error) {
      console.warn("Layout calculation error:", error);
    }
  };

  // Find all nodes that can be deleted (all nodes except PON and EPON nodes)
  const getDeletableNodes = () => {
    return nodes.filter(node => 
      (node.data.label && 
       !node.data.label.includes('PON') && 
       !node.data.label.includes('EPON')
      )
    );
  };

  // Process nodes to include onDelete callback and openPonSelector
  useEffect(() => {
    // Only process if component is mounted and not during restoration
    if (!isMounted.current) return;
    
    // Add a check to prevent unnecessary updates
    const nodesNeedUpdate = nodes.some(node => {
      // Check if this is an OLT node that doesn't have the openPonSelector or onDelete attached
      const isOltNode = node.data?.label?.includes('OLT') && node.data?.ponId;
      return !node.data.onDelete || (isOltNode && !node.data.openPonSelector);
    });

    // Only update if necessary
    if (nodesNeedUpdate) {
      setNodes(nds => 
        nds.map(node => {
          // Check if this is an OLT node (has OLT in label and a ponId)
          const isOltNode = node.data?.label?.includes('OLT') && node.data?.ponId;
          
          return {
            ...node,
            data: {
              ...node.data,
              onDelete: node.data.onDelete || handleDeleteNode,
              // Only add the openPonSelector callback to OLT nodes if not already present
              ...(isOltNode && !node.data.openPonSelector && { openPonSelector })
            }
          };
        })
      );
    }
  }, [handleDeleteNode, openPonSelector, nodes]);

  // Handle edge click to open context menu
  const onEdgeClick = useCallback((event, edge) => {
    // Prevent event propagation
    event.stopPropagation();
    
    // Find the source and target nodes to calculate better positions
    const sourceNode = nodes.find(node => node.id === edge.source);
    const targetNode = nodes.find(node => node.id === edge.target);
    
    if (!sourceNode || !targetNode) {
      console.error("Source or target node not found for edge", edge);
      return;
    }
    
    // Calculate a position along the edge based on the mouse click
    // This will be adjusted later when actually creating the node
    const clickPosition = {
      x: event.clientX,
      y: event.clientY
    };
    
    // Set context menu position
    setContextMenu({
      x: clickPosition.x,
      y: clickPosition.y,
      edgeId: edge.id,
      sourceId: edge.source,
      targetId: edge.target,
      sourcePosition: sourceNode.position,
      targetPosition: targetNode.position,
      // Store the flow-relative coordinates for actual node placement
      nodePosition: {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2
      }
    });
  }, [nodes]);

  // Handle context menu item selection
  const handleContextMenuSelect = useCallback((nodeType) => {
    if (!contextMenu) return;
    
    // Create new node on edge
    createNodeOnEdge(
      nodeType,
      contextMenu.edgeId,
      contextMenu.sourceId,
      contextMenu.targetId,
      contextMenu.nodePosition,
      idCounterRef,
      NodeStore,
      nodes,
      edges,
      setNodes,
      setEdges,
      onNodeUpdate,
      logState
    );
    
    // Close context menu
    setContextMenu(null);
  }, [contextMenu, nodes, edges, onNodeUpdate]);

  // Handle PON selector selection
  const handlePonSelectorSelect = useCallback((newPonId) => {
    if (!ponSelector) return;
    
    // Find the node and current PON details for better logging
    const nodeToMove = nodes.find(n => n.id === ponSelector.nodeId);
    const currentPonNode = nodes.find(n => n.id === ponSelector.currentPonId);
    const newPonNode = nodes.find(n => n.id === newPonId);
    
    // Get labels for user-friendly notification
    const nodeLabel = nodeToMove?.data?.label || 'Unknown node';
    const fromPonLabel = currentPonNode?.data?.label || 'Unknown PON';
    const toPonLabel = newPonNode?.data?.label || 'Unknown PON';
    
    console.log(`Moving ${nodeLabel} from ${fromPonLabel} to ${toPonLabel}`);
    
    // Rewire the node to the new PON
    handleRewirePon(ponSelector.nodeId, newPonId);
    
    // Close the PON selector
    setPonSelector(null);
    
    // Add a temporary notification (optional)
    const notificationDiv = document.createElement('div');
    notificationDiv.style.position = 'fixed';
    notificationDiv.style.top = '20px';
    notificationDiv.style.left = '50%';
    notificationDiv.style.transform = 'translateX(-50%)';
    notificationDiv.style.backgroundColor = 'rgba(46, 204, 113, 0.9)';
    notificationDiv.style.color = 'white';
    notificationDiv.style.padding = '10px 20px';
    notificationDiv.style.borderRadius = '5px';
    notificationDiv.style.zIndex = '1000';
    notificationDiv.style.fontSize = '14px';
    notificationDiv.textContent = `Successfully moved ${nodeLabel} to ${toPonLabel}`;
    document.body.appendChild(notificationDiv);
    
    // Remove the notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notificationDiv);
    }, 3000);
    
  }, [ponSelector, handleRewirePon, nodes]);

  // Close menus when clicking elsewhere
  const onPaneClick = useCallback(() => {
    setContextMenu(null);
    setPonSelector(null);
  }, []);

  const onSave = useCallback(async () => {
    if (rfInstance) {
      // Get the current flow state with all positions
      const flow = rfInstance.toObject();
      
      // Clean and prepare nodes for saving
      flow.nodes = flow.nodes.map(node => {
        const storedNode = NodeStore.getNode(node.id);
        
        // Create a clean data object without callback functions
        const cleanData = { ...node.data };
        
        // Remove callback functions that shouldn't be saved
        delete cleanData.onUpdate;
        delete cleanData.onSplitterSelect;
        delete cleanData.onDeviceSelect;
        delete cleanData.onDelete;
        delete cleanData.openPonSelector;
        delete cleanData.onClick;
        
        return {
          ...node,
          position: storedNode?.position || node.position,
          data: cleanData
        };
      });
      
      // Save to MongoDB
      try {
        const response = await axios.put(`${API_URL}/api/flow/update/${flowData.id}`, {
          data: JSON.stringify(flow),
        });
        console.log("Flow saved to MongoDB:", response.data);
        Swal.fire(
          'Successfully!',
          'Flow saved',
          'success'
        )
        onRestore()
      } catch (error) {
        console.error("Error saving flow to MongoDB:", error);
        Swal.fire(
          'Error!',
          error.response?.data?.message || error.message,
          'error'
        )
      }
    }
  }, [rfInstance, flowData.id]);
 
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/flow/get/${flowData.id}`);

        const flow = response?.data?.data?.data;

        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          // Clear both stores before restoration
          NodeStore.clear();
          EdgeStore.clear();
          
          // Update idCounter to be higher than any existing node ID
          const maxId = Math.max(
            ...flow.nodes.map(node => {
              const match = node.id.match(/(\d+)$/);
              return match ? parseInt(match[1]) : 0;
            }),
            0
          );
          idCounterRef.current = maxId + 1;
          
          // Reattach callback functions to nodes before setting them
          const restoredNodes = flow.nodes.map(node => {
            // Create a new node with the same data but reattach callbacks
            const restoredNode = {
              ...node,
              data: {
                ...node.data,
                onUpdate: (updatedData) => onNodeUpdate(node.id, updatedData),
                onSplitterSelect: (event, _, numChildren, splitterType) => {
                  console.log("Splitter callback with restored ID:", node.id);
                  handleSplitterSelect(event, node.id, numChildren, splitterType, node.data.ponId);
                },
                onClick: () => handlePonNodeClick(node.id),
                onDeviceSelect: (event, _, deviceType) => {
                  console.log("Device callback with restored ID:", node.id);
                  handleDeviceSelect(event, node.id, deviceType);
                },
                openPonSelector: node.data.ponId ? (e, nodeId, x, y) => {
                  // Use a function that will get fresh nodes state
                  const getCurrentPonNodes = () => {
                    // Get current nodes from React Flow instance
                    const currentNodes = rfInstance ? rfInstance.getNodes() : [];
                    return currentNodes.filter(n => 
                      n.data.label && n.data.label.includes('PON') && !n.data.label.includes('EPON')
                    );
                  };
                  
                  setPonSelector({
                    nodeId,
                    x,
                    y,
                    currentPonId: node.data.ponId,
                    ponOptions: getCurrentPonNodes().map(pon => ({
                      id: pon.id,
                      label: pon.data.label
                    }))
                  });
                } : undefined,
                onDelete: isDeletableNode(node) ? () => handleDeleteNode(node.id) : undefined,
              }
            };
            
            // Add to NodeStore immediately
            NodeStore.addNode(restoredNode);
            return restoredNode;
          });
          
          // Set nodes and edges
          setNodes(restoredNodes);
          setEdges(flow.edges || []);
          
          // Add edges to EdgeStore
          (flow.edges || []).forEach(edge => {
            EdgeStore.addEdge(edge);
          });
          
          // Set viewport after a short delay to ensure nodes are rendered
          setTimeout(() => {
            setViewport({ x, y, zoom });
          }, 100);
          
          // Apply layout after restoration to ensure proper positioning
          setTimeout(() => {
            if (restoredNodes.length > 0 && flow.edges.length > 0) {
              try {
                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                  restoredNodes,
                  flow.edges
                );
                setNodes(layoutedNodes);
                setEdges(layoutedEdges);
                
                // Update NodeStore with layouted positions
                layoutedNodes.forEach(node => {
                  NodeStore.updateNodePosition(node.id, node.position);
                });
              } catch (error) {
                console.warn("Layout calculation error during restore:", error);
              }
            }
            
            // Log state after restoration
            logState('Restored Flow');
          }, 200);
          
          // Mark as mounted to prevent initial setup from running again
          isMounted.current = true;
          
          console.log("Flow restoration completed successfully");
        }
      } catch (error) {
        console.error("Error restoring flow:", error);
        Swal.fire(
          'Error!',
          'Failed to restore flow: ' + (error.response?.data?.message || error.message),
          'error'
        );
      }
    };
 
    restoreFlow();
  }, [setNodes, setEdges, setViewport, handleSplitterSelect, handleDeviceSelect, onNodeUpdate, handleDeleteNode, rfInstance, logState]);

  // Helper function to determine if a node is deletable
  const isDeletableNode = (node) => {
    return node.data.label && 
      !node.data.label.includes('PON') && 
      !node.data.label.includes('EPON');
  };

  // Function to center view on searched nodes
  const centerOnSearchedNodes = useCallback(() => {
    if (!searchContext || !searchContext.isFromSearch || !rfInstance) {
      return;
    }

    const { searchQuery, matchingNodes } = searchContext;
    
    if (!matchingNodes || matchingNodes.length === 0) {
      console.log("No matching nodes found in search context");
      return;
    }

    // Find the actual nodes in the current flow that match the search
    const foundNodes = [];
    
    nodes.forEach(node => {
      // Check if this node matches any of the search criteria
      const nodeData = node.data || {};
      const query = searchQuery.toLowerCase().trim();
      
      const searchableFields = [
        nodeData.macAddress,
        nodeData.userId,
        nodeData.deviceId,
        nodeData.label,
        nodeData.name
      ];
      
      const hasMatch = searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(query)
      );
      
      if (hasMatch) {
        foundNodes.push(node);
      }
    });

    if (foundNodes.length === 0) {
      console.log("No matching nodes found in current flow");
      return;
    }

    console.log(`Found ${foundNodes.length} matching nodes, centering view...`);

    // Calculate the center position of all matching nodes
    let totalX = 0;
    let totalY = 0;
    
    foundNodes.forEach(node => {
      totalX += node.position.x;
      totalY += node.position.y;
    });
    
    const centerX = totalX / foundNodes.length;
    const centerY = totalY / foundNodes.length;

    // Get the current viewport
    const viewport = rfInstance.getViewport();
    
    // Calculate new viewport to center on the found nodes
    const newViewport = {
      x: -centerX * viewport.zoom + window.innerWidth / 2,
      y: -centerY * viewport.zoom + (window.innerHeight - 56) / 2, // Account for navbar height
      zoom: Math.max(viewport.zoom, 0.8) // Ensure reasonable zoom level
    };

    // Set the viewport to center on the found nodes
    setViewport(newViewport);

    // Temporarily highlight the found nodes
    const highlightNodes = foundNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isHighlighted: true
      },
      style: {
        ...node.style,
        border: '3px solid #ff6b6b',
        boxShadow: '0 0 20px rgba(255, 107, 107, 0.6)'
      }
    }));

    // Update nodes with highlight
    setNodes(nds => nds.map(node => {
      const highlightedNode = highlightNodes.find(hn => hn.id === node.id);
      return highlightedNode || node;
    }));

    // Remove highlight after 3 seconds
    setTimeout(() => {
      setNodes(nds => nds.map(node => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: false
        },
        style: {
          ...node.style,
          border: node.data.isHighlighted ? undefined : node.style?.border,
          boxShadow: node.data.isHighlighted ? undefined : node.style?.boxShadow
        }
      })));
    }, 3000);

    // Show notification
    const searchNotification = document.createElement('div');
    searchNotification.style.position = 'fixed';
    searchNotification.style.top = '80px'; // Below navbar
    searchNotification.style.left = '50%';
    searchNotification.style.transform = 'translateX(-50%)';
    searchNotification.style.backgroundColor = 'rgba(52, 152, 219, 0.95)';
    searchNotification.style.color = 'white';
    searchNotification.style.padding = '12px 24px';
    searchNotification.style.borderRadius = '8px';
    searchNotification.style.zIndex = '1001';
    searchNotification.style.fontSize = '14px';
    searchNotification.style.fontWeight = '500';
    searchNotification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    searchNotification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>🎯</span>
        <span>Found ${foundNodes.length} node(s) matching "${searchQuery}"</span>
      </div>
    `;
    document.body.appendChild(searchNotification);

    // Remove notification after 4 seconds
    setTimeout(() => {
      if (document.body.contains(searchNotification)) {
        document.body.removeChild(searchNotification);
      }
    }, 4000);

  }, [searchContext, nodes, rfInstance, setViewport, setNodes]);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    onRestore();
    // eslint-disable-next-line
  }, []);

  // Effect to center on searched nodes after flow is loaded
  useEffect(() => {
    // Only run if we have search context and nodes are loaded
    if (searchContext && searchContext.isFromSearch && nodes.length > 0 && rfInstance) {
      // Add a small delay to ensure the flow is fully rendered
      const timer = setTimeout(() => {
        centerOnSearchedNodes();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [searchContext, nodes.length, rfInstance, centerOnSearchedNodes]);

  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: '#f5f5f5' }}>
      {/* Top Navbar */}
      <Navbar color="dark" dark expand="md" style={{ zIndex: 1000 }}>
        <NavbarBrand>
          <Button color="secondary" onClick={handleBack} style={{ marginRight: '15px' }}>
            ← Back
          </Button>
          <span>Network Flow - {flowData?.name || 'EPON'}</span>
          {searchContext && searchContext.isFromSearch && (
            <span 
              style={{ 
                marginLeft: '15px', 
                padding: '4px 8px', 
                backgroundColor: 'rgba(255, 193, 7, 0.2)', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#ffc107'
              }}
            >
              📍 Searched: "{searchContext.searchQuery}"
            </span>
          )}
        </NavbarBrand>
        <Nav className="ml-auto" navbar>
          {searchContext && searchContext.isFromSearch && (
            <NavItem>
              <Button 
                color="warning" 
                onClick={centerOnSearchedNodes} 
                style={{ marginRight: '10px', fontSize: '12px' }}
                title="Re-center view on searched nodes"
              >
                🎯 Re-center Search
              </Button>
            </NavItem>
          )}
          <NavItem>
            <Button 
              color={showReport ? "warning" : "info"} 
              onClick={() => setShowReport(!showReport)} 
              style={{ marginRight: '10px' }}
            >
              {showReport ? "Hide Report" : "Show Report"}
            </Button>
          </NavItem>
          <NavItem>
            <Button color="success" onClick={onSave} style={{ marginRight: '10px' }}>
              Save
            </Button>
          </NavItem>
        </Nav>
      </Navbar>
      
      {/* Delete Nodes Button in top-right */}
      <Panel position="top-right" style={{ marginTop: '10px' }}>
        <Button 
          color="danger" 
          style={{ margin: '10px' }}
          onClick={() => {
            const deletableNodes = getDeletableNodes();
            if (deletableNodes.length > 0) {
              // Show notification that nodes can be deleted using the delete button on each node
              alert("Click the 'Delete' button on any node you want to remove (except PON and EPON nodes which cannot be deleted).");
            } else {
              alert("No nodes available to delete.");
            }
          }}
        >
          Delete Nodes
        </Button>
      </Panel>
      
      {/* Edge interaction tooltip */}
      <Panel position="bottom-center" style={{ marginBottom: '20px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 12px', borderRadius: '5px' }}>
        <div style={{ fontSize: '13px' }}>
          <span role="img" aria-label="tip">💡</span> Tip: Click on any edge to add JCBox or Loop nodes
        </div>
      </Panel>
      
      {/* PON rewiring tooltip */}
      <Panel position="bottom-left" style={{ marginBottom: '20px', marginLeft: '20px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 12px', borderRadius: '5px' }}>
        <div style={{ fontSize: '13px' }}>
          <span role="img" aria-label="tip">💡</span> Tip: Use the "Change PON" button on OLT nodes to rewire them
        </div>
      </Panel>
      
      {/* Debug panel */}
      {showReport && (
        <DebugPanel debugInfo={debugInfo} nodes={nodes} edges={edges} flowData={flowData} />
      )}
      
      {/* Context menu for edge click */}
      {contextMenu && (
        <EdgeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onSelect={handleContextMenuSelect}
          onClose={() => setContextMenu(null)}
        />
      )}
      
      {/* PON selector for rewiring */}
      {ponSelector && (
        <PonSelector
          x={ponSelector.x}
          y={ponSelector.y}
          ponOptions={ponSelector.ponOptions}
          currentPonId={ponSelector.currentPonId}
          onSelect={handlePonSelectorSelect}
          onClose={() => setPonSelector(null)}
        />
      )}
      
      <div style={{ height: 'calc(100vh - 56px)', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={2}
          onInit={setRfInstance}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={true}
        >
          <Background variant="dots" gap={12} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default NetworkFlow; 