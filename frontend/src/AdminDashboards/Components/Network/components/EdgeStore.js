// EdgeStore.js - Central store for tracking edges outside of React state

// Create a global store to track edges when React state might not be in sync
const EdgeStore = {
  edges: {},
  addEdge: function(edge) {
    this.edges[edge.id] = edge;
  },
  getEdge: function(id) {
    return this.edges[id];
  },
  removeEdge: function(id) {
    delete this.edges[id];
  },
  getAllEdges: function() {
    return Object.values(this.edges);
  },
  clear: function() {
    this.edges = {};
  },
  updateEdge: function(id, updatedData) {
    if (this.edges[id]) {
      this.edges[id] = { ...this.edges[id], ...updatedData };
    }
  },
  // Helper methods for edge management
  getEdgesBySource: function(sourceId) {
    return Object.values(this.edges).filter(edge => edge.source === sourceId);
  },
  getEdgesByTarget: function(targetId) {
    return Object.values(this.edges).filter(edge => edge.target === targetId);
  },
  getEdgesByNode: function(nodeId) {
    return Object.values(this.edges).filter(edge => 
      edge.source === nodeId || edge.target === nodeId
    );
  },
  removeEdgesByNode: function(nodeId) {
    const edgesToRemove = this.getEdgesByNode(nodeId);
    edgesToRemove.forEach(edge => {
      delete this.edges[edge.id];
    });
    return edgesToRemove;
  }
};

export default EdgeStore; 