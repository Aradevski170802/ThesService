// src/components/ReportList.js

import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Close as CloseIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import Map from './Map';
import FilterDialog from './FilterDialog';

const BASE = 'http://localhost:5000';
const STEPS = ['Registered', 'Seen', 'Completed'];

function getSimpleAddress(full) {
  if (!full) return '';
  const parts = full.split(',').map(s => s.trim());
  return parts.length > 1 ? `${parts[0]}, ${parts[1]}` : parts[0];
}

export default function ReportList() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useContext(AuthContext);

  const [reports, setReports]               = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filterOpen, setFilterOpen]         = useState(false);
  const [activeFilters, setActiveFilters]   = useState({
    showPublished:   false,
    showUnderReview: false,
    showSupported:   false,
    statuses:        [],
    categories:      []
  });

  const [detailOpen, setDetailOpen]         = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [view, setView]                     = useState('list'); // for mobile

  // Fetch all reports on mount
  useEffect(() => {
    axios.get(`${BASE}/api/reports`)
      .then(res => setReports(res.data))
      .catch(console.error);
  }, []);

  // Recompute filteredReports whenever reports or activeFilters change
  useEffect(() => {
    let arr = [...reports];

    const { statuses, categories } = activeFilters;
    if (statuses.length) {
      arr = arr.filter(r => statuses.includes(r.status));
    }
    if (categories.length) {
      arr = arr.filter(r => categories.includes(r.category));
    }
    // (Optionally add "My Requests" filtering here)

    setFilteredReports(arr);
  }, [reports, activeFilters]);

  // Handlers
  const handleApplyFilters = filters => {
    setActiveFilters(filters);
    setFilterOpen(false);
  };

  const openDetail = id => {
    axios.get(`${BASE}/api/reports/${id}`)
      .then(res => {
        setSelectedReport(res.data);
        setDetailOpen(true);
      })
      .catch(console.error);
  };
  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedReport(null);
  };

  // Header bar
  const HeaderBar = (
    <Box
      sx={{
        px:2, py:1,
        bgcolor:'#1e5870', color:'#fff',
        display:'flex', justifyContent:'space-between', alignItems:'center'
      }}
    >
      <Typography variant="subtitle1">
        {filteredReports.length.toLocaleString('en-US')} Reports
      </Typography>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        sx={{
          borderColor:'#fff', color:'#fff',
          '&:hover':{ backgroundColor:'rgba(255,255,255,0.1)', borderColor:'#fff' }
        }}
        onClick={()=>setFilterOpen(true)}
      >
        Filters
      </Button>
    </Box>
  );

  // Card list
  const CardList = (
    <Box sx={{ p:2 }}>
      {filteredReports.map(r => {
        const thumbUrl  = r.photos?.[0] ? `${BASE}/api/reports/photo/${r.photos[0]}` : null;
        const stepIndex = Math.max(0, STEPS.indexOf(r.status));
        const addr      = getSimpleAddress(r.address);

        return (
          <Card
            key={r._id}
            onClick={()=>openDetail(r._id)}
            sx={{ mb:2, cursor:'pointer' }}
          >
            <CardContent>
              <Stepper activeStep={stepIndex} alternativeLabel>
                {STEPS.map(s => (
                  <Step key={s}><StepLabel>{s}</StepLabel></Step>
                ))}
              </Stepper>
              <Box sx={{ display:'flex', mt:1 }}>
                {thumbUrl && (
                  <CardMedia
                    component="img"
                    image={thumbUrl}
                    alt="Report"
                    sx={{ width:100, borderRadius:1, mr:2 }}
                  />
                )}
                <Box sx={{ flex:1 }}>
                  <Typography variant="body2" color="textSecondary" align="right">
                    #{r._id}
                  </Typography>
                  <Typography variant="h6">{r.title}</Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    {r.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {r.description.length > 60
                      ? r.description.slice(0,60) + '…'
                      : r.description}
                  </Typography>
                  {addr && (
                    <Typography variant="body2" color="textSecondary">
                      Address: {addr}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
            <Divider />
          </Card>
        );
      })}
    </Box>
  );

  // Map pane
  const MapPane = <Map reports={filteredReports} onMarkerClick={openDetail} />;

  // Mobile layout
  if (isMobile) {
    return (
      <Box sx={{ height:'100vh', display:'flex', flexDirection:'column' }}>
        <FilterDialog
          open={filterOpen}
          onClose={()=>setFilterOpen(false)}
          onApply={handleApplyFilters}
          filteredCount={filteredReports.length}
        />

        {HeaderBar}

        <Box sx={{ display:'flex', borderBottom:1, borderColor:'divider' }}>
          <Button
            fullWidth
            variant={view==='list'?'contained':'text'}
            onClick={()=>setView('list')}
          >
            List
          </Button>
          <Button
            fullWidth
            variant={view==='map'?'contained':'text'}
            onClick={()=>setView('map')}
          >
            Map
          </Button>
        </Box>
        <Box sx={{
          flex:1,
          overflowY:'auto',
          '&::-webkit-scrollbar':{ display:'none' },
          scrollbarWidth:'none',
          msOverflowStyle:'none'
        }}>
          {view==='list' ? CardList : MapPane}
        </Box>

        <Dialog open={detailOpen} onClose={closeDetail} maxWidth="md" fullWidth>
          <DialogTitle>
            Report Details
            <IconButton onClick={closeDetail} sx={{ position:'absolute', right:8, top:8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedReport && (
              <>
                <Typography variant="body2" color="textSecondary" align="right">
                  #{selectedReport._id}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {selectedReport.title}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedReport.category}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedReport.description}
                </Typography>
                {selectedReport.address && (
                  <Typography variant="body2" paragraph>
                    Address: {getSimpleAddress(selectedReport.address)}
                  </Typography>
                )}
                {selectedReport.photos?.length > 0 && (
                  <Box sx={{ display:'flex', flexWrap:'wrap', gap:1 }}>
                    {selectedReport.photos.map(pid => (
                      <img
                        key={pid}
                        src={`${BASE}/api/reports/photo/${pid}`}
                        alt="Report"
                        style={{ width:100, borderRadius:4 }}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box sx={{ display:'flex', height:'100vh' }}>
      <FilterDialog
        open={filterOpen}
        onClose={()=>setFilterOpen(false)}
        onApply={handleApplyFilters}
        filteredCount={filteredReports.length}
      />

      <Box sx={{ width:'40%', display:'flex', flexDirection:'column' }}>
        {HeaderBar}
        <Box sx={{
          flex:1,
          overflowY:'auto',
          '&::-webkit-scrollbar':{ display:'none' },
          scrollbarWidth:'none',
          msOverflowStyle:'none'
        }}>
          {CardList}
        </Box>
      </Box>

      <Box sx={{ width:'60%', height:'100%' }}>
        {MapPane}
      </Box>

      <Dialog open={detailOpen} onClose={closeDetail} maxWidth="md" fullWidth>
        <DialogTitle>
          Report Details
          <IconButton onClick={closeDetail} sx={{ position:'absolute', right:8, top:8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <>
              <Typography variant="body2" color="textSecondary" align="right">
                #{selectedReport._id}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {selectedReport.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {selectedReport.category}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedReport.description}
              </Typography>
              {selectedReport.address && (
                <Typography variant="body2" paragraph>
                  Address: {getSimpleAddress(selectedReport.address)}
                </Typography>
              )}
              {selectedReport.photos?.length > 0 && (
                <Box sx={{ display:'flex', flexWrap:'wrap', gap:1 }}>
                  {selectedReport.photos.map(pid => (
                    <img
                      key={pid}
                      src={`${BASE}/api/reports/photo/${pid}`}
                      alt="Report"
                      style={{ width:100, borderRadius:4 }}
                    />
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
