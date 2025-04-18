// frontend/src/components/ReportList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Map from './Map';
import '../styles/ReportList.css';

const BASE = 'http://localhost:5000';
const STEPS = ['Registered', 'Seen', 'Completed'];

// **Updated** helper: take first two comma‐segments
const getSimpleAddress = (full) => {
  if (!full) return '';
  const parts = full.split(',').map(s => s.trim());
  return parts.length > 1
    ? `${parts[0]}, ${parts[1]}`
    : parts[0];
};

const ReportList = () => {
  const [reports, setReports]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    axios.get(`${BASE}/api/reports`)
      .then(r => setReports(r.data))
      .catch(console.error);
  }, []);

  const handleOpen = (id) => {
    axios.get(`${BASE}/api/reports/${id}`)
      .then(r => {
        setSelected(r.data);
        setOpen(true);
      })
      .catch(console.error);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <div className="report-list-container" style={{ display: 'flex' }}>
      {/* Left: list */}
      <div className="report-list" style={{ width: '40%', padding: 16 }}>
        {reports.map(r => {
          const thumbId = r.photos?.[0];
          const thumb   = thumbId
            ? `${BASE}/api/reports/photo/${thumbId}`
            : null;
          const activeStep = Math.max(0, STEPS.indexOf(r.status));
          const simpleAddr = getSimpleAddress(r.address);

          return (
            <Card
              key={r._id}
              className="report-card"
              onClick={() => handleOpen(r._id)}
              style={{ marginBottom: 16, cursor: 'pointer' }}
            >
              <CardContent>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {STEPS.map(label => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <div style={{ display: 'flex', marginTop: 8 }}>
                  {thumb && (
                    <CardMedia
                      component="img"
                      image={thumb}
                      alt="Report"
                      style={{ width: 150, borderRadius: 4, marginRight: 16 }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <Typography variant="body2" color="textSecondary" align="right">
                      #{r._id}
                    </Typography>
                    <Typography variant="h6">
                      {r.title || 'No Title'}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      {r.category}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {r.description.length > 60
                        ? r.description.slice(0, 60) + '…'
                        : r.description}
                    </Typography>
                    {simpleAddr && (
                      <Typography variant="body2" color="textSecondary">
                        Address: {simpleAddr}
                      </Typography>
                    )}
                  </div>
                </div>
              </CardContent>
              <Divider />
            </Card>
          );
        })}
      </div>

      {/* Right: map */}
      <div className="map-container" style={{ width: '60%', height: '100vh' }}>
        <Map reports={reports} onMarkerClick={handleOpen} />
      </div>

      {/* Detail dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Report Details
          <IconButton
            onClick={handleClose}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selected && (
            <>
              <Typography variant="body2" color="textSecondary" align="right">
                #{selected._id}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {selected.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {selected.category}
              </Typography>
              <Typography variant="body1" paragraph>
                {selected.description}
              </Typography>
              {selected.address && (
                <Typography variant="body2" paragraph>
                  Address: {getSimpleAddress(selected.address)}
                </Typography>
              )}
              {selected.photos?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selected.photos.map(pid => (
                    <img
                      key={pid}
                      src={`${BASE}/api/reports/photo/${pid}`}
                      alt="Report Photo"
                      style={{ width: 150, borderRadius: 4 }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Refresh */}
      {/* <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.reload()}
        style={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        Refresh
      </Button> */}
    </div>
  );
};

export default ReportList;
