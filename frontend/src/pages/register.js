import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormHelperText
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
// Import the API configuration
import { API_BASE_URL, getApiUrl } from '../utils/config';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
  },
});

export default function Register({ user: initialUser, login }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      role: 'seeker'
    }
  });

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (initialUser) {
      router.push('/dashboard');
    }
  }, [initialUser, router]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Sending registration request to:', getApiUrl('/auth/register'));
      console.log('Registration data:', data);
      
      // Make API call to register using getApiUrl
      const response = await axios.post(getApiUrl('/auth/register'), data);
      
      console.log('Registration successful:', response.data);
      
      // Call the login function from _app.js to set the user in state and localStorage
      login(response.data);
      
      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data?.error || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Unable to connect to the server. Please check if the backend is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
      
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
            <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
              Create an Account
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    autoFocus
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address'
                  } 
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
              
              <Controller
                name="mobile"
                control={control}
                rules={{ 
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit mobile number'
                  } 
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    id="mobile"
                    label="Mobile Number"
                    error={!!errors.mobile}
                    helperText={errors.mobile?.message}
                  />
                )}
              />
              
              <Controller
                name="password"
                control={control}
                rules={{ 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
              
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" sx={{ mt: 2, display: 'block' }}>
                    <FormLabel component="legend">I want to:</FormLabel>
                    <RadioGroup row {...field}>
                      <FormControlLabel 
                        value="owner" 
                        control={<Radio />} 
                        label="Share books (Book Owner)" 
                      />
                      <FormControlLabel 
                        value="seeker" 
                        control={<Radio />} 
                        label="Find books (Book Seeker)" 
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link href="/login">
                    <Typography component="span" color="primary" sx={{ cursor: 'pointer' }}>
                      Sign In
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
