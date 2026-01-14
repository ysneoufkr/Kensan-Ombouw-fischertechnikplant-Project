import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(__dirname, '../kensan.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    profile_picture TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add profile_picture column if it doesn't exist (migration)
try {
  const columns = db.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>;
  const hasProfilePicture = columns.some(col => col.name === 'profile_picture');

  if (!hasProfilePicture) {
    db.exec('ALTER TABLE users ADD COLUMN profile_picture TEXT');
    console.log('✓ Added profile_picture column to users table');
  }
} catch (error) {
  console.error('Error checking/adding profile_picture column:', error);
}

export default db;
