const fs = require('fs-extra');
const path = require('path');

console.log('Backend Debug Information');
console.log('========================\n');

// Check if directories exist
const dirs = ['routes', 'models', 'data'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  console.log(`Directory ${dir}: ${fs.existsSync(dirPath) ? 'Exists ✅' : 'Missing ❌'}`);
  
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    console.log(`  Files: ${files.join(', ')}`);
  }
});

// Check if required files exist
const files = [
  'index.js', 
  'routes/auth.js', 
  'routes/users.js', 
  'routes/books.js',
  'models/User.js',
  'models/Book.js',
  'data/users.json',
  'data/books.json'
];

console.log('\nRequired Files:');
files.forEach(file => {
  const filePath = path.join(__dirname, file);
  console.log(`${file}: ${fs.existsSync(filePath) ? 'Exists ✅' : 'Missing ❌'}`);
});

console.log('\nPackage.json Dependencies:');
const packageJson = fs.readJSONSync(path.join(__dirname, 'package.json'), { throws: false }) || {};
const deps = packageJson.dependencies || {};
console.log(Object.keys(deps).map(dep => `${dep}: ${deps[dep]}`).join('\n'));

console.log('\nTo run the server: npm run dev');
