/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL || 'https://parasassignment.onrender.com/api',
  },
}

module.exports = nextConfig
