// Handlers for node actions - creating nodes, handling events, etc.
import EdgeStore from './EdgeStore';

export const createPonClickHandler = (
  ponId, 
  idCounterRef, 
  nodeStore, 
  nodes, 
  setNodes, 
  setEdges,
  onNodeUpdate,
  handleSplitterSelect,
  handleDeviceSelect,
  logState,
  flowData
) => {
  console.log("handlePonNodeClick called with:", ponId);
  
  // Guard against undefined ponId
  if (!ponId) {
    console.error("ponId is undefined");
    return;
  }
  
  let ponNumber;
  
  // Check if ponId is a string and has the expected format
  if (typeof ponId === 'string' && ponId.includes('-')) {
    ponNumber = ponId.split('-')[1];
  } else {
    // Fallback - try to find the node and get its label
    const node = nodeStore.getNode(ponId) || nodes.find(n => n.id === ponId);
    if (node && node.data && node.data.label) {
      const match = node.data.label.match(/PON (\d+)/);
      if (match) {
        ponNumber = match[1];
      } else {
        console.error("Could not extract PON number from label");
        ponNumber = "unknown";
      }
    } else {
      console.error("Could not find node with id:", ponId);
      ponNumber = "unknown";
    }
  }
  
  const newStepId = getNextStepId(idCounterRef);
  console.log("Created node with ID:", newStepId);
  
  // Find the parent node to get its position
  const parentNode = nodeStore.getNode(ponId) || nodes.find(n => n.id === ponId);
  const parentY = parentNode?.position?.y || 0;
  
  // Create the Step 1 OLT node
  const newNode = {
    id: newStepId,
    type: 'CustomNode',
    data: { 
      label: `Step 1 - ${flowData?.olt_name} PON ${ponNumber}`,
      ponId: ponId, // Store original PON ID for reference
      fms: '', // Initialize FMS field
      fmsPort: '', // Initialize FMS PORT field
      onUpdate: (updatedData) => onNodeUpdate(newStepId, updatedData),
      // Use a closure to capture the correct node ID
      onSplitterSelect: (event, _, numChildren, splitterType) => {
        console.log("Splitter callback with captured ID:", newStepId);
        handleSplitterSelect(event, newStepId, numChildren, splitterType, ponId);
      },
      onDeviceSelect: (event, _, deviceType) => {
        console.log("Device callback with captured ID:", newStepId);
        handleDeviceSelect(event, newStepId, deviceType);
      },
      id: newStepId // Explicitly store ID in data as well
    },
    // Position with increased vertical spacing
    position: { x: 0, y: parentY + 350 },
    targetPosition: 'top',
    sourcePosition: 'bottom'
  };
  
  // Add to nodeStore immediately
  nodeStore.addNode(newNode);

  // Create edge from PON to Step 1
  const newEdge = {
    id: `e-${ponId}-${newStepId}`,
    source: ponId,
    target: newStepId,
    type: 'smoothstep',
    animated: true
  };

  // Add the new node and edge
  setNodes((nds) => {
    const updatedNodes = [...nds, newNode];
    console.log("Updated nodes array:", updatedNodes.length);
    return updatedNodes;
  });
  
  setEdges((eds) => [...eds, newEdge]);
  
  // Log state after update
  setTimeout(() => {
    logState('Added OLT Node');
  }, 100);
};

