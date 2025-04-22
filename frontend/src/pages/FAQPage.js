// src/pages/FAQPage.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    q: 'How do I submit a report?',
    a: 'Log in or register, click “Submit Report,” fill in the form (including location/photo), then hit “Submit.”'
  },
  {
    q: 'Can I report anonymously?',
    a: 'Yes! Just toggle the “Report Anonymously” switch on the submission form.'
  },
  {
    q: 'How do I track my report?',
    a: 'Go to “Reports” in the navigation to see all your reports and their current status.'
  },
  {
    q: 'What kinds of issues can I report?',
    a: 'Road hazards, broken streetlights, graffiti, water leaks, park maintenance—and anything else that needs public attention.'
  },
  {
    q: 'Who receives my reports?',
    a: 'Reports go directly to the relevant city department or authority responsible for that issue type.'
  }
];

// Styled components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #E0F7FA 0%, #80DEEA 100%)',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(4)
}));

const CardContainer = styled(Container)(({ theme }) => ({
  background: 'white',
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[4],
  padding: theme.spacing(4),
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  '&:before': { display: 'none' },
  boxShadow: theme.shadows[1]
}));

const StyledSummary = styled(AccordionSummary)(({ theme }) => ({
  background: theme.palette.primary.light,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.primary.contrastText,
  '& .MuiAccordionSummary-expandIcon': {
    color: theme.palette.primary.contrastText
  }
}));

const StyledDetails = styled(AccordionDetails)(({ theme }) => ({
  background: theme.palette.grey[50],
  borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`
}));

export default function FAQPage() {
  const theme = useTheme();

  return (
    <PageWrapper>
      <CardContainer maxWidth="md">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.dark,
            mb: 3,
            position: 'relative',
            '&::after': {
              content: '""',
              width: 60,
              height: 4,
              background: theme.palette.secondary.main,
              display: 'block',
              margin: '8px auto 0',
              borderRadius: 2
            }
          }}
        >
          Frequently Asked Questions
        </Typography>

        {faqs.map((faq, idx) => (
          <StyledAccordion key={idx} defaultExpanded={idx === 0}>
            <StyledSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${idx}-content`}
              id={`panel${idx}-header`}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {faq.q}
              </Typography>
            </StyledSummary>
            <StyledDetails>
              <Typography>{faq.a}</Typography>
            </StyledDetails>
          </StyledAccordion>
        ))}
      </CardContainer>
    </PageWrapper>
  );
}
