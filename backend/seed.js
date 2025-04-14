const fs = require('fs-extra');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
fs.ensureDirSync(dataDir);

// Dummy users
const users = [
  {
    id: '101',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    mobile: '1234567890',
    role: 'owner',
    createdAt: new Date().toISOString()
  },
  {
    id: '102',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    mobile: '9876543210',
    role: 'owner',
    createdAt: new Date().toISOString()
  },
  {
    id: '103',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    mobile: '5551234567',
    role: 'seeker',
    createdAt: new Date().toISOString()
  }
];

// Dummy books with placeholder images
const books = [
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
    createdAt: new Date().toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300'
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
    createdAt: new Date().toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8?q=80&w=300'
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
    createdAt: new Date().toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=300'
  },
  {
    id: '4',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    location: 'London',
    contactInfo: 'jane@example.com',
    ownerId: '102',
    ownerName: 'Jane Smith',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=300'
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
    createdAt: new Date().toISOString(),
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=300'
  }
];

// Write data to files
fs.writeJSONSync(path.join(dataDir, 'users.json'), users);
fs.writeJSONSync(path.join(dataDir, 'books.json'), books);

console.log('Dummy data has been successfully added!');
console.log(`- ${users.length} users created`);
console.log(`- ${books.length} books created`);
console.log('\nYou can now log in with these credentials:');
users.forEach(user => {
  console.log(`- Email: ${user.email} | Password: ${user.password} | Role: ${user.role}`);
});
