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

import './index.css';
import '@xyflow/react/dist/style.css';
 
 
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
 
const nodeWidth = 172;
const nodeHeight = 36;
 

 
const Flow = () => {

  const nodeTypes = useMemo(() => ({ CustomNode: CustomNode }), []);
  const [initialNodes, setInitialNodes] = useState([{
    id: '1',
    data: { label: 'Root : M0124', onSelect: (e) => {} },
    type: 'CustomNode',
    style: { 
      backgroundColor: '#e74c3c', // Set your background color
      border: 'none',             // Remove border
      borderRadius: '10px'        // Set border radius
   }
  }])

  const [initialEdges, setInitialEdges] = useState([])

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
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);
 
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
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
                data: { label: `Node ${idCounter}`, onSelect: (e) => addNode(e, newNode.id) },
                type: 'CustomNode',
            };

            newNodes.push(newNode);

            const newEdge = {
                id: `e${parentId}-${newNode.id}`,
                source: parentId,
                target: newNode.id,
                // type: 'smoothstep',
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
        console.log(node.id === '1')
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

  
 
  return (
 <div style={{ height: '100vh', width: '100vw', backgroundColor: '#34495e' }}>
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