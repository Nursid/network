import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Button } from 'reactstrap';
import '@xyflow/react/dist/style.css';
 
 
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
 
const nodeWidth = 200;
const nodeHeight = 150;
 

 
const Flow = () => {

  const nodeTypes = useMemo(() => ({ CustomNode: CustomNode }), []);
  const [initialNodes, setInitialNodes] = useState([{
    id: '1',
    data: { label: 'EPON : LN00001', onSelect: (e) => {} },
    type: 'CustomNode',
    style: { 
      backgroundColor: '#e74c3c', // Set your background color
      border: 'none',             // Remove border
      borderRadius: '10px'        // Set border radius
   }
  }])

  const [initialEdges, setInitialEdges] = useState([])
  const [searchId, setSearchId] = useState(''); // State for search input
  const [highlightedNodes, setHighlightedNodes] = useState(new Set()); // State for highlighted nodes

  const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });
   
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
   
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
   
    dagre.layout(dagreGraph);
   
    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const newNode = {
        ...node,
        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
   
      return newNode;
    });
   
    return { nodes: newNodes, edges };
  };
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [initialEdges, initialNodes]);

  
  let idCounter = initialNodes.length + 1;

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [],
  );


  const addNode = useCallback((event, parentId) => {
    const selectedValue = event.target.value;
    const numChildren = selectedValue === '1/2' ? 2 :
                        selectedValue === '1/4' ? 4 :
                        selectedValue === '1/8' ? 8 :
                        selectedValue === '1/16' ? 16 : 0;

    const newNodes = [];
    const newEdges = [];

   
    const createNewNodes = () => {
  
        for (let i = 0; i < numChildren; i++) {

            const newNode = {
                id: `${idCounter++}`,
                data: { label: `PON ${idCounter}`, onSelect: (e) => addNode(e, newNode.id),
                  onUpdate: (updatedData) => onNodeUpdate(newNode.id, updatedData),
                 },
                type: 'CustomNode',
            };

            newNodes.push(newNode);

            const newEdge = {
                id: `e${parentId}-${newNode.id}`,
                source: parentId,
                target: newNode.id,
                type: 'smoothstep',
                animated: true,
            };
            newEdges.push(newEdge);
        }
    };

    createNewNodes();

   
      // Spread individual nodes and edges into the state
      setInitialNodes((prevNodes) => [...prevNodes, ...newNodes]);
      setInitialEdges((prevEdges) => [...prevEdges, ...newEdges]);

}, []);


  const setInitialOnSelect = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          return {
            ...node,
            data: { ...node.data, onSelect: (e) => addNode(e, node.id) },
          };
        }
        return node;
      })
    );
  }, [addNode]);

  // Call setInitialOnSelect once when the component mounts
  useEffect(() => {
    setInitialOnSelect();
  }, []);

  const onNodeUpdate = useCallback((id, updatedData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...updatedData } }
          : node
      )
    );
  });
  

  function getFlow(startNodeId, nodes, edges) {
    // Initialize visited nodes and result arrays for nodes and edges in the flow
    const visitedNodes = new Set();
    const flowNodes = [];
    const flowEdges = [];

    // Helper function to perform DFS
    function dfs(nodeId) {
        // If the node has already been visited, skip it
        if (visitedNodes.has(nodeId)) return;
        
        // Mark the current node as visited
        visitedNodes.add(nodeId);

        // Find the node by ID and add it to the flowNodes list
        const node = nodes.find((n) => n.id === nodeId);
        if (node) flowNodes.push(node);

        // Find edges where the current node is the source, to continue traversal
        const connectedEdges = edges.filter((e) => e.source === nodeId);

        // Add these edges to the flowEdges list and perform DFS on each target
        connectedEdges.forEach((edge) => {
            flowEdges.push(edge);
            dfs(edge.target); // Recursively traverse to the target node
        });
    }

    // Start DFS from the startNodeId
    dfs(startNodeId);

    return { flowNodes, flowEdges };
  }

  const searchConnectedNodes = () =>{
    const { flowNodes, flowEdges } = getFlow(searchId, nodes, edges);
    setEdges(flowEdges)
    setNodes(flowNodes)

    console.log("Nodes in the flow starting from node ID 3:", flowNodes);
    console.log("Edges in the flow starting from node ID 3:", flowEdges);
    
  }
// Get the flow starting from the specified node

  const handleSearchChange = (e) => setSearchId(e.target.value);


  return (
 <div style={{ height: '100vh', width: '100%', backgroundColor: '#34495e' }}>
  <input 
        type="text" 
        placeholder="Enter Node ID" 
        value={searchId} 
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <Button onClick={searchConnectedNodes}>Search</Button>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      nodeTypes={nodeTypes}
      defaultPosition={[0, 0]}   
    >
 <Background />
 <Controls />
    </ReactFlow>
    </div>
  );
};

export default Flow;
