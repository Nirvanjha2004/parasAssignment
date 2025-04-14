import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  CircularProgress,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';

// Use the same theme as the home page
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export default function Dashboard({ user: initialUser, logout }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'title', 'location'
  const [filterAvailability, setFilterAvailability] = useState('all'); // 'all', 'available', 'unavailable'
  const [openContact, setOpenContact] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [refreshKey, setRefreshKey] = useState(0); // Add this line to force re-renders

  const dummyBooks = [
    {
      id: '1',
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
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      location: 'Chicago',
      contactInfo: 'jane@example.com',
      ownerId: '102',
      ownerName: 'Jane Smith',
      isAvailable: true,
      coverImage: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8?q=80&w=300',
      description: 'The story of racial injustice and the destruction of innocence in a small Southern town during the Depression.'
    },
    {
      id: '3',
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian',
      location: 'San Francisco',
      contactInfo: 'john@example.com',
      ownerId: '101',
      ownerName: 'John Doe',
      isAvailable: false,
      coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=300',
      description: 'A dystopian novel about a totalitarian regime where the government controls every aspect of human life.'
    },
    {
      id: '4',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      location: 'Seattle',
      contactInfo: 'jane@example.com',
      ownerId: '102',
      ownerName: 'Jane Smith',
      isAvailable: true,
      coverImage: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=300',
      description: 'The tale of Bilbo Baggins, who embarks on an unexpected adventure with a group of dwarves.'
    },
    {
      id: '5',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      genre: 'Romance',
      location: 'Boston',
      contactInfo: 'john@example.com',
      ownerId: '101',
      ownerName: 'John Doe',
      isAvailable: true,
      coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=300',
      description: 'The story follows the main character Elizabeth Bennet as she deals with issues of manners, upbringing, and marriage.'
    },
    {
      id: '6',
      title: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      location: 'London',
      contactInfo: 'jane@example.com',
      ownerId: '102',
      ownerName: 'Jane Smith',
      isAvailable: true,
      coverImage: 'https://images.unsplash.com/photo-1606311698062-21c4f57cb277?q=80&w=300',
      description: 'The story of a young wizard who discovers his magical heritage and attends a school of witchcraft and wizardry.'
    },
    {
      id: '7',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      genre: 'Coming-of-age',
      location: 'New York',
      contactInfo: 'john@example.com',
      ownerId: '101',
      ownerName: 'John Doe',
      isAvailable: true,
      coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=300',
      description: 'The novel details the days following Holden Caulfield\'s expulsion from his prep school.'
    },
    {
      id: '8',
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      location: 'Portland',
      contactInfo: 'jane@example.com',
      ownerId: '102',
      ownerName: 'Jane Smith',
      isAvailable: false,
      coverImage: 'https://images.unsplash.com/photo-1621851327323-98c92c8cdf0f?q=80&w=300',
      description: 'An epic high-fantasy novel about the quest to destroy the One Ring.'
    }
  ];

  // Check if user is logged in
  useEffect(() => {
    // If no user is logged in from props, check localStorage
    if (!initialUser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.push('/login');
      }
    }

    // Function to get books with proper handling of image data
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // First, get books from localStorage
        const storedBooks = localStorage.getItem('books');
        let localBooks = [];
        
        if (storedBooks) {
          try {
            localBooks = JSON.parse(storedBooks);
            console.log('Found', localBooks.length, 'books in localStorage');
            
            // Debug the first book's cover image if available
            if (localBooks.length > 0) {
              const firstBook = localBooks[0];
              console.log('First book title:', firstBook.title);
              console.log('First book has cover image:', !!firstBook.coverImage);
              if (firstBook.coverImage) {
                console.log('Cover image starts with:', firstBook.coverImage.substring(0, 50) + '...');
              }
            }
          } catch (parseError) {
            console.error('Error parsing books from localStorage:', parseError);
            localBooks = [];
          }
        }
        
        // Merge with dummy data if needed
        const allBooks = localBooks.length > 0 ? 
          [...localBooks, ...dummyBooks.filter(db => !localBooks.some(lb => lb.id === db.id))] :
          [...dummyBooks];
        
        // Ensure unique books by ID
        const uniqueBooks = Array.from(
          new Map(allBooks.map(book => [book.id, book])).values()
        );
        
        setBooks(uniqueBooks);
        console.log('Set', uniqueBooks.length, 'books in state');
        setLoading(false);
      } catch (error) {
        console.error('Error in book fetching process:', error);
        setBooks(dummyBooks);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [initialUser, router, refreshKey]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  const handleAddBook = () => {
    router.push('/add-book');
  };

  const handleContactOwner = (book) => {
    setSelectedBook(book);
    setOpenContact(true);
  };

  const handleViewDetails = (bookId) => {
    router.push(`/book/${bookId}`);
  };

  const handleEditBook = (bookId) => {
    router.push(`/edit-book/${bookId}`);
  };

  const handleDeleteBook = async (book) => {
    setSelectedBook(book);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedBook || !user) return;

      // Try API call first
      try {
        await axios.delete(`http://localhost:5000/api/books/${selectedBook.id}`, {
          data: { ownerId: user.id }
        });
      } catch (apiError) {
        console.error('API delete failed, updating local state only:', apiError);
      }

      // Update local state and localStorage regardless of API success
      const updatedBooks = books.filter(book => book.id !== selectedBook.id);
      setBooks(updatedBooks);
      localStorage.setItem('books', JSON.stringify(updatedBooks));

      setSnackbar({
        open: true,
        message: 'Book deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete book',
        severity: 'error'
      });
    }
    setOpenDelete(false);
  };

  const handleToggleAvailability = async (book) => {
    try {
      const updatedBook = { ...book, isAvailable: !book.isAvailable };
      
      // Update local state immediately
      const updatedBooks = books.map(b => b.id === book.id ? updatedBook : b);
      setBooks(updatedBooks);
      
      // Save to localStorage
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      
      // Try API call but don't block UI
      try {
        await axios.patch(`http://localhost:5000/api/books/${book.id}`, {
          isAvailable: !book.isAvailable,
          ownerId: user.id
        });
        console.log('Book status updated in API');
      } catch (apiError) {
        console.error('API update failed, but local state is updated:', apiError);
      }
      
      setSnackbar({
        open: true,
        message: `Book marked as ${updatedBook.isAvailable ? 'Available' : 'Rented/Exchanged'}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Update error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update book status',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredBooks = books.filter(book => {
    // First filter by availability
    if (filterAvailability === 'available' && !book.isAvailable) return false;
    if (filterAvailability === 'unavailable' && book.isAvailable) return false;
    
    // Then filter by search term based on filter type
    if (!searchTerm) return true;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    if (filterType === 'title') {
      return book.title.toLowerCase().includes(lowerSearchTerm);
    } 
    else if (filterType === 'location') {
      return book.location.toLowerCase().includes(lowerSearchTerm);
    }
    else {
      // Default: search in both title and location
      return book.title.toLowerCase().includes(lowerSearchTerm) || 
             book.author.toLowerCase().includes(lowerSearchTerm) ||
             book.location.toLowerCase().includes(lowerSearchTerm);
    }
  });

  const myListings = user ?
    books.filter(book => book.ownerId === user.id) :
    [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Book Exchange Platform
            </Typography>
            {user && (
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Hello, {user.name} ({user.role === 'owner' ? 'Book Owner' : 'Book Seeker'})
              </Typography>
            )}
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                    <Tab label="Browse Books" />
                    {user && user.role === 'owner' && (
                      <Tab label="My Listings" />
                    )}
                  </Tabs>
                </Box>

                {tabValue === 0 && (
                  <Box>
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Search books"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                              endAdornment: <SearchIcon color="action" />
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            select
                            fullWidth
                            label="Search in"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            variant="outlined"
                          >
                            <MenuItem value="all">All Fields</MenuItem>
                            <MenuItem value="title">Title Only</MenuItem>
                            <MenuItem value="location">Location Only</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            select
                            fullWidth
                            label="Availability"
                            value={filterAvailability}
                            onChange={(e) => setFilterAvailability(e.target.value)}
                            variant="outlined"
                          >
                            <MenuItem value="all">All Books</MenuItem>
                            <MenuItem value="available">Available Only</MenuItem>
                            <MenuItem value="unavailable">Rented/Exchanged Only</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                          {user && user.role === 'owner' && (
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<AddIcon />}
                              fullWidth
                              onClick={handleAddBook}
                            >
                              Add Book
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Box>

                    {filteredBooks.length === 0 ? (
                      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                        No books found matching your search.
                      </Typography>
                    ) : (
                      <Grid container spacing={3}>
                        {filteredBooks.map((book) => (
                          <Grid item key={book.id} xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                              {book.coverImage ? (
                                // For uploaded images, use direct img tag with error handling
                                <Box sx={{ position: 'relative', height: 200 }}>
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
                                      console.error('Image failed to load, falling back to default');
                                      e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300';
                                    }}
                                  />
                                </Box>
                              ) : (
                                // For dummy images or fallbacks, use CardMedia
                                <CardMedia
                                  component="img"
                                  sx={{ height: 200, objectFit: 'cover' }}
                                  image={'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300'}
                                  alt={book.title}
                                />
                              )}
                              <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom noWrap>
                                  {book.title}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                  by {book.author}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body2">
                                  Genre: {book.genre || 'Not specified'}
                                </Typography>
                                <Typography variant="body2">
                                  Location: {book.location}
                                </Typography>
                                <Typography variant="body2">
                                  Owner: {book.ownerName}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                  <Chip
                                    label={book.isAvailable ? 'Available' : 'Rented/Exchanged'}
                                    color={book.isAvailable ? 'success' : 'error'}
                                    size="small"
                                  />
                                </Box>
                              </CardContent>
                              <CardActions>
                                <Button
                                  size="small"
                                  color="primary"
                                  onClick={() => handleContactOwner(book)}
                                >
                                  Contact Owner
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => handleViewDetails(book.id)}
                                >
                                  View Details
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}

                {tabValue === 1 && user && user.role === 'owner' && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddBook}
                      >
                        Add New Book
                      </Button>
                    </Box>

                    {myListings.length === 0 ? (
                      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                        You haven't listed any books yet. Add your first book!
                      </Typography>
                    ) : (
                      <Grid container spacing={3}>
                        {myListings.map((book) => (
                          <Grid item key={book.id} xs={12} sm={6} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                              <CardMedia
                                component="img"
                                sx={{ 
                                  height: 200, 
                                  objectFit: 'cover',
                                  backgroundColor: '#f5f5f5'
                                }}
                                image={book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300'}
                                alt={book.title}
                                onError={(e) => {
                                  console.log('Image failed to load:', book.coverImage);
                                  e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300';
                                }}
                              />
                              <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom noWrap>
                                  {book.title}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                  by {book.author}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body2">
                                  Genre: {book.genre || 'Not specified'}
                                </Typography>
                                <Typography variant="body2">
                                  Location: {book.location}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                  <Chip
                                    label={book.isAvailable ? 'Available' : 'Rented/Exchanged'}
                                    color={book.isAvailable ? 'success' : 'error'}
                                    size="small"
                                  />
                                </Box>
                              </CardContent>
                              <CardActions>
                                <Button
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditBook(book.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteBook(book)}
                                >
                                  Delete
                                </Button>
                                <Button 
                                  size="small"
                                  color={book.isAvailable ? "warning" : "success"}
                                  onClick={() => handleToggleAvailability(book)}
                                >
                                  {book.isAvailable ? 'Mark as Rented/Exchanged' : 'Mark as Available'}
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Owner Dialog */}
      <Dialog open={openContact} onClose={() => setOpenContact(false)}>
        <DialogTitle>Contact Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To request this book, please contact the owner directly:
          </DialogContentText>
          {selectedBook && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1"><strong>Owner:</strong> {selectedBook.ownerName}</Typography>
              <Typography variant="body1"><strong>Contact:</strong> {selectedBook.contactInfo}</Typography>
              <Typography variant="body1"><strong>Location:</strong> {selectedBook.location}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenContact(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this book listing? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
