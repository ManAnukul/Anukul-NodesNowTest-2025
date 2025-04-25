# Testing and Knowledge Preparation: Cooperative Education Program

## Tech Stack Selection
- **NestJS**: Chosen for its well-structured architecture and TypeScript support.
- **MySQL**: Selected for its high performance and ease of use as a relational database.
- **Docker**: Utilized to streamline development and deployment processes.

## Authentication & Authorization
- **JWT (JSON Web Token)** is used for authentication, ensuring stateless user verification.
- **API Authentication**: All Task-related API endpoints require authentication, except `POST /users`, which is used for user registration.
## Database Design
- **Relational Database**: MySQL is used to maintain structured relationships between `users` and `tasks`.
- **User Table**:
  - `id` (UUID, primary key)
  - `email` (string, unique, required)
  - `password` (hashed, required)
- **Task Table**:
  - `id` (UUID, primary key)
  - `title` (string, required)
  - `description` (string, optional)
  - `status` (enum: "pending", "in_progress", "completed", default: "pending")
  - `userId` (foreign key to User, required)


## Service Structure
- **Controller-Service-Repository Pattern**
  - **Controller**: Handles incoming requests and delegates tasks to the service layer.
  - **Service**: Implements business logic and interacts with the repository layer.
  - **Repository**: Manages database interactions and queries efficiently.
 
---

## Docker compose🐳
In my docker-compose setup, can run the command `docker-compose up`, and both the database and the app will start together.

---

## 🚀 Installation

Follow these steps to set up the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/AT74PH0L/AT74PH0L-nodesnow-test-2025.git
cd AT74PH0L-nodesnow-test-2025
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file and add the following:
```bash
DATABASE_HOST=db #database contrainer name
DATABASE_PORT=3306
DATABASE_NAME=mydb
DATABASE_USERNAME=user
DATABASE_PASSWORD=password

JWT_SECRET=my_secret
```

### 4. Setup Docker for MySQL
Create a `docker-compose.yml` file and add the following:
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:latest
    container_name: db
    environment:
      MYSQL_ROOT_PASSWORD: ${DATABASE_PASSWORD}
      MYSQL_DATABASE: ${DATABASE_NAME}
      MYSQL_USER: ${DATABASE_USERNAME}
      MYSQL_PASSWORD: ${DATABASE_PASSWORD}
    ports:
      - '${DATABASE_PORT}:3306'
    volumes:
      - mysql_data:/var/lib/mysql
volumes:
  mysql_data:
```
Start MySQL with Docker:
```bash
docker-compose up -d
```

### 5. Start the application
Run the following command to start the server:
```bash
npm run start:dev
```
The application will be available at `http://localhost:3000` 🎉

---

## 📝 API Documentation
Swagger: API Documentation
`http://localhost:3000/api/docs/`

### 🔑 Authentication
- **POST /auth/login** - Authenticate using email and password.
  ```json
  {
    "email": "mock@mock.com",
    "password": "M0ck!123"
  }
  ```

### User Management (Authentication required except for registration)
- **POST /users** - Register a new user.
  ```json
  {
    "email": "mock@mock.com",
    "password": "M0ck!123"
  }
  ```
- **PATCH /users** - (🔒 Requires authentication) Update user password.
  ```json
  {
    "oldPassword": "M0ck!123",
    "newPassword": "M0ck!12345"
  }
  ```
- **GET /users/{id}** - (🔒 Requires authentication) Retrieve user information.
  - Example: `http://localhost:3000/users/12345`
- **DELETE /users/{id}** - (🔒 Requires authentication) Delete a specific user.
  - Example: `http://localhost:3000/users/12345`


### Task Management (🔒 Requires authentication for all endpoints)
- **POST /tasks** - Create a new task.
  ```json
  {
    "title": "Title name",
    "description": "Description" // Optional
  }
  ```
- **GET /tasks** - Retrieve all tasks.
- **GET /tasks/{id}** - Retrieve a specific task.
  - Example: `http://localhost:3000/tasks/12345`
- **PATCH /tasks/{id}** - Update a task.
  - Example: `http://localhost:3000/tasks/12345`
  ```json
  {
    "title": "New title",
    "description": "New description",
    "status": "in_progress" // ENUM value
  }
  ```
- **DELETE /tasks/{id}** - Delete a specific task.
  - Example: `http://localhost:3000/tasks/12345`

---
