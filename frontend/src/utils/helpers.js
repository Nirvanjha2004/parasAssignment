/**
 * Helper functions for the book exchange application
 */

/**
 * Check if a string is a valid data URL
 * @param {string} str - String to check
 * @returns {boolean} True if valid data URL
 */
export const isValidDataUrl = (str) => {
  if (!str) return false;
  return str.startsWith('data:image/');
};

/**
 * Add a book to local storage
 * @param {Object} book - Book data to add
 */
export const addBookToLocalStorage = (book) => {
  const books = JSON.parse(localStorage.getItem('books') || '[]');
  localStorage.setItem('books', JSON.stringify([...books, book]));
};

/**
 * Update books in local storage
 * @param {Array} books - Updated books array
 */
export const updateBooksInLocalStorage = (books) => {
  localStorage.setItem('books', JSON.stringify(books));
};

/**
 * Get books from local storage
 * @returns {Array} Array of books
 */
export const getBooksFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('books') || '[]');
};

/**
 * Get a single book from local storage by ID
 * @param {string} id - Book ID
 * @returns {Object|null} Book object or null if not found
 */
export const getBookFromLocalStorage = (id) => {
  const books = getBooksFromLocalStorage();
  return books.find(book => book.id === id) || null;
};
