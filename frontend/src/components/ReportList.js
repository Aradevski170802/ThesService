// ReportList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardActions, Button, IconButton } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Map from './Map'; // Import the Map component
import '../styles/ReportList.css';
import { Close as CloseIcon } from '@mui/icons-material'; // Close icon for modal

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports');
        setReports(response.data);
      } catch (err) {
        console.error('Error fetching reports', err);
      }
    };

    fetchReports();
  }, []);

  const handleOpen = async (reportId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/${reportId}`);
      setSelectedReport(response.data);
      setOpen(true);
    } catch (err) {
      console.error('Error fetching report details', err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="report-list-container">
      {/* Left side: Report List */}
      <div className="report-list">
        {reports.map((report) => (
          <Card key={report._id} className="report-card" onClick={() => handleOpen(report._id)}>
            <CardContent>
              <Typography variant="h6">{report.location}</Typography>
              <Typography variant="body2" color="textSecondary">{report.department}</Typography>
              <Typography variant="body1" paragraph>{report.description}</Typography>
              <Typography variant="body2" color="primary">{report.status}</Typography>
            </CardContent>
            {/* <CardActions>
              <Button size="small" color="primary">View Details</Button>
            </CardActions> */}
          </Card>
        ))}
      </div>

      {/* Right side: Map */}
      <div className="map-container">
        <Map reports={reports} />
      </div>

      {/* Modal for report details */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Report Details
          <IconButton onClick={handleClose} color="secondary" style={{ position: 'absolute', right: '10px', top: '10px' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <div>
              <Typography variant="h6">Location: {selectedReport.location}</Typography>
              <Typography variant="body1" paragraph>Description: {selectedReport.description}</Typography>
              <Typography variant="body1" paragraph>Department: {selectedReport.department}</Typography>
              <Typography variant="body1" paragraph>Status: {selectedReport.status}</Typography>
              <Typography variant="body1" paragraph>Emergency: {selectedReport.emergency ? 'Yes' : 'No'}</Typography>
              <Typography variant="body1" paragraph>Anonymous: {selectedReport.anonymous ? 'Yes' : 'No'}</Typography>
            </div>
          )}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
};

export default ReportList;
