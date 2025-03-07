const fs = require('fs').promises;
const path = require('path');

const USER_FILE_PATH = path.join(__dirname, '..', 'data', 'users.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.dirname(USER_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Read users from file
const readUsers = async () => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(USER_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, create it with empty array
      await fs.writeFile(USER_FILE_PATH, '[]');
      return [];
    }
    throw error;
  }
};

// Write users to file
const writeUsers = async (users) => {
  await ensureDataDir();
  await fs.writeFile(USER_FILE_PATH, JSON.stringify(users, null, 2));
};

module.exports = {
  readUsers,
  writeUsers
};
