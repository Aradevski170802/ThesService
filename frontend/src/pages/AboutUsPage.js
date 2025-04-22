import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent } from '@mui/material';

const AboutUsPage = () => (
  <Box
    sx={{
      py: 8,
      background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
      color: 'white',
      minHeight: '100vh'
    }}
  >
    <Container maxWidth="md">
      <Typography variant="h3" align="center" gutterBottom>
        About Us
      </Typography>
      <Typography variant="h6" align="center" paragraph>
        We empower citizens to report public infrastructure issues in their communities—quickly, easily, and anonymously if you wish.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Our Mission
              </Typography>
              <Typography>
                To connect you directly with local authorities, so potholes, streetlight failures, graffiti, and more can be fixed faster.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                How It Works
              </Typography>
              <Typography>
                1. Snap or describe the issue. <br/>
                2. Pin it on the map. <br/>
                3. Track status in real time.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Our Team
              </Typography>
              <Typography>
                A group of civic‑tech enthusiasts dedicated to making our cities safer and more functional—one report at a time.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default AboutUsPage;