export const createSplitterHandler = (
  nodeStore,
  nodes, 
  setNodes, 
  setEdges,
  onNodeUpdate,
  idCounterRef,
  logState,
  flowData
) => {
  return (event, parentId, numChildren, splitterType, originalPonId) => {

   
    const edges = EdgeStore.getAllEdges();

    const childNodes = edges
    .filter(edge => edge.source === parentId)
    .map(edge => edge.target);

    // Delete existing child nodes if present
    if (childNodes.length > 0) {
      console.log(`Deleting ${childNodes.length} existing child nodes:`, childNodes);
      
      // Remove child nodes from state
      setNodes(prevNodes => {
        const filteredNodes = prevNodes.filter(node => !childNodes.includes(node.id));
        console.log(`Removed ${prevNodes.length - filteredNodes.length} nodes from state`);
        return filteredNodes;
      });
      
      // Remove child nodes from store
      childNodes.forEach(childId => {
        nodeStore.removeNode(childId);
      });
      
      // Remove edges connected to child nodes
      const edgesToRemove = edges.filter(edge => 
        childNodes.includes(edge.source) || childNodes.includes(edge.target)
      );
      
      setEdges(prevEdges => {
        const filteredEdges = prevEdges.filter(edge => 
          !edgesToRemove.some(edgeToRemove => edgeToRemove.id === edge.id)
        );
        console.log(`Removed ${prevEdges.length - filteredEdges.length} edges from state`);
        return filteredEdges;
      });
      
      // Remove edges from EdgeStore
      edgesToRemove.forEach(edge => {
        EdgeStore.removeEdge(edge.id);
      });
    }
    
    // Guard against undefined parentId
    if (!parentId) {
      console.error("parentId is undefined");
      return;
    }
    
    // Look for the parent node in both the nodes state and nodeStore
    let parentNode = nodeStore.getNode(parentId);
    
    // If not found in store, try the state
    if (!parentNode) {
      parentNode = nodes.find(node => node.id === parentId);
    }
    
    if (!parentNode) {
      console.error("Parent node not found:", parentId);
      console.log("Available node IDs in store:", Object.keys(nodeStore.nodes));
      console.log("Available node IDs in state:", nodes.map(n => n.id));
      return;
    }
    
    console.log("Found parent node:", parentNode);
    
    const parentLabel = parentNode?.data?.label || '';
    
    // Get PON ID either from the passed parameter or from parent node data
    const ponId = originalPonId || parentNode?.data?.ponId;
    
    // Get FMS and FMS PORT values from parent node
    const parentFms = parentNode?.data?.fms || '';
    const parentFmsPort = parentNode?.data?.fmsPort || '';
    
    // Determine step number from parent node label
    let stepNumber = 1;
    if (parentLabel.includes('Step')) {
      const match = parentLabel.match(/Step (\d+)/);
      if (match) {
        stepNumber = parseInt(match[1]) + 1;
      }
    }

    // Get PON number from parent node label
    let ponPart = '';
    const ponMatch = parentLabel.match(/PON (\d+)/);
    if (ponMatch) {
      ponPart = `PON ${ponMatch[1]}`;
    }

    // Create child nodes based on splitter type
    const letters = 'abcdefghijklmnop'; // For labeling nodes a through p
    
    // Calculate initial positions based on parent position
    const parentX = parentNode.position ? parentNode.position.x : 0;
    const parentY = parentNode.position ? parentNode.position.y : 0;
    const parentWidth = parentNode.width || 200; // Use default width if not specified
    
    const newNodes = [];
    const newEdges = [];
    
    for (let i = 0; i < numChildren; i++) {
      const newId = getNextStepId(idCounterRef);
      console.log("Created child node with ID:", newId);
      const letterLabel = letters[i];
      
      // Calculate horizontal position for node spreading
      const spreadFactor = numChildren <= 1 ? 0 : (i / (numChildren - 1) - 0.5) * 2;
      const xOffset = spreadFactor * parentWidth * numChildren;
      
      const newNode = {
        id: newId,
        type: 'CustomNode',
        data: { 
          label: `Step ${stepNumber}(${letterLabel}) - ${flowData?.olt_name} ${ponPart}`,
          ponId: ponId, // Store original PON ID for reference
          fms: parentFms, // Inherit FMS from parent
          fmsPort: parentFmsPort, // Inherit FMS PORT from parent
          onUpdate: (updatedData) => onNodeUpdate(newId, updatedData),
          // Use a closure to capture the correct node ID
          onSplitterSelect: (event, _, numChildren, splitterType) => {
            console.log("Splitter callback with captured ID:", newId);
            const handler = createSplitterHandler(
              nodeStore, nodes, setNodes, setEdges, onNodeUpdate, idCounterRef, logState, flowData
            );
            handler(event, newId, numChildren, splitterType, ponId);
          },
          onDeviceSelect: (event, _, deviceType) => {
            console.log("Device callback with captured ID:", newId);
            createDeviceHandler(nodeStore, onNodeUpdate, idCounterRef, nodes, setNodes, setEdges, logState, flowData)(event, newId, deviceType);
          },
          id: newId // Explicitly store ID in data as well
        },
        // Initial position below parent with increased vertical spacing
        position: { 
          x: parentX + xOffset, 
          y: parentY + 350
        },
        targetPosition: 'top',
        sourcePosition: 'bottom'
      };
      
      // Add to nodeStore immediately
      nodeStore.addNode(newNode);
      newNodes.push(newNode);

      // Create edge from parent to this node
      const parentEdge = {
        id: `e-${parentId}-${newId}`,
        source: parentId,
        target: newId,
        type: 'smoothstep',
        animated: true
      };
      
      newEdges.push(parentEdge);
    }

    // Add new nodes and edges one by one to ensure they're all processed
    setNodes(prevNodes => {
      console.log("Setting nodes, current count:", prevNodes.length);
      return [...prevNodes, ...newNodes];
    });
    
    setEdges(prevEdges => [...prevEdges, ...newEdges]);
    
    // Update parent node data
    onNodeUpdate(parentId, { splitterType: splitterType });
    
    // Log state after update
    setTimeout(() => {
      logState('Added Splitter Children');
    }, 100);
  };
};

