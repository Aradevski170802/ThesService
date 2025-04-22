// src/pages/AdminPage.js

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Card,
    CardContent,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Select,
    MenuItem,
    Button,
    Box,
    Paper,
    Chip
} from '@mui/material';
import { FilterList as FilterListIcon, Delete as DeleteIcon } from '@mui/icons-material';
import FilterDialog from '../components/FilterDialog';

const statusColor = {
    Pending: 'warning',
    'In Progress': 'info',
    Finished: 'success'
};

export default function AdminPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        statuses: [],
        categories: []
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/admin/reports', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(data => {
                setReports(data);
                setFilteredReports(data);
            })
            .catch(err => console.error('Fetch admin reports failed:', err));
    }, [user, navigate]);

    useEffect(() => {
        let arr = [...reports];
        const { statuses, categories } = activeFilters;
        if (statuses.length) {
            arr = arr.filter(r => statuses.includes(r.status));
        }
        if (categories.length) {
            arr = arr.filter(r => categories.includes(r.category));
        }
        setFilteredReports(arr);
    }, [reports, activeFilters]);

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/admin/reports/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        setReports(r => r.map(x => x._id === id ? { ...x, status } : x));
        setFilteredReports(r => r.map(x => x._id === id ? { ...x, status } : x));
    };

    const deleteReport = async (id) => {
        if (!window.confirm('Really delete this report?')) return;
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/admin/reports/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        setReports(r => r.filter(x => x._id !== id));
        setFilteredReports(r => r.filter(x => x._id !== id));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Typography variant="h4">Admin Dashboard</Typography>
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            onClick={() => setFilterOpen(true)}
                            sx={{
                                borderColor: 'primary.contrastText',
                                color: 'primary.contrastText',
                                '&:hover': { bgcolor: 'primary.dark', borderColor: 'primary.contrastText' }
                            }}
                        >
                            Filters
                        </Button>
                    </Box>
                </CardContent>

                <FilterDialog
                    open={filterOpen}
                    onClose={() => setFilterOpen(false)}
                    filteredCount={filteredReports.length}
                    onApply={filters => {
                        setActiveFilters({
                            statuses: filters.statuses,
                            categories: filters.categories
                        });
                        setFilterOpen(false);
                    }}
                />

                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                {['ID', 'Title', 'Creator', 'Category', 'Status', 'Actions'].map(header => (
                                    <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredReports.map((r, idx) => (
                                <TableRow
                                    key={r._id}
                                    hover
                                    sx={{
                                        bgcolor: idx % 2 ? 'grey.50' : 'background.paper'
                                    }}
                                >
                                    <TableCell>{r._id.slice(-6)}</TableCell>
                                    <TableCell>{r.title}</TableCell>
                                    <TableCell>{r.createdBy.name}</TableCell>
                                    <TableCell>{r.category}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                label={r.status}
                                                color={statusColor[r.status]}
                                                size="small"
                                            />
                                            <Select
                                                value={r.status}
                                                onChange={e => updateStatus(r._id, e.target.value)}
                                                size="small"
                                                sx={{ minWidth: 120 }}
                                            >
                                                {['Pending', 'In Progress', 'Finished'].map(s => (
                                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => deleteReport(r._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Container>
    );
}
