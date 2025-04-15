// ReportDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // useParams to fetch ID from the URL
import axios from 'axios';
import { Container, Typography, Box, Button } from '@mui/material';

const ReportDetails = () => {
  const { id } = useParams();  // Access the report ID from the URL
  const [report, setReport] = useState(null);
  const navigate = useNavigate();  // Navigate back to report list

  // Fetch report details by ID when component mounts
  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reports/${id}`);
        setReport(response.data);
      } catch (err) {
        console.error('Error fetching report details', err);
      }
    };

    fetchReportDetails();
  }, [id]);

  // If report is not yet fetched
  if (!report) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Box sx={{ paddingTop: '50px' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Report Details
        </Typography>
        <Typography variant="h6" gutterBottom>Location: {report.location}</Typography>
        <Typography variant="body1" paragraph>Description: {report.description}</Typography>
        <Typography variant="body1" paragraph>Department: {report.department}</Typography>
        <Typography variant="body1" paragraph>Status: {report.status}</Typography>
        <Typography variant="body1" paragraph>Emergency: {report.emergency ? 'Yes' : 'No'}</Typography>
        <Typography variant="body1" paragraph>Anonymous: {report.anonymous ? 'Yes' : 'No'}</Typography>

        {/* Display photos if available */}
        {report.photos && report.photos.length > 0 && (
          <div>
            <Typography variant="body1" paragraph>Photos:</Typography>
            {report.photos.map((photo, index) => (
              <img key={index} src={`http://localhost:5000/${photo}`} alt={`report-photo-${index}`} style={{ width: '100%', marginBottom: '10px' }} />
            ))}
          </div>
        )}

        {/* Back to Reports Button */}
        <Button variant="contained" color="primary" onClick={() => navigate('/reports')}>Back to Report List</Button>
      </Box>
    </Container>
  );
};

export default ReportDetails;
