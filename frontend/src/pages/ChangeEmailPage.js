import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangeEmailPage = () => {
    const [newEmail, setNewEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('You need to be logged in to change the email.');
                return;
            }

            // Send request to change the email with the token in the headers
            const response = await axios.post(
                'http://localhost:5000/api/auth/change-email',
                { newEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.message === 'Email address changed. Please verify your new email.') {
                // Redirect to the verification page
                navigate('/verify-email');
            }
        } catch (error) {
            setErrorMessage('Failed to change email or email already in use');
        }
    };

    return (
        <Container>
            <Box sx={{ maxWidth: 400, margin: 'auto', paddingTop: '50px' }}>
                <Typography variant="h5" component="h1" gutterBottom>Change Email</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="New Email"
                        type="email"
                        fullWidth
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        margin="normal"
                        required
                    />
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                    <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: '20px' }}>
                        Change Email
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default ChangeEmailPage;