export const createDeviceHandler = (
  nodeStore, 
  onNodeUpdate, 
  idCounterRef, 
  nodes, 
  setNodes, 
  setEdges,
  logState,
  flowData,
  handleOnuDeviceCreate = null
) => {
  return (event, parentId, deviceType) => {
    
    const edges = EdgeStore.getAllEdges();

    const childNodes = edges
    .filter(edge => edge.source === parentId)
    .map(edge => edge.target);

    // Delete existing child nodes if present
    if (childNodes.length > 0) {
      console.log(`Deleting ${childNodes.length} existing child nodes:`, childNodes);
      
      // Remove child nodes from state
      setNodes(prevNodes => {
        const filteredNodes = prevNodes.filter(node => !childNodes.includes(node.id));
        console.log(`Removed ${prevNodes.length - filteredNodes.length} nodes from state`);
        return filteredNodes;
      });
      
      // Remove child nodes from store
      childNodes.forEach(childId => {
        nodeStore.removeNode(childId);
      });
      
      // Remove edges connected to child nodes
      const edgesToRemove = edges.filter(edge => 
        childNodes.includes(edge.source) || childNodes.includes(edge.target)
      );
      
      setEdges(prevEdges => {
        const filteredEdges = prevEdges.filter(edge => 
          !edgesToRemove.some(edgeToRemove => edgeToRemove.id === edge.id)
        );
        console.log(`Removed ${prevEdges.length - filteredEdges.length} edges from state`);
        return filteredEdges;
      });
      
      // Remove edges from EdgeStore
      edgesToRemove.forEach(edge => {
        EdgeStore.removeEdge(edge.id);
      });
    }

    
    if (!parentId) {
      console.error("parentId is undefined");
      return;
    }
    
    // Update parent node data with the selected device type
    onNodeUpdate(parentId, { deviceModel: deviceType });
    
    // Find the parent node
    const parentNode = nodeStore.getNode(parentId) || nodes.find(node => node.id === parentId);
    if (!parentNode) {
      console.error("Parent node not found:", parentId);
      return;
    }
    
    // Get information from parent node
    const parentLabel = parentNode.data.label || '';
    const ponId = parentNode.data.ponId;
    const parentY = parentNode.position?.y || 0;
    const parentX = parentNode.position?.x || 0;
    
    // Get FMS and FMS PORT values from parent node
    const parentFms = parentNode?.data?.fms || '';
    const parentFmsPort = parentNode?.data?.fmsPort || '';
    
    // Extract step and pon info from parent label
    let stepInfo = "";
    let ponInfo = "";
    
    const stepMatch = parentLabel.match(/Step (\d+)(?:\([a-z]\))?/);
    if (stepMatch) {
      stepInfo = stepMatch[0];
    }
    
    const ponMatch = parentLabel.match(/PON (\d+)/);
    if (ponMatch) {
      ponInfo = `PON ${ponMatch[1]}`;
    }
    
    // Generate a unique ID for the new device node
    const newDeviceId = getNextStepId(idCounterRef);
    
    // Determine the specific node type based on device type
    let nodeType = 'CustomNode'; // fallback
    if (deviceType === 'ONU') {
      nodeType = 'OnuNode';
    } else if (deviceType === 'ONT') {
      nodeType = 'OntNode';
    } else if (deviceType === 'Router') {
      nodeType = 'RouterNode';
    } else if (deviceType === 'Switch-P') {
      nodeType = 'SwitchPNode';
    } else if (deviceType === 'Switch-S') {
      nodeType = 'SwitchSNode';
    }
    
    // Create new device node (ONU, ONT, or Router)
    const newDeviceNode = {
      id: newDeviceId,
      type: nodeType, // Use specific node type
      data: {
        label: `${deviceType} - ${stepInfo} ${ponInfo}`,
        ponId: ponId,
        nodeType: 'device',  // Add nodeType to identify this as a device node
        deviceType: deviceType,
        id: newDeviceId,
        fms: parentFms, // Inherit FMS from parent
        fmsPort: parentFmsPort, // Inherit FMS PORT from parent
        // Add device-specific color based on type (for backward compatibility)
        color: deviceType === 'ONU' ? '#27ae60' : 
               deviceType === 'ONT' ? '#8e44ad' : 
               deviceType === 'Router' ? '#3498db' : 
               deviceType === 'Switch-P' ? '#9b59b6' :
               deviceType === 'Switch-S' ? '#e67e22' : '#95a5a6',
        onUpdate: (updatedData) => onNodeUpdate(newDeviceId, updatedData),
        onDelete: (nodeId) => {
          console.log("Delete button clicked for node:", nodeId);
          // Get current state and call deleteNodeHandler
          setNodes((currentNodes) => {
            setEdges((currentEdges) => {
              deleteNodeHandler(nodeId, nodeStore, currentNodes, currentEdges, setNodes, setEdges, logState);
              return currentEdges;
            });
            return currentNodes;
          });
        },
        // Add device creation handler specifically for OnuNode
        ...(deviceType === 'ONU' && handleOnuDeviceCreate && {
          onDeviceCreate: handleOnuDeviceCreate
        })
      },
      position: {
        x: parentX,
        y: parentY + 850  // Position device node below parent with 250px spacing
      },
      targetPosition: 'top',
      sourcePosition: 'bottom'
    };
    
    // Add to nodeStore immediately
    nodeStore.addNode(newDeviceNode);
    
    // Create edge from parent to device
    const newEdge = {
      id: `e-${parentId}-${newDeviceId}`,
      source: parentId,
      target: newDeviceId,
      type: 'smoothstep',
      animated: true
    };
    
    // Add the new node and edge
    setNodes((nds) => {
      const updatedNodes = [...nds, newDeviceNode];
      console.log("Updated nodes array after adding device:", updatedNodes.length);
      return updatedNodes;
    });
    
    setEdges((eds) => [...eds, newEdge]);
    
    // Log state after update 
    setTimeout(() => {
      logState(`Added ${deviceType} Node`);
    }, 100);
  };
};  

