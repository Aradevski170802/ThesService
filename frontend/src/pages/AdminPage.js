import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Table, TableHead,
    TableRow, TableCell, TableBody, Select,
    MenuItem, Button, Box
} from '@mui/material';

export default function AdminPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);

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
            .then(setReports)
            .catch(err => {
                console.error('Fetch admin reports failed:', err);
                // optionally navigate away
            });
    }, [user, navigate]);

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
    };

    const deleteReport = async (id) => {
        if (!window.confirm('Really delete this report?')) return;
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/admin/reports/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        setReports(r => r.filter(x => x._id !== id));
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Creator</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map(r => (
                            <TableRow key={r._id}>
                                <TableCell>{r._id.slice(-6)}</TableCell>
                                <TableCell>{r.title}</TableCell>
                                <TableCell>{r.createdBy.name} ({r.createdBy.email})</TableCell>
                                <TableCell>
                                    <Select
                                        value={r.status}
                                        onChange={e => updateStatus(r._id, e.target.value)}
                                        size="small"
                                    >
                                        {['Pending', 'In Progress', 'Finished'].map(s => (
                                            <MenuItem key={s} value={s}>{s}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => deleteReport(r._id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Container>
    );
}
