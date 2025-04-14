# Book Exchange Portal

A full-stack web application for connecting book owners and seekers in a peer-to-peer exchange platform. This application allows users to share, rent, or exchange books within their community.

## Features

### User Management
- **Dual User Roles**: Book Owners and Book Seekers
- **User Registration**: Create accounts with name, email, password, and mobile number
- **User Authentication**: Simple email and password-based login
- **Role-Based Access**: Different interfaces and permissions based on user role

### Book Listings
- **Create Book Listings**: Book owners can add new books with details and cover images
- **Browse Books**: All users can browse available books
- **Advanced Filtering**: Search by title, author, or location
- **Availability Status**: Books can be marked as "Available" or "Rented/Exchanged"

### Book Management
- **Edit Listings**: Book owners can edit their book details and cover images
- **Delete Listings**: Owners can remove their books from the platform
- **Status Toggle**: Easily change the availability status of books

### Additional Features
- **Image Upload**: Add cover images to book listings
- **Contact Information**: Easy access to contact book owners
- **Responsive Design**: Works on both mobile and desktop devices
- **Material UI**: Modern, clean user interface

## Tech Stack

### Frontend
- **React**: UI library
- **Next.js**: React framework for server-side rendering
- **Material UI**: Component library for consistent design
- **Axios**: HTTP client for API requests
- **React Hook Form**: Form handling and validation

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **JSON Files**: Simple file-based storage (no database required)
- **RESTful API**: Structured endpoints for data operations

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   The application will be available at http://localhost:3000

## Usage Guide

### Registration & Login
1. Choose to register as a Book Owner or Book Seeker
2. Fill in your details (name, email, mobile, password)
3. Login with your email and password

### For Book Owners
1. View your dashboard to see all available books
2. Add new books with "Add Book" button
3. Include book details (title, author, genre, location)
4. Optionally upload a cover image
5. Manage your listings in the "My Listings" tab
6. Edit, delete, or change status of your books

### For Book Seekers
1. Browse all available books
2. Use search bar to filter by title, author, or location
3. Filter by availability status
4. Click on a book to view details
5. Contact book owners directly

## Project Structure
