import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyPage = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!verificationCode) {
            setError('Please enter the verification code.');
            return;
        }

        try {
            // Make API call to verify the email using the verification code
            const response = await axios.get(`http://localhost:5000/api/auth/verify/${verificationCode}`);
            setSuccess(response.data.message);

            // After successful verification, navigate to the login page
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('Invalid or expired code. Please try again.');
        }
    };

    return (
        <Container>
            <Box sx={{ maxWidth: 400, margin: 'auto', paddingTop: '50px' }}>
                <Typography variant="h5" component="h1" gutterBottom>Email Verification</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Verification Code"
                        type="text"
                        fullWidth
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        margin="normal"
                        required
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: '20px' }}>
                        Verify Email
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default VerifyPage;
