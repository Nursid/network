import React, { useState,useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Box,
  Divider
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../../../../config";

const ComplaintForm = ({ open, onClose, onSubmit, loading, customerData }) => {
  const [logs, setLogs] = useState([])
  const [formData, setFormData] = useState({
    customer_id: customerData?.customer_id,
    subject: "",
    description: "",
    category: "",
    priority: "",
    assignedTo: "",

    taskTitle: "",
    taskDescription: "",
    taskType: "",
    taskDate: "",
    taskAssignTo: "",
    complaintDate: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      if (!customerData?.customer_id) return;
  
      try {
        const res = await axios.get(
          `${API_URL}/api/complain/logs/${customerData.customer_id}`
        );
        setLogs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setLogs([]);
      }
    };
  
    fetchLogs();
  }, [customerData?.customer_id]);

  useEffect(() => {
    if (customerData?.customer_id) {
      setFormData(prev => ({
        ...prev,
        customer_id: customerData.customer_id
      }));
    }
  }, [customerData]);
  
  
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        Customer Complaint & Task Management
      </DialogTitle>

      <DialogContent>
        {/* ================= Customer Details ================= */}
        <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Customer Details
          </Typography>
          <Typography>Name: {customerData?.name || "-"}</Typography>
          <Typography>Username: {customerData?.username || "-"}</Typography>
        </Box>

        {/* ================= Main Layout ================= */}
        <Grid container spacing={2}>
          {/* -------- Left Column : Logs -------- */}
          <Grid item xs={12} md={3}>
            <Box sx={{ border: "1px solid #ddd", p: 2, height: "100%", borderRadius: 1 }}>
                <Typography fontWeight={600}>Complaint & Task Logs</Typography>
                <Divider sx={{ my: 1 }} />
                {logs.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    No logs available
                </Typography>
                ) : (
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {logs.map((log, index) => (
                    <Box key={index} component="li">
                        <strong>{new Date(log.date).toLocaleDateString()}</strong> – {log.text}
                    </Box>
                    ))}
                </Box>
                )}

            </Box>
            </Grid>


          {/* -------- Middle Column : Register Complaint -------- */}
          <Grid item xs={12} md={4}>
            <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1 }}>
              <Typography fontWeight={600}>Register Complaint</Typography>

              <TextField
                fullWidth
                label="Complaint Title"
                 size="small"
                sx={{ mt: 2 }}
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
              />

              <TextField
                fullWidth
                
                label="Complaint Description"
                multiline
                rows={3}
                sx={{ mt: 2 }}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                <InputLabel id="category-label">Category</InputLabel>

                <Select
                    labelId="category-label"
                    id="category"
                    value={formData.category}
                    label="Category"
                    onChange={(e) => handleChange("category", e.target.value)}
                >
                    <MenuItem value="hardware">Hardware</MenuItem>
                    <MenuItem value="software">Software</MenuItem>
                </Select>
                </FormControl>


                <TextField
                fullWidth
                type="date"
                size="small"
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
                label="Date"
                value={formData.complaintDate || ""}
                onChange={(e) => handleChange("complaintDate", e.target.value)}
                />


                <TextField
                fullWidth
                label="Assigned To"
                size="small"
                sx={{ mt: 2 }}
                value={formData.assignedTo}
                onChange={(e) => handleChange("assignedTo", e.target.value)}
                />


              <FormControl  size="small"  fullWidth sx={{ mt: 2 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                  label="Priority"
            
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* -------- Right Column : Register Task -------- */}
          <Grid item xs={12} md={4}>
            <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1 }}>
              <Typography fontWeight={600}>Register Task</Typography>

              <TextField
                fullWidth
                label="Task Title"
                sx={{ mt: 2 }}
                 size="small"
                value={formData.taskTitle}
                onChange={(e) => handleChange("taskTitle", e.target.value)}
              />

              <TextField
                fullWidth
                label="Task Description"
                
                multiline
                rows={3}
                sx={{ mt: 2 }}
                value={formData.taskDescription}
                onChange={(e) => handleChange("taskDescription", e.target.value)}
              />

                <TextField
                fullWidth
                type="date"
                size="small"
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
                label="Date"
                value={formData.taskDate}
                onChange={(e) => handleChange("taskDate", e.target.value)}
                />


              <TextField
                fullWidth
                label="Assigned To"
                sx={{ mt: 2 }}
                 size="small"
                 value={formData.taskAssignTo}
                 onChange={(e) => handleChange("taskAssignTo", e.target.value)}
              />

              <FormControl  size="small"  fullWidth sx={{ mt: 2 }}>
                <InputLabel>Task Type</InputLabel>
                <Select
                  value={formData.taskType}
                  onChange={(e) => handleChange("taskType", e.target.value)}
                  label="Task Type"
                >
                  <MenuItem value="visit">Visit</MenuItem>
                  <MenuItem value="call">Call</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      {/* ================= Actions ================= */}
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          Submit
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComplaintForm;
