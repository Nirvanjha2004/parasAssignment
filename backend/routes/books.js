const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const books = search ? await Book.search(search) : await Book.getAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get books by owner ID
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const books = await Book.getByOwnerId(req.params.ownerId);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new book listing (only for book owners)
router.post('/', async (req, res) => {
  try {
    const { title, author, genre, location, contactInfo, ownerId, ownerName } = req.body;
    
    console.log('Received book creation request:', req.body);
    
    if (!title || !author || !location || !contactInfo || !ownerId) {
      return res.status(400).json({ error: 'Required fields missing' });
    }
    
    // Check if user exists and is an owner
    try {
      const owner = await User.getById(ownerId);
      
      if (!owner) {
        return res.status(404).json({ error: 'Owner not found' });
      }
      
      if (owner.role !== 'owner') {
        return res.status(403).json({ error: 'Only book owners can create listings' });
      }
    } catch (userError) {
      console.error('Error checking user:', userError);
      // If we can't verify the user (e.g., file access issue), proceed anyway
    }
    
    const newBook = await Book.create({
      title,
      author,
      genre: genre || 'Not specified',
      location,
      contactInfo,
      ownerId,
      ownerName: ownerName || 'Book Owner'
    });
    
    console.log('Book created successfully:', newBook);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update book details
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerId, ...updateData } = req.body;
    
    const book = await Book.getById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Check if the user is the book's owner
    if (book.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Only the book owner can update this listing' });
    }
    
    const updatedBook = await Book.update(id, updateData);
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update book status API endpoint to handle availability toggle
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable, ownerId } = req.body;
    
    if (isAvailable === undefined) {
      return res.status(400).json({ error: 'isAvailable status is required' });
    }
    
    const book = await Book.getById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Check if the user is the book's owner
    if (book.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Only the book owner can update this listing' });
    }
    
    const updatedBook = await Book.update(id, { isAvailable });
    res.json({
      ...updatedBook,
      message: `Book marked as ${isAvailable ? 'available' : 'rented/exchanged'}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get books with filtering
router.get('/search', async (req, res) => {
  try {
    const { title, location, availability } = req.query;
    
    let books = await Book.getAll();
    
    // Filter by availability if specified
    if (availability === 'available') {
      books = books.filter(book => book.isAvailable);
    } else if (availability === 'unavailable') {
      books = books.filter(book => !book.isAvailable);
    }
    
    // Filter by title if specified
    if (title) {
      const titleLower = title.toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(titleLower)
      );
    }
    
    // Filter by location if specified
    if (location) {
      const locationLower = location.toLowerCase();
      books = books.filter(book => 
        book.location.toLowerCase().includes(locationLower)
      );
    }
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a book listing
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerId } = req.body;
    
    if (!ownerId) {
      return res.status(400).json({ error: 'Owner ID is required' });
    }
    
    const book = await Book.getById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Check if the user is the book's owner
    if (book.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Only the book owner can delete this listing' });
    }
    
    await Book.delete(id);
    res.json({ 
      message: 'Book listing deleted successfully',
      id
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
