const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';
 
// export const initialNodes = [
//   {
//     id: '1',
//     type: 'input',
//     data: { label: 'input' },
//     position,
//   },
//   {
//     id: '2',
//     data: { label: 'node 2' },
//     position,
//   },
//   {
//     id: '2a',
//     data: { label: 'node 2a' },
//     position,
//   },
//   {
//     id: '2b',
//     data: { label: 'node 2b' },
//     position,
//   },
//   {
//     id: '2c',
//     data: { label: 'node 2c' },
//     position,
//   },
//   {
//     id: '2d',
//     data: { label: 'node 2d' },
//     position,
//   },
//   {
//     id: '3',
//     data: { label: 'node 3' },
//     position,
//   },
//   {
//     id: '4',
//     data: { label: 'node 4' },
//     position,
//   },
//   {
//     id: '5',
//     data: { label: 'node 5' },
//     position,
//   },
//   {
//     id: '6',
//     type: 'output',
//     data: { label: 'output' },
//     position,
//   },
//   { id: '7', type: 'output', data: { label: 'output' }, position },
// ];
 
// export const initialEdges = [
//   { id: 'e12', source: '1', target: '2', type: edgeType, animated: true },
//   { id: 'e13', source: '1', target: '3', type: edgeType, animated: true },
//   { id: 'e22a', source: '2', target: '2a', type: edgeType, animated: true },
//   { id: 'e22b', source: '2', target: '2b', type: edgeType, animated: true },
//   { id: 'e22c', source: '2', target: '2c', type: edgeType, animated: true },
//   { id: 'e2c2d', source: '2c', target: '2d', type: edgeType, animated: true },
//   { id: 'e45', source: '4', target: '5', type: edgeType, animated: true },
//   { id: 'e56', source: '5', target: '6', type: edgeType, animated: true },
//   { id: 'e57', source: '5', target: '7', type: edgeType, animated: true },
// ];


// export const initialNodes = [
//     {
//         "id": "1",
//         "data": {
//             "label": "Hello"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "2",
//         "data": {
//             "label": "Node 3"
//         },
//         position,
//     },
//     {
//         "id": "3",
//         "data": {
//             "label": "Node 4"
//         },
//         position,
//     },
//     {
//         "id": "4",
//         "data": {
//             "label": "Node 5"
//         },
//         position,
//     },
//     {
//         "id": "5",
//         "data": {
//             "label": "Node 6"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "6",
//         "data": {
//             "label": "Node 7"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "7",
//         "data": {
//             "label": "Node 8"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "8",
//         "data": {
//             "label": "Node 9"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "9",
//         "data": {
//             "label": "Node 10"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "10",
//         "data": {
//             "label": "Node 11"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "11",
//         "data": {
//             "label": "Node 12"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "12",
//         "data": {
//             "label": "Node 13"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "13",
//         "data": {
//             "label": "Node 14"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "14",
//         "data": {
//             "label": "Node 15"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "15",
//         "data": {
//             "label": "Node 16"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "16",
//         "data": {
//             "label": "Node 17"
//         },
//         type: "input",
//         position,
//     },
//     {
//         "id": "17",
//         "data": {
//             "label": "Node 18"
//         },
//         type: "input",
//         position,
//     }
// ]

// export const initialEdges = [
//     {
//         "id": "e1-2",
//         "source": "1",
//         "target": "2",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e1-3",
//         "source": "1",
//         "target": "3",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e1-4",
//         "source": "1",
//         "target": "4",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e1-5",
//         "source": "1",
//         "target": "5",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e2-6",
//         "source": "2",
//         "target": "6",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e2-7",
//         "source": "2",
//         "target": "7",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e2-8",
//         "source": "2",
//         "target": "8",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e2-9",
//         "source": "2",
//         "target": "9",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e4-10",
//         "source": "4",
//         "target": "10",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e4-11",
//         "source": "4",
//         "target": "11",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e4-12",
//         "source": "4",
//         "target": "12",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e4-13",
//         "source": "4",
//         "target": "13",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e4-14",
//         "source": "4",
//         "target": "14",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e4-15",
//         "source": "4",
//         "target": "15",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e4-16",
//         "source": "4",
//         "target": "16",
//         "animated": true,
//         type: edgeType
//     },
//     {
//         "id": "e4-17",
//         "source": "4",
//         "target": "17",
//         "animated": true,
//         type: edgeType
//     }
// ]


