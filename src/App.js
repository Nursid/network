import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlowProvider,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';

const initialNodes = [
  {
    id: '1',
    data: { label: 'Hello', onSelect: (e) => {} }, // Initial onSelect can be empty
    position: { x: 0, y: 0 },
    type: 'CustomNode',
  },
];

const initialEdges = [];

function App() {
  const nodeTypes = useMemo(() => ({ CustomNode: CustomNode }), []);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [fisrtNode, setFirstNode] = useState('1')
  let idCounter = initialNodes.length + 1;

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );


  const addNode = useCallback((event, parentId) => {
    
    const selectedValue = event.target.value;
    const numChildren = selectedValue === '1/2' ? 2 :
                        selectedValue === '1/4' ? 4 :
                        selectedValue === '1/8' ? 8 :
                        selectedValue === '1/16' ? 16 : 0;

    const newNodes = [];
    const newEdges = [];

    // Helper function to get the parent node's position
    const getParentNode = (nodes) => {
        return nodes.find(node => node.id === parentId);
    };
    let jReset = false;  // Flag to control j reset

    const createNewNodes = (parentY, parentId2, parentX) => {
    
      // console.log(parentId2 === fisrtNode, parentId2, fisrtNode)
      let j= 0
        for (let i = 0; i < numChildren; i++) {

           // Check if j has not been reset and parentId2 is not the first node
          if (!jReset && parentId2 !== fisrtNode) {
            j = 0;
            jReset = true;  // Set the flag to prevent future resets
        }
        
           const xOffset = (i % 2 === 0 ? -150 : 150) * (Math.floor(j / 2) + 1) + parentX;
            const newNode = {
                id: `${idCounter++}`,
                data: { label: `Node ${idCounter}`, onSelect: (e) => addNode(e, newNode.id) },
                position: { x: xOffset, y: parentY + 100 }, // Adjust y position for children
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

            j++

        // Reset j only once if parentId2 is not the first node
        

        }
    };

    setNodes((nds) => {
        const updatedNodes = [...nds];
        const parentNode = getParentNode(updatedNodes);
        const parentYPosition = parentNode && parentNode.id === "1" ? 0 : parentNode.position.y;
        const parentXPosition = parentNode && parentNode.id === "1" ? 0 : parentNode.position.x;
        createNewNodes(parentYPosition, parentNode.id, parentXPosition);

        return updatedNodes.concat(newNodes);
    });

    setEdges((eds) => eds.concat(newEdges));
    setFirstNode(parentId)
}, []); // Removed nodes from the dependency array



  // Assign addNode function to the first node's onSelect
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
  useMemo(() => {
    setInitialOnSelect();
  }, [setInitialOnSelect]);


  console.log("fisrtNode----", nodes)
  console.log("edges----", edges)
  

  return (
    <ReactFlowProvider>
      <div style={{ height: '100vh', width: '100vw' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
