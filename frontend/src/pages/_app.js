import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import axios from 'axios';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Set up axios interceptors for debugging
  useEffect(() => {
    // Request interceptor
    axios.interceptors.request.use(
      config => {
        console.log('API Request:', config.method?.toUpperCase(), config.url, config.data || '');
        return config;
      },
      error => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axios.interceptors.response.use(
      response => {
        console.log('API Response:', response.status, response.data);
        return response;
      },
      error => {
        if (error.response) {
          console.error('API Error Response:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('API No Response:', error.request);
        } else {
          console.error('API Error:', error.message);
        }
        return Promise.reject(error);
      }
    );

    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    // Add this debug call
    debugLocalStorage();
  }, []);

  // Add a debug function to help troubleshoot image issues
  const debugLocalStorage = () => {
    try {
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      console.log('Books in localStorage:', books.length);
      books.forEach((book, index) => {
        console.log(`Book ${index+1} - ${book.title} - Has cover: ${book.coverImage ? 'Yes' : 'No'}`);
      });
    } catch (error) {
      console.error('Error debugging localStorage:', error);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Component 
      {...pageProps} 
      user={user} 
      login={login} 
      logout={logout}
    />
  );
}

export default MyApp;
