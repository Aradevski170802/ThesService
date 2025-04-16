import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Divider, Button } from '@mui/material';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Map from './Map'; // Assuming Map component is used for displaying reports on a map
import '../styles/ReportList.css';

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
      <div className="report-list">
        {reports.map((report) => (
          <Card key={report._id} className="report-card" onClick={() => handleOpen(report._id)}>
            <CardContent>
              <Typography variant="h6">
                Location: {report.location && typeof report.location === 'object'
                  ? `Lat: ${report.location.lat}, Lon: ${report.location.lon}`
                  : report.location
                }
              </Typography>
              {/* Other fields can also be handled similarly */}
              <Typography variant="body2" color="textSecondary">
                Status: {report.status}
              </Typography>
            </CardContent>
            <Divider />
          </Card>
        ))}
      </div>

      <div className="map-container">
        <Map reports={reports} />
      </div>

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
              <Typography variant="h6">
                Location: {`Lat: ${selectedReport.location.lat}, Lon: ${selectedReport.location.lon}`}
              </Typography>
              <Typography variant="body1" paragraph>
                Description: {selectedReport.description}
              </Typography>
              {/* Render any other details in a similar way */}
              <Typography variant="body1" paragraph>
                Status: {selectedReport.status}
              </Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
        Refresh
      </Button>
    </div>
  );
};

export default ReportList;
