import './App.css';
import React from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import SignupForm from './components/SignupForm';

const theme = createTheme({
  palette: {
    mode: 'light'
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <SignupForm />
      </Container>
    </ThemeProvider>
  );
}

export default App;