export const deleteNodeHandler = (
  nodeId,
  nodeStore,
  nodes,
  edges,
  setNodes,
  setEdges,
  logState
) => {
  console.log("deleteNodeHandler called with nodeId:", nodeId);
  console.log("Available nodes:", nodes.map(n => n.id));
  console.log("Available edges:", edges.map(e => e.id));
  
  if (!nodeId) {
    console.error("Cannot delete node: nodeId is undefined");
    return;
  }

  // Check if the node exists
  const nodeToDelete = nodeStore.getNode(nodeId);
  if (!nodeToDelete) {
    console.error("Node not found for deletion:", nodeId);
    console.log("Available nodes in store:", Object.keys(nodeStore.nodes || {}));
    return;
  }
  
  console.log("Found node to delete:", nodeToDelete);

  // Get all child nodes and edges to delete recursively
  const getAllDescendants = (nodeId) => {
    const descendants = [];
    const edgesToNode = edges.filter(edge => edge.source === nodeId);
    
    // For each edge, add the target node and its descendants
    for (const edge of edgesToNode) {
      const childId = edge.target;
      descendants.push(childId);
      descendants.push(...getAllDescendants(childId));
    }
    
    return descendants;
  };

  // Get all descendant nodes
  const descendantIds = getAllDescendants(nodeId);
  const allNodesToDelete = [nodeId, ...descendantIds];
  
  // Get all edges connected to these nodes
  const edgesToDelete = edges.filter(
    edge => allNodesToDelete.includes(edge.source) || allNodesToDelete.includes(edge.target)
  );
  
  // Remove from NodeStore
  allNodesToDelete.forEach(id => nodeStore.removeNode(id));
  
  // Remove edges from EdgeStore
  edgesToDelete.forEach(edge => {
    EdgeStore.removeEdge(edge.id);
  });
  
  // Update React state
  setNodes(nodes => nodes.filter(node => !allNodesToDelete.includes(node.id)));
  setEdges(edges => edges.filter(edge => 
    !edgesToDelete.includes(edge) &&
    !allNodesToDelete.includes(edge.source) && 
    !allNodesToDelete.includes(edge.target)
  ));
  
  // Log state after deletion
  setTimeout(() => {
    logState('Deleted Node and Descendants');
  }, 100);
};

