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
        "position": {
            "x": 0,
            "y": 0
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        },
        "selected": false
    },
    {
        "id": "2",
        "data": {
            "label": "Node 3"
        },
        "position": {
            "x": -150,
            "y": 100
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        },
        "selected": false
    },
    {
        "id": "3",
        "data": {
            "label": "Node 4"
        },
        "position": {
            "x": 150,
            "y": 100
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        },
        "selected": true
    },
    {
        "id": "4",
        "data": {
            "label": "Node 5"
        },
        "position": {
            "x": -300,
            "y": 200
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "5",
        "data": {
            "label": "Node 6"
        },
        "position": {
            "x": 0,
            "y": 200
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
        "position": {
            "x": -450,
            "y": 200
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
        "position": {
            "x": 150,
            "y": 200
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "8",
        "data": {
            "label": "Node 9"
        },
        "position": {
            "x": 0,
            "y": 200
        },
        "type": "CustomNode",
        "measured": {
            "width": 141,
            "height": 66
        }
    },
    {
        "id": "9",
        "data": {
            "label": "Node 10"
        },
        "position": {
            "x": 300,
            "y": 200
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
        "id": "e2-4",
        "source": "2",
        "target": "4",
        "animated": true
    },
    {
        "id": "e2-5",
        "source": "2",
        "target": "5",
        "animated": true
    },
    {
        "id": "e2-6",
        "source": "2",
        "target": "6",
        "animated": true
    },
    {
        "id": "e2-7",
        "source": "2",
        "target": "7",
        "animated": true
    },
    {
        "id": "e3-8",
        "source": "3",
        "target": "8",
        "animated": true
    },
    {
        "id": "e3-9",
        "source": "3",
        "target": "9",
        "animated": true
    }
]