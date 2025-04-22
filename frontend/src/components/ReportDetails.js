import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Button } from '@mui/material';

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reports/${id}`
        );
        setReport(response.data);
      } catch (err) {
        console.error('Error fetching report details', err);
      }
    };
    fetchReportDetails();
  }, [id]);

  if (!report) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Box sx={{ paddingTop: '50px' }}>
        <Typography variant="h5" gutterBottom>
          Report Details
        </Typography>
        <Typography variant="h6" gutterBottom>
          Location: {report.location.lat}, {report.location.lon}
        </Typography>
        <Typography variant="body1" paragraph>
          Description: {report.description}
        </Typography>
        <Typography variant="body1" paragraph>
          Category: {report.category}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Status:</strong> {report.status}
        </Typography>
        <Typography variant="body1" paragraph>
          Emergency: {report.emergency ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body1" paragraph>
          Anonymous: {report.anonymous ? 'Yes' : 'No'}
        </Typography>

        {report.photos?.length > 0 && (
          <Box>
            <Typography variant="body1" paragraph>Photos:</Typography>
            {report.photos.map((photo, idx) => (
              <img
                key={idx}
                src={`http://localhost:5000/api/reports/photo/${photo}`}
                alt={`report-photo-${idx}`}
                style={{ width: '100%', marginBottom: 10 }}
              />
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          onClick={() => navigate('/reports')}
        >
          Back to Reports
        </Button>
      </Box>
    </Container>
  );
};

export default ReportDetails;
