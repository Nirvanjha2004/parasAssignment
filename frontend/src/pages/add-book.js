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
  Card,
  CardMedia,
  IconButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

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

export default function AddBook({ user: initialUser }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [coverImage, setCoverImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      location: '',
      contactInfo: ''
    }
  });

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
  }, [initialUser, router]);

  const handleImageUpload = async (e) => {
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

    // Simplified approach - just use FileReader directly
    const reader = new FileReader();
    reader.onload = (event) => {
      // Save the full data URL
      const imageDataUrl = event.target.result;
      console.log('Image loaded, length:', imageDataUrl.length);
      setCoverImage(imageDataUrl);
      setImageLoading(false);
    };
    reader.onerror = () => {
      console.error('FileReader error');
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

  const onSubmit = async (data) => {
    if (!user) return;

    try {
      setLoading(true);

      // Debug the cover image
      console.log('Cover image type:', typeof coverImage);
      console.log('Cover image starts with:', coverImage ? coverImage.substring(0, 50) + '...' : 'No image');
      
      // Save the newly added book to local storage first, to ensure it has the image
      const newBookId = Date.now().toString();
      const newBook = {
        id: newBookId,
        ...data,
        ownerId: user.id,
        ownerName: user.name,
        coverImage: coverImage,
        isAvailable: true,
        createdAt: new Date().toISOString()
      };
      
      // Update local storage immediately
      const existingBooks = JSON.parse(localStorage.getItem('books') || '[]');
      localStorage.setItem('books', JSON.stringify([...existingBooks, newBook]));
      console.log('Book saved to localStorage with cover image');
      
      // Try API call but don't wait for it
      try {
        axios.post('http://localhost:5000/api/books', {
          ...data,
          ownerId: user.id,
          ownerName: user.name
          // Skip sending the large image data to avoid payload issues
        }).then(response => {
          console.log('Book also saved to API:', response.data);
        });
      } catch (apiError) {
        console.error('API save failed, but book is in localStorage:', apiError);
      }

      setSnackbar({
        open: true,
        message: 'Book added successfully!',
        severity: 'success'
      });

      // After 1 second, redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error adding book:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to add book. Please try again.',
        severity: 'error'
      });
      
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

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
              Add New Book
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Book Details
            </Typography>
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
                          <CardMedia
                            component="img"
                            image={coverImage}
                            alt="Book Cover Preview"
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                
                {/* Other book details fields */}
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
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Book'}
                </Button>
              </Box>
            </Box>
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