export const initialNodes = [
    {
        "id": "1",
        "data": {
            "label": "Hello"
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        },
        "selected": false,
        "dragging": false
    },
    {
        "id": "2",
        "data": {
            "label": "Node 3"
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "3",
        "data": {
            "label": "Node 4"
        },
        
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "4",
        "data": {
            "label": "Node 5"
        },
        
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        },
        "selected": false
    },
    {
        "id": "5",
        "data": {
            "label": "Node 6"
        },
        
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "6",
        "data": {
            "label": "Node 7"
        },
        
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "7",
        "data": {
            "label": "Node 8"
        },
       
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        },
        "selected": false,
        "dragging": false
    },
    {
        "id": "8",
        "data": {
            "label": "Node 9"
        },
        
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        },
        "selected": false,
        "dragging": false
    },
    {
        "id": "9",
        "data": {
            "label": "Node 10"
        },
        
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        },
        "selected": false
    },
    {
        "id": "10",
        "data": {
            "label": "Node 11"
        },
        
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "11",
        "data": {
            "label": "Node 12"
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        },
        "selected": false
    },
    {
        "id": "12",
        "data": {
            "label": "Node 13"
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "13",
        "data": {
            "label": "Node 14"
        },
        
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "14",
        "data": {
            "label": "Node 15"
        },
       
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "15",
        "data": {
            "label": "Node 16"
        },
       
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        },
        "selected": false,
        "dragging": false
    },
    {
        "id": "16",
        "data": {
            "label": "Node 17"
        },
        
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "17",
        "data": {
            "label": "Node 18"
        },
       
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "18",
        "data": {
            "label": "Node 19"
        },
        
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "19",
        "data": {
            "label": "Node 20"
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    }
]



export const initialEdges = [
    {
        "id": "e1-2",
        "source": "1",
        "target": "2",
        "animated": true
    },
    {
        "id": "e1-3",
        "source": "1",
        "target": "3",
        "animated": true
    },
    {
        "id": "e1-4",
        "source": "1",
        "target": "4",
        "animated": true
    },
    {
        "id": "e1-5",
        "source": "1",
        "target": "5",
        "animated": true
    },
    {
        "id": "e4-6",
        "source": "4",
        "target": "6",
        "animated": true
    },
    {
        "id": "e4-7",
        "source": "4",
        "target": "7",
        "animated": true
    },
    {
        "id": "e4-8",
        "source": "4",
        "target": "8",
        "animated": true
    },
    {
        "id": "e4-9",
        "source": "4",
        "target": "9",
        "animated": true
    },
    {
        "id": "e7-10",
        "source": "7",
        "target": "10",
        "animated": true
    },
    {
        "id": "e7-11",
        "source": "7",
        "target": "11",
        "animated": true
    },
    {
        "id": "e7-12",
        "source": "7",
        "target": "12",
        "animated": true
    },
    {
        "id": "e7-13",
        "source": "7",
        "target": "13",
        "animated": true
    },
    {
        "id": "e8-14",
        "source": "8",
        "target": "14",
        "animated": true
    },
    {
        "id": "e8-15",
        "source": "8",
        "target": "15",
        "animated": true
    },
    {
        "id": "e9-16",
        "source": "9",
        "target": "16",
        "animated": true
    },
    {
        "id": "e9-17",
        "source": "9",
        "target": "17",
        "animated": true
    },
    {
        "id": "e9-18",
        "source": "9",
        "target": "18",
        "animated": true
    },
    {
        "id": "e9-19",
        "source": "9",
        "target": "19",
        "animated": true
    }
]