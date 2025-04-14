import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid,
  Card, 
  CardContent,
  CardMedia,
  Paper,
  Stack,
  Divider 
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleIcon from '@mui/icons-material/People';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SearchIcon from '@mui/icons-material/Search';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
  },
});

export default function Home({ user }) {
  const router = useRouter();

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: '#f7f9fc', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            py: 8,
            borderRadius: 0,
            backgroundImage: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                  Book Exchange Platform
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Connect with fellow readers to exchange and rent books in your community.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    sx={{ 
                      bgcolor: 'white', 
                      color: 'primary.main',
                      px: 4,
                      '&:hover': { bgcolor: '#e0e0e0' } 
                    }}
                    onClick={() => router.push('/register')}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    sx={{ 
                      border: '2px solid white', 
                      color: 'white',
                      px: 4, 
                      '&:hover': { border: '2px solid white', bgcolor: 'rgba(255,255,255,0.1)' } 
                    }}
                    onClick={() => router.push('/login')}
                  >
                    Log In
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <AutoStoriesIcon sx={{ fontSize: { xs: 150, md: 200 }, opacity: 0.8 }} />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Paper>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
            How It Works
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                  <PeopleIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Create Your Profile
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign up as a Book Owner to share your collection or as a Book Seeker to find your next great read.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                  <LocalLibraryIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    List Your Books
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Book Owners can easily list books they want to rent or exchange with detailed information.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                  <SearchIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Connect & Exchange
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Browse available books in your area, contact owners, and arrange exchanges or rentals.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box sx={{ bgcolor: '#e8eaf6', py: 6 }}>
          <Container maxWidth="md">
            <Card sx={{ p: 4, textAlign: 'center', boxShadow: 3 }}>
              <Typography variant="h4" gutterBottom>
                Ready to start exchanging books?
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Join our community of book lovers today and discover new reads without spending a fortune.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button 
                  variant="contained" 
                  size="large" 
                  color="primary" 
                  onClick={() => router.push('/register')}
                >
                  Sign Up Now
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  color="primary"
                  onClick={() => router.push('/login')}
                >
                  Log In
                </Button>
              </Stack>
            </Card>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ bgcolor: '#303f9f', color: 'white', py: 3 }}>
          <Container maxWidth="lg">
            <Typography variant="body2" align="center">
              © {new Date().getFullYear()} Book Exchange Platform. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
