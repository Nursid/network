import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';

import './index.css';
import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

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
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

const Flow = () => {
  const [initialNodes, setInitialNodes] = useState([
    {
      id: '1',
      data: { label: 'Hello', onSelect: (e) => {} },
      position: { x: 0, y: 0 },
      type: 'CustomNode',
    },
  ]);

  const [initialEdges, setInitialEdges] = useState([]);
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const nodeTypes = useMemo(() => ({ CustomNode: CustomNode }), []);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    []
  );

  const [fisrtNode, setFirstNode] = useState('1');
  let idCounter = initialNodes.length + 1;

  const addNode = useCallback(
    (event, parentId) => {
      const selectedValue = event.target.value;
      const numChildren =
        selectedValue === '1/2'
          ? 2
          : selectedValue === '1/4'
          ? 4
          : selectedValue === '1/8'
          ? 8
          : selectedValue === '1/16'
          ? 16
          : 0;

      const newNodes = [];
      const newEdges = [];

      const createNewNodes = () => {
        for (let i = 0; i < numChildren; i++) { 
          const newNode = {
            id: `${idCounter++}`,
            data: {
              label: `Node ${idCounter}`,
              onSelect: (e) => addNode(e, newNode.id),
            },
            position: { x: 0, y: 0 },
            type: 'CustomNode',
          };

          newNodes.push(newNode);

          const newEdge = {
            id: `e${parentId}-${newNode.id}`,
            source: parentId,
            target: newNode.id,
            animated: true,
          };
          newEdges.push(newEdge);
        }
      };

      // setNodes((nds) => {
      //   const updatedNodes = [...nds];
      //   const parentNode = getParentNode(updatedNodes);
      //   const parentYPosition =
      //     parentNode && parentNode.id === '1' ? 0 : parentNode.position.y;
      //   const parentXPosition =
      //     parentNode && parentNode.id === '1' ? 0 : parentNode.position.x;
      //   createNewNodes(parentYPosition, parentNode.id, parentXPosition);

      //   return updatedNodes.concat(newNodes);
      // });

      // setEdges((eds) => eds.concat(newEdges));
      setFirstNode(parentId);

      setInitialNodes((prev) => prev.concat(newNodes));
      setInitialEdges((prev) => prev.concat(newEdges));
      createNewNodes();

      const { nodes: updatedNodes, edges: updatedEdges } = getLayoutedElements(
        initialNodes.concat(newNodes),
        initialEdges.concat(newEdges)
      );

      // setNodes(updatedNodes);
      setNodes((nds) => nds.concat(updatedNodes));
      setEdges((eds) => eds.concat(updatedEdges));
    },
    [initialNodes, initialEdges]
  );

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

  useMemo(() => {
    setInitialOnSelect();
  }, [setInitialOnSelect]);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        nodeTypes={nodeTypes}
      />
    </div>
  );
};

export default Flow;
