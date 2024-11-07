import React, { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: 'horizontal-1',
    sourcePosition: 'bottom',
    type: 'input',
    data: { label: 'Input' },
    position: { x: 0, y: 80 },
  },
  {
    id: 'horizontal-2',
    sourcePosition: 'bottom',
    targetPosition: 'top',
    data: { label: 'A Node' },
    position: { x: 100, y: 172 },
  },
  {
    id: 'horizontal-3',
    sourcePosition: 'bottom',
    targetPosition: 'top',
    data: { label: 'Node 3' },
    position: { x: -100, y: 172 },
  },
  {
    id: 'horizontal-4',
    sourcePosition: 'bottom',
    targetPosition: 'top',
    data: { label: 'Node 4' },
    position: { x: 300, y: 172 },
  },
  {
    id: 'horizontal-5',
    sourcePosition: 'bottom',
    targetPosition: 'top',
    data: { label: 'Node 5' },
    position: { x: -300, y: 172 },
  },
  // {
  //   id: 'horizontal-5',
  //   sourcePosition: 'top',
  //   targetPosition: 'right',
  //   data: { label: 'Node 5' },
  //   position: { x: 500, y: 100 },
  // },
  // {
  //   id: 'horizontal-6',
  //   sourcePosition: 'bottom',
  //   targetPosition: 'left',
  //   data: { label: 'Node 6' },
  //   position: { x: 500, y: 230 },
  // },
  // {
  //   id: 'horizontal-7',
  //   sourcePosition: 'bottom',
  //   targetPosition: 'top',
  //   data: { label: 'Node 7' },
  //   position: { x: 750, y: 50 },
  // },
  // {
  //   id: 'horizontal-8',
  //   sourcePosition: 'bottom',
  //   targetPosition: 'top',
  //   data: { label: 'Node 8' },
  //   position: { x: 750, y: 300 },
  // },
];

const initialEdges = [
  {
    id: 'horizontal-e1-2',
    source: 'horizontal-1',
    type: 'smoothstep',
    target: 'horizontal-2',
    animated: true,
  },
  {
    id: 'horizontal-e1-3',
    source: 'horizontal-1',
    type: 'smoothstep',
    target: 'horizontal-3',
    animated: true,
  },
  {
    id: 'horizontal-e1-4',
    source: 'horizontal-1',
    type: 'smoothstep',
    target: 'horizontal-4',
    animated: true,
  },
  {
    id: 'horizontal-e3-5',
    source: 'horizontal-1',
    type: 'smoothstep',
    target: 'horizontal-5',
    animated: true,
  },
  {
    id: 'horizontal-e3-6',
    source: 'horizontal-1',
    type: 'smoothstep',
    target: 'horizontal-5',
    animated: true,
  },
];

const HorizontalFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    [],
  );
  
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        // attributionPosition="bottom-left"
      />
    </div>
  );
};

export default HorizontalFlow;