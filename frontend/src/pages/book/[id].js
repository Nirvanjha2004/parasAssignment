import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  Chip,
  Divider,
  Card,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
  },
});

export default function BookDetails({ user: initialUser }) {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openContact, setOpenContact] = useState(false);
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    // Check if user is stored in local storage if not provided
    if (!initialUser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    // Only fetch book if we have an id
    if (id) {
      fetchBook();
    }
  }, [id, initialUser]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      
      // Try to get the book from localStorage first
      const storedBooks = localStorage.getItem('books');
      let foundBook = null;
      
      if (storedBooks) {
        const books = JSON.parse(storedBooks);
        foundBook = books.find(book => book.id === id);
        if (foundBook) {
          console.log('Found book in localStorage:', foundBook.title);
          console.log('Book has cover image:', !!foundBook.coverImage);
        }
      }
      
      // Use found book or fallback
      if (foundBook) {
        setBook(foundBook);
      } else {
        // Fallback to dummy data
        const dummyBook = {
          id: id || '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          genre: 'Classic',
          location: 'New York',
          contactInfo: 'john@example.com',
          ownerId: '101',
          ownerName: 'John Doe',
          isAvailable: true,
          coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300',
          description: 'A novel about the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan.'
        };
        setBook(dummyBook);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleContactOwner = () => {
    setOpenContact(true);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Button 
                color="inherit" 
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Book Details
              </Typography>
            </Toolbar>
          </AppBar>
          <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  if (!book) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Button 
                color="inherit" 
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Book Details
              </Typography>
            </Toolbar>
          </AppBar>
          <Container sx={{ mt: 4 }}>
            <Typography variant="h5" align="center">
              Book not found
            </Typography>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Button 
              color="inherit" 
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Book Details
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  {book.coverImage ? (
                    <Box sx={{ position: 'relative', height: 400 }}>
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          backgroundColor: '#f5f5f5'
                        }}
                        onError={(e) => {
                          console.error('Image failed to load in detail view, falling back to default');
                          e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300';
                        }}
                      />
                    </Box>
                  ) : (
                    <CardMedia
                      component="img"
                      sx={{ height: 400, objectFit: 'cover' }}
                      image={'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300'}
                      alt={book.title}
                    />
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  by {book.author}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip 
                    icon={<LocalOfferIcon />} 
                    label={book.genre || 'No Genre'} 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={book.isAvailable ? 'Available' : 'Rented/Exchanged'} 
                    color={book.isAvailable ? 'success' : 'error'} 
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Owner:</strong> {book.ownerName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Location:</strong> {book.location}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                  {book.description || 'No description available.'}
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleContactOwner}
                    disabled={!book.isAvailable}
                  >
                    Contact Owner
                  </Button>
                </Box>

                {user && book.ownerId === user.id && (
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined"
                      color={book.isAvailable ? "warning" : "success"}
                      onClick={async () => {
                        try {
                          // Update local state
                          const updatedBook = {...book, isAvailable: !book.isAvailable};
                          setBook(updatedBook);
                          
                          // Update in localStorage
                          const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
                          const updatedBooks = storedBooks.map(b => 
                            b.id === book.id ? updatedBook : b
                          );
                          localStorage.setItem('books', JSON.stringify(updatedBooks));
                          
                          // Try API update
                          try {
                            await axios.patch(`http://localhost:5000/api/books/${book.id}`, {
                              isAvailable: !book.isAvailable,
                              ownerId: user.id
                            });
                          } catch (apiError) {
                            console.error('API update failed:', apiError);
                          }
                        } catch (error) {
                          console.error('Failed to update book status:', error);
                        }
                      }}
                    >
                      {book.isAvailable ? 'Mark as Rented/Exchanged' : 'Mark as Available'}
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      
      {/* Contact Owner Dialog */}
      <Dialog open={openContact} onClose={() => setOpenContact(false)}>
        <DialogTitle>Contact Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To request this book, please contact the owner directly:
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1"><strong>Owner:</strong> {book.ownerName}</Typography>
            <Typography variant="body1"><strong>Contact:</strong> {book.contactInfo}</Typography>
            <Typography variant="body1"><strong>Location:</strong> {book.location}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenContact(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
