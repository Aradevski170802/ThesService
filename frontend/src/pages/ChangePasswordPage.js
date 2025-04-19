import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { TextField, Button, Container, Box, Typography } from '@mui/material';

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the passwords
        if (newPassword !== confirmPassword) {
            setErrorMessage('New password does not match.');
            return;
        }
        setErrorMessage('');

        try {
            // Send request to change the password
            const response = await axios.post('http://localhost:5000/api/auth/change-password', {
                currentPassword,
                newPassword
            });

            if (response.data.message === 'Password changed successfully') {
                setSuccessMessage('Password changed successfully!');
                setTimeout(() => {
                    navigate('/profile');  // Redirect user to their profile page after 3 seconds
                }, 3000);
            }
        } catch (error) {
            setErrorMessage('Failed to change password');
        }
    };

    return (
        <Container>
            <Box sx={{ maxWidth: 400, margin: 'auto', paddingTop: '50px' }}>
                <Typography variant="h5" component="h1" gutterBottom>Change Password</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                    {successMessage && <Typography color="success">{successMessage}</Typography>}
                    <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: '20px' }}>
                        Change Password
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default ChangePasswordPage;
