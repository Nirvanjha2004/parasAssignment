const fs = require('fs-extra');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

class User {
  static async getAll() {
    try {
      return await fs.readJSON(usersFilePath);
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  }

  static async getById(id) {
    const users = await this.getAll();
    return users.find(user => user.id === id);
  }

  static async getByEmail(email) {
    const users = await this.getAll();
    return users.find(user => user.email === email);
  }

  static async create(userData) {
    const users = await this.getAll();
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await fs.writeJSON(usersFilePath, users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async update(id, userData) {
    const users = await this.getAll();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      throw new Error('User not found');
    }
    
    users[index] = { ...users[index], ...userData };
    await fs.writeJSON(usersFilePath, users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  }

  static async delete(id) {
    const users = await this.getAll();
    const filteredUsers = users.filter(user => user.id !== id);
    await fs.writeJSON(usersFilePath, filteredUsers);
  }
}

module.exports = User;
