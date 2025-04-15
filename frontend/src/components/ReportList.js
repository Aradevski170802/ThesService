import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ReportList.css';

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
    <div className="report-list">
      <ul>
        {reports.map((report) => (
          <li key={report._id} className="report-item">
            <div><strong>Location:</strong> {report.location}</div>
            <div><strong>Status:</strong> {report.status}</div>
          </li>
        ))}
      </ul>
      <button onClick={() => window.location.reload()} className="btn">Refresh</button>
    </div>
  );
};

export default ReportList;