export const createNodeOnEdge = (
  nodeType,
  edgeId,
  sourceId,
  targetId,
  position,
  idCounterRef,
  nodeStore,
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodeUpdate,
  logState
) => {
  if (!edgeId || !sourceId || !targetId) {
    console.error("Missing required parameters for edge node creation");
    return;
  }

  // Find the source and target nodes
  const sourceNode = nodeStore.getNode(sourceId) || nodes.find(n => n.id === sourceId);
  const targetNode = nodeStore.getNode(targetId) || nodes.find(n => n.id === targetId);

  if (!sourceNode || !targetNode) {
    console.error("Source or target node not found");
    return;
  }

  // Generate new node ID
  const newNodeId = getNextStepId(idCounterRef);

  // Create node data based on type
  let nodeData = {
    id: newNodeId,
    onUpdate: (updatedData) => onNodeUpdate(newNodeId, updatedData)
  };

  // Set label and fields based on node type
  if (nodeType === 'JCBox') {
    nodeData.label = 'JC Box';
    nodeData.nodeType = 'detail';
    nodeData.color = '#f39c12';  // Orange color for JCBox
    // Preset empty fields for JCBox
    nodeData.inputOp = '';
    nodeData.opPrevious = '';
    nodeData.opCurrent = '';
    nodeData.distance = '';
    nodeData.description = '';
  } else if (nodeType === 'Loop') {
    nodeData.label = 'Loop';
    nodeData.nodeType = 'detail';
    nodeData.color = '#2ecc71';  // Green color for Loop
    // Preset empty fields for Loop
    nodeData.distance = '';
    nodeData.loop = '';
    nodeData.description = '';
  }

  // Create the new node
  const newNode = {
    id: newNodeId,
    type: 'CustomNode',
    data: nodeData,
    position: {
      // Use the clicked position or calculate mid-point between source and target
      x: position?.x || (sourceNode.position.x + targetNode.position.x) / 2,
      y: position?.y || (sourceNode.position.y + targetNode.position.y) / 2
    },
    targetPosition: 'top',
    sourcePosition: 'bottom'
  };

  // Add to nodeStore
  nodeStore.addNode(newNode);

  // Create two new edges
  const sourceToNewEdge = {
    id: `e-${sourceId}-${newNodeId}`,
    source: sourceId,
    target: newNodeId,
    type: 'smoothstep',
    animated: true
  };

  const newToTargetEdge = {
    id: `e-${newNodeId}-${targetId}`,
    source: newNodeId,
    target: targetId,
    type: 'smoothstep',
    animated: true
  };

  // Update React state
  setNodes(prevNodes => [...prevNodes, newNode]);
  
  // Replace the old edge with two new edges
  setEdges(prevEdges => {
    const filteredEdges = prevEdges.filter(e => e.id !== edgeId);
    return [...filteredEdges, sourceToNewEdge, newToTargetEdge];
  });

  // Log state after update
  setTimeout(() => {
    logState(`Added ${nodeType} on edge`);
  }, 100);
};

