# Storefront Backend Project

An API for an online storefront, built with Node.js, Express, and PostgreSQL.

## Technologies Used
- **Node.js**: Runtime environment
- **Express**: Web framework
- **PostgreSQL**: Relational database
- **db-migrate**: Database migration tool
- **JSON Web Tokens (JWT)**: Authentication
- **Bcrypt**: Password hashing
- **Jasmine**: Testing framework

## Getting Started

### 1. Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storedb
POSTGRES_TEST_DB=storedb_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
ENV=dev
BCRYPT_PASSWORD=your_bcrypt_password
SALT_ROUNDS=10
TOKEN_SECRET=your_jwt_secret
```

### 4. Database Setup
1. Connect to PostgreSQL:
   ```bash
   psql -U postgres
   ```
2. Create the development and test databases:
   ```sql
   CREATE DATABASE storedb;
   CREATE DATABASE storedb_test;
   ```
3. Run migrations:
   ```bash
   npx db-migrate up
   ```

### 5. Running the Server
To start the server in development mode:
```bash
npm run watch
```
The server will run at `http://127.0.0.1:3000`.

## Ports
- **Server Port**: 3000
- **Database Port**: 5432

## Database Schema
For detailed database schema information, please refer to [REQUIREMENTS.md](REQUIREMENTS.md).

## API Endpoints
For a full list of available endpoints and their requirements, please refer to [REQUIREMENTS.md](REQUIREMENTS.md).

## Testing
To run the test suite:
```bash
npm run test
```
This command will:
1. Set the environment to `test`.
2. Compile TypeScript files.
3. Run migrations on the test database.
4. Execute Jasmine tests.
5. Drop the test database tables.
