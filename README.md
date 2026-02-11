# Inventory Management System
A full-stack application built with Angular (frontend) and TypeScript + Express (backend) for managing gadget inventory with secure authentication.

# Project Structure
```
├── frontend/   # Angular app
├── backend/    # TypeScript Node.js API with MySQL
```

# Features
- Gadget CRUD operations
- Bulk update & bulk delete
- MySQL database integration
- JWT-based authentication
- TypeScript for type-safe code
- Encrypted sensitive gadget information

# Setup

## Backend
```bash
cd backend
npm install

# Create .env file based on .env.example
cp .env.example .env

# Update .env with your MySQL credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=gadget_store

# Build TypeScript
npm run build

# Run in production
npm start

# Or run in development with ts-node
npm run dev
```

## Frontend
```bash
cd frontend
npm install
ng serve
```

## Access
- Backend API: http://localhost:3000
- Frontend: http://localhost:4200

# Database Setup
Ensure MySQL is running and accessible. 

# License
For learning and demonstration purposes.