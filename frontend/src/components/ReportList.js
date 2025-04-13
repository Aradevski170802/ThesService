// frontend/src/components/ReportList.js
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import axios from 'axios';

const ReportList = () => {
  const [reports, setReports] = useState([]);

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

  return (
    <div>
      <List>
        {reports.map((report) => (
          <div key={report._id}>
            <ListItem>
              <ListItemText
                primary={`Location: ${report.location}`}
                secondary={`Status: ${report.status}`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
        Refresh
      </Button>
    </div>
  );
};

export default ReportList;
