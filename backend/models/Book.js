const fs = require('fs-extra');
const path = require('path');

const booksFilePath = path.join(__dirname, '../data/books.json');

class Book {
  static async getAll() {
    try {
      return await fs.readJSON(booksFilePath);
    } catch (error) {
      console.error('Error reading books:', error);
      return [];
    }
  }

  static async getById(id) {
    const books = await this.getAll();
    return books.find(book => book.id === id);
  }

  static async getByOwnerId(ownerId) {
    const books = await this.getAll();
    return books.filter(book => book.ownerId === ownerId);
  }

  static async create(bookData) {
    const books = await this.getAll();
    
    const newBook = {
      id: Date.now().toString(),
      isAvailable: true,
      createdAt: new Date().toISOString(),
      // Default cover image if none provided
      coverImage: bookData.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300',
      ...bookData
    };
    
    books.push(newBook);
    await fs.writeJSON(booksFilePath, books);
    return newBook;
  }

  static async update(id, bookData) {
    const books = await this.getAll();
    const index = books.findIndex(book => book.id === id);
    
    if (index === -1) {
      throw new Error('Book not found');
    }
    
    books[index] = { ...books[index], ...bookData };
    await fs.writeJSON(booksFilePath, books);
    return books[index];
  }

  static async delete(id) {
    const books = await this.getAll();
    const filteredBooks = books.filter(book => book.id !== id);
    await fs.writeJSON(booksFilePath, filteredBooks);
  }

  static async search(query) {
    const books = await this.getAll();
    
    if (!query) {
      return books;
    }
    
    const lowerQuery = query.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      (book.genre && book.genre.toLowerCase().includes(lowerQuery)) ||
      book.location.toLowerCase().includes(lowerQuery)
    );
  }
}

module.exports = Book;
