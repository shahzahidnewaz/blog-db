# BlogDB — Console-Based Blog Management System

A console/CLI blog management application built with **Node.js** and **MySQL**, featuring role-based access for readers, registered users, and admins. Built as a Database Project.

## 📋 Table of Contents
- [Description](#description)
- [Tech Stack](#tech-stack)
- [Database Information](#database-information)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage Instructions](#usage-instructions)
- [Creating an Admin Account](#creating-an-admin-account)
- [Notes](#notes)

## Description

BlogDB is a terminal-based blogging platform where:
- **Anyone** can browse all blogs without an account (read-only access).
- **Registered users** can log in and manage their own blogs (create, view, search, update, delete).
- **Admins** can manage all users and all blogs across the platform, including deactivating or deleting accounts.

The app is built with a layered architecture (config → models → controllers → entry point) so the data layer, business logic, and console UI are cleanly separated — similar to how a real Express/REST API would be structured, minus the HTTP layer.

## Tech Stack

| Layer | Technology |
|---|---|
| Language / Runtime | JavaScript (Node.js) |
| Database | MySQL |
| DB Driver | [mysql2](https://www.npmjs.com/package/mysql2) (promise-based) |
| Password Hashing | [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| Environment Config | [dotenv](https://www.npmjs.com/package/dotenv) |
| Console Input | `readline` (Node.js built-in) |
| Package Manager | npm |
| Module System | CommonJS |

## Database Information

**Database name:** `blogdb`
The database and both tables are **created automatically** on first run — no manual SQL setup required (though `sql/schema.sql` is provided if you'd prefer to run it manually).

### `users` table

| Column | Type | Notes |
|---|---|---|
| `id` | INT, AUTO_INCREMENT | Primary key |
| `firstname` | VARCHAR(100) | |
| `lastname` | VARCHAR(100) | |
| `email` | VARCHAR(150) | Unique |
| `password` | VARCHAR(255) | Stored as a bcrypt hash |
| `isActive` | BOOLEAN | Default `true` |
| `role` | VARCHAR(20) | Default `'user'`; set to `'admin'` manually |
| `createAt` | DATETIME | Default current timestamp |
| `updateAt` | DATETIME | Auto-updates on row change |

### `blogs` table

| Column | Type | Notes |
|---|---|---|
| `id` | INT, AUTO_INCREMENT | Primary key |
| `userId` | INT | Foreign key → `users.id` |
| `blogTitle` | VARCHAR(255) | |
| `blog` | TEXT | Blog content |
| `category` | VARCHAR(100) | |
| `createAt` | DATETIME | Default current timestamp |
| `updateAt` | DATETIME | Auto-updates on row change |

**Relationship:** One-to-many — one user can have many blogs. `blogs.userId` references `users.id` with `ON DELETE CASCADE`, so deleting a user automatically removes their blogs.

## Features

### Reader (no login required)
- View all blogs from all users (`allBlog()`)

### Registered User (after login)
- View your own blogs (or `"No blogs are found"` if none exist)
- Search any blog by ID or title
- Create a new blog
- Update your own blog
- Delete your own blog

### Admin (after login with an admin account)
- View all registered users (`allUsers()`)
- View all blogs from all users (`allUsersBlog()`)
- Search any blog by ID or title
- Update a user's `isActive` status (deactivated users see `"User is deactivated"` on login attempt)
- Delete any user (their blogs are removed automatically)
- Delete any blog

### Security
- Passwords are hashed with bcrypt before being stored — never saved in plain text
- Deactivated users are blocked at login, regardless of correct password

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) installed and running locally (or accessible remotely)

### 1. Get the project
Download/extract the project folder, or clone it if it's on GitHub:
```bash
git clone <your-repo-url>
cd blogdb-project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the example env file:
```bash
cp .env.example .env       # Windows: copy .env.example .env
```
Edit `.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blogdb
DB_PORT=3306
```

### 4. Start MySQL
Make sure your local MySQL server is running before starting the app.

### 5. Run the app
```bash
npm start
```
On first run, the app automatically creates the `blogdb` database and both tables — no manual SQL needed.

## Usage Instructions

When the app starts, you'll see the **Main Menu**:
```
=== BlogDB ===
1. View All Blogs
2. Login
3. Register
4. Exit
```

- **View All Blogs** — browse all blogs immediately, no account needed.
- **Register** — create a new account (first name, last name, email, password).
- **Login** — log into an existing account. You'll be routed to either the **User Menu** or **Admin Menu** depending on your account's role.

### User Menu (after logging in as a regular user)
```
1. View Your Blogs
2. Search Blog by ID/Title
3. Create Blog
4. Update Blog
5. Delete Blog
6. Logout
```

### Admin Menu (after logging in as an admin)
```
1. View All Users
2. View All Blogs
3. Search Blog by ID/Title
4. Update User
5. Delete User
6. Delete Blog
7. Logout
```

## Creating an Admin Account

New accounts default to `role = 'user'`. To create an admin:

1. Register a normal account through the app (option 3 on the Main Menu).
2. Stop the app, then run:
   ```bash
   npm run seed-admin
   ```
3. Enter that account's email when prompted — it will be promoted to `role = 'admin'`.
4. Restart the app (`npm start`) and log in with that account to access the Admin Menu.

**Alternative:** run this SQL manually against the `blogdb` database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'someone@example.com';
```

## Notes

- Blog search matches by **exact ID** or a **partial, case-insensitive title match**.
- Deleting a user cascades and deletes all of their blogs automatically (`ON DELETE CASCADE`).
- All database queries use parameterized statements (`?` placeholders) to prevent SQL injection.
- This is a console application — there is no web server or frontend involved.

## Project Demonstration
- [Demonstration](https://drive.google.com/file/d/1o8rpe936iS9Yc1V2g7ACmUgv4pSJXRPw/view?usp=sharing)