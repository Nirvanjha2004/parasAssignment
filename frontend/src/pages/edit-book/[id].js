import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  IconButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
  },
});

const genres = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
  'Thriller', 'Romance', 'Biography', 'History', 'Self-Help',
  'Business', 'Children', 'Young Adult', 'Science', 'Poetry',
  'Comics', 'Art', 'Cookbooks', 'Travel', 'Other'
];

export default function EditBook({ user: initialUser }) {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(initialUser);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    // Check if user is logged in
    if (!initialUser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Redirect if user is not a book owner
        if (parsedUser.role !== 'owner') {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    } else if (initialUser.role !== 'owner') {
      router.push('/dashboard');
    }

    // Fetch book data if id is available
    if (id) {
      fetchBookDetails();
    }
  }, [id, initialUser, router]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      
      // Try to get the book from localStorage first
      const storedBooks = localStorage.getItem('books');
      let foundBook = null;
      
      if (storedBooks) {
        const books = JSON.parse(storedBooks);
        foundBook = books.find(book => book.id === id);
      }
      
      if (foundBook) {
        // Check if the current user is the owner
        if (user && foundBook.ownerId !== user.id) {
          setSnackbar({
            open: true,
            message: 'You can only edit your own book listings',
            severity: 'error'
          });
          setTimeout(() => router.push('/dashboard'), 2000);
          return;
        }
        
        setBook(foundBook);
        setCoverImage(foundBook.coverImage || '');
        
        // Pre-populate the form
        reset({
          title: foundBook.title || '',
          author: foundBook.author || '',
          genre: foundBook.genre || '',
          location: foundBook.location || '',
          contactInfo: foundBook.contactInfo || '',
        });
        
        setLoading(false);
      } else {
        setSnackbar({
          open: true,
          message: 'Book not found',
          severity: 'error'
        });
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load book details',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    
    // Check file type
    if (!file.type.includes('image/')) {
      setSnackbar({
        open: true,
        message: 'Please upload an image file',
        severity: 'error'
      });
      setImageLoading(false);
      return;
    }

    // Simple approach - just use FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target.result);
      setImageLoading(false);
    };
    reader.onerror = () => {
      setSnackbar({
        open: true,
        message: 'Failed to read image file',
        severity: 'error'
      });
      setImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setCoverImage('');
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  const onSubmit = async (data) => {
    if (!user || !book) return;

    try {
      setSubmitting(true);

      // Update the book with new data
      const updatedBook = {
        ...book,
        ...data,
        coverImage,
        // Keep these properties unchanged
        ownerId: book.ownerId,
        ownerName: book.ownerName,
        isAvailable: book.isAvailable,
        id: book.id
      };
      
      // Update in localStorage
      const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
      const updatedBooks = storedBooks.map(b => 
        b.id === book.id ? updatedBook : b
      );
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      
      // Try API call but don't block UI
      try {
        // Skip sending large image in API call to avoid payload issues
        const apiData = { ...data, ownerId: user.id };
        await axios.patch(`http://localhost:5000/api/books/${book.id}`, apiData);
        console.log('Book updated in API');
      } catch (apiError) {
        console.error('API update failed, but local state is updated:', apiError);
      }

      setSnackbar({
        open: true,
        message: 'Book updated successfully!',
        severity: 'success'
      });

      // After 2 seconds, redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Update error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update book. Please try again.',
        severity: 'error'
      });
      setSubmitting(false);
    }
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
                Edit Book
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
              Edit Book
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Edit Book Details
            </Typography>
            {book && (
              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  {/* Book Cover Image Upload */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Book Cover Image
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Card sx={{ width: 200, height: 280, position: 'relative' }}>
                        {coverImage ? (
                          <>
                            <img
                              src={coverImage}
                              alt="Book Cover Preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <IconButton 
                              aria-label="delete image"
                              onClick={removeImage}
                              sx={{ 
                                position: 'absolute', 
                                top: 5, 
                                right: 5,
                                bgcolor: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' } 
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: '#f5f5f5',
                              border: '2px dashed #ccc',
                              cursor: 'pointer'
                            }}
                            onClick={() => document.getElementById('cover-image-upload').click()}
                          >
                            <AddPhotoAlternateIcon sx={{ fontSize: 60, color: '#aaa' }} />
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                              {imageLoading ? 'Uploading...' : 'Add Book Cover'}
                            </Typography>
                          </Box>
                        )}
                      </Card>
                    </Box>
                    <input
                      id="cover-image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                      disabled={imageLoading}
                    />
                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={() => document.getElementById('cover-image-upload').click()}
                        disabled={imageLoading}
                      >
                        {coverImage ? 'Change Image' : 'Upload Cover Image'}
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: 'Title is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Title"
                          variant="outlined"
                          error={!!errors.title}
                          helperText={errors.title?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="author"
                      control={control}
                      rules={{ required: 'Author is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Author"
                          variant="outlined"
                          error={!!errors.author}
                          helperText={errors.author?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="genre"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Genre"
                          variant="outlined"
                        >
                          {genres.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                              {genre}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="location"
                      control={control}
                      rules={{ required: 'Location is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Location"
                          variant="outlined"
                          placeholder="City, State"
                          error={!!errors.location}
                          helperText={errors.location?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="contactInfo"
                      control={control}
                      rules={{ required: 'Contact information is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Contact Information"
                          variant="outlined"
                          placeholder="Email or phone number"
                          error={!!errors.contactInfo}
                          helperText={errors.contactInfo?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