export const getNextStepId = (idCounterRef) => {
  const id = `node-${idCounterRef.current}`;
  idCounterRef.current += 1;
  return id;
};

// Function to create device nodes from ONU device selection
export const createOnuDeviceHandler = (
  nodeStore, 
  onNodeUpdate, 
  idCounterRef, 
  nodes, 
  setNodes, 
  setEdges,
  logState,
  flowData
) => {
  return (parentId, deviceType) => {
    console.log("createOnuDeviceHandler called with parentId:", parentId, "deviceType:", deviceType);
    
    if (!parentId) {
      console.error("parentId is undefined");
      return;
    }
    
    // Find the parent node (OnuNode)
    const parentNode = nodeStore.getNode(parentId) || nodes.find(node => node.id === parentId);
    if (!parentNode) {
      console.error("Parent ONU node not found:", parentId);
      return;
    }
    
    // Get information from parent node
    const parentLabel = parentNode.data.label || '';
    const ponId = parentNode.data.ponId;
    const parentY = parentNode.position?.y || 0;
    const parentX = parentNode.position?.x || 0;
    
    // Get values from parent ONU node to inherit
    const parentFms = parentNode?.data?.fms || '';
    const parentFmsPort = parentNode?.data?.fmsPort || '';
    const parentUserId = parentNode?.data?.userId || '';
    const parentGoogleLocation = parentNode?.data?.currentGoogleLocation || '';
    
    // Generate a unique ID for the new device node
    const newDeviceId = getNextStepId(idCounterRef);
    
    // Determine the specific node type based on device type
    let nodeType = 'CustomNode'; // fallback
    if (deviceType === 'router') {
      nodeType = 'RouterNode';
    } else if (deviceType === 'switch-p') {
      nodeType = 'SwitchPNode';
    } else if (deviceType === 'switch-s') {
      nodeType = 'SwitchSNode';
    }
    
    // Create new device node
    const newDeviceNode = {
      id: newDeviceId,
      type: nodeType, // Use specific node type
      data: {
        label: `${deviceType.toUpperCase()} - ${parentLabel}`,
        ponId: ponId,
        nodeType: 'device',  // Add nodeType to identify this as a device node
        deviceType: deviceType,
        id: newDeviceId,
        fms: parentFms, // Inherit FMS from parent
        fmsPort: parentFmsPort, // Inherit FMS PORT from parent
        userId: parentUserId, // Inherit user ID from parent
        currentGoogleLocation: parentGoogleLocation, // Inherit location from parent
        // Add device-specific color based on type
        color: deviceType === 'router' ? '#3498db' : 
               deviceType === 'switch-p' ? '#9b59b6' :
               deviceType === 'switch-s' ? '#e67e22' : '#95a5a6',
        onUpdate: (updatedData) => onNodeUpdate(newDeviceId, updatedData),
        onDelete: (nodeId) => {
          console.log("Delete button clicked for ONU device node:", nodeId);
          // Get current state and call deleteNodeHandler
          setNodes((currentNodes) => {
            setEdges((currentEdges) => {
              deleteNodeHandler(nodeId, nodeStore, currentNodes, currentEdges, setNodes, setEdges, logState);
              return currentEdges;
            });
            return currentNodes;
          });
        }
      },
      position: {
        x: parentX + 300, // Position to the right of the ONU node
        y: parentY
      },
      targetPosition: 'left',
      sourcePosition: 'right'
    };
    
    // Add to nodeStore immediately
    nodeStore.addNode(newDeviceNode);
    
    // Create edge from ONU to device
    const newEdge = {
      id: `e-${parentId}-${newDeviceId}`,
      source: parentId,
      target: newDeviceId,
      type: 'smoothstep',
      animated: true
    };
    
    // Add the new node and edge
    setNodes((nds) => {
      const updatedNodes = [...nds, newDeviceNode];
      console.log("Updated nodes array after adding device from ONU:", updatedNodes.length);
      return updatedNodes;
    });
    
    setEdges((eds) => [...eds, newEdge]);
    
    // Log state after update
    setTimeout(() => {
      logState(`Added ${deviceType} Node from ONU`);
    }, 100);
  };
}; 