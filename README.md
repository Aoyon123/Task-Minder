# Task-Minder
A full-stack task management application built with Laravel (backend) and React (frontend). Features include task CRUD operations, user authentication, email notifications, background job processing, and comprehensive testing.


 Features:

✅ User Authentication (Login/Register)
✅ Task Management (Create, Read, Update, Delete)
✅ Task Status Management (To Do, In Progress, Done)
✅ Real-time Task Filtering
✅ Email Notifications
✅ Background Job Processing with Queues
✅ Policy-based Authorization
✅ React Toast Notifications
✅ PHPUnit Testing

Installation & Setup
Clone the Repository
git clone :https://github.com/Aoyon123/Task-Minder.git
cd Task-Minder

Backend Setup
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Configure mail settings in .env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# Configure queue connection
QUEUE_CONNECTION=database



Database Migration
# Run migrations
php artisan migrate

Database Seeding
# Seed the database with sample data
php artisan db:seed

# Or run specific seeder
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=TaskSeeder


Frontend Setup
# Install Node dependencies
npm install

Queue Configuration
# Create queue table (if not already migrated)
php artisan queue:table
php artisan migrate

# Run queue worker
php artisan queue:work

Running the Application

Development Mode
Terminal 1 - Laravel Backend:
php artisan serve
The backend API will be available at http://localhost:8000

Terminal 2 - Queue Worker:
php artisan queue:work

Terminal 3 - React Frontend:
npm run dev
The frontend will be available at http://localhost:5173

 Running Tests
 # Run all tests
php artisan test

# Run specific test file
php artisan test --filter it_can_create_a_task

# Run specific test method
php artisan test --filter=


API Documentation
Authentication Endpoints
Register User

POST /api/register
Content-Type: application/json

{
  "name": "Fahamidul",
  "email": "fahamidul123@gmail.com",
  "password": "password123"
}

Success Response (201 Created):

{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Fahamidul",
      "email": "fahamidul123@gmail.com",
      "role_id": 2,
      "email_verified_at": null,
      "created_at": "2025-10-15T10:30:00.000000Z",
      "updated_at": "2025-10-15T10:30:00.000000Z",
      "role": {
        "id": 2,
        "name": "User",
        "created_at": "2025-10-15T10:00:00.000000Z",
        "updated_at": "2025-10-15T10:00:00.000000Z"
      }
    },
    "token": "1|laravel_sanctum_AbCdEfGhIjKlMnOpQrStUvWxYz123456"
  }
}


Login

POST /api/login
Content-Type: application/json
Accept: application/json

{
  "email": "fahamidul123@gmail.com",
  "password": "password123"
}

Success Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Fahamidul",
      "email": "fahamidul123@gmail.com",
      "role_id": 2,
      "email_verified_at": null,
      "created_at": "2025-10-15T10:30:00.000000Z",
      "updated_at": "2025-10-15T10:30:00.000000Z",
      "role": {
        "id": 2,
        "name": "User",
        "created_at": "2025-10-15T10:00:00.000000Z",
        "updated_at": "2025-10-15T10:00:00.000000Z"
      }
    },
    "token": "2|laravel_sanctum_XyZ987WvU654TsR321QpO098"
  }
}

Get Authenticated User (Me)
GET /api/me
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "success": true,
  "data": {
    "id": 1,
    "name": "Fahamidul",
    "email": "fahamidul123@gmail.com",
    "role_id": 2,
    "email_verified_at": null,
    "created_at": "2025-10-15T10:30:00.000000Z",
    "updated_at": "2025-10-15T10:30:00.000000Z",
    "role": {
      "id": 2,
      "name": "User",
      "created_at": "2025-10-15T10:00:00.000000Z",
      "updated_at": "2025-10-15T10:00:00.000000Z"
    }
  }
}

Logout
POST /api/logout
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "success": true,
  "message": "Logged out successfully"
}

Get All Tasks
GET /api/tasks
Authorization: Bearer {token}

Create Task
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README file",
  "status": "to-do"
}

Success Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive README file",
      "status": "to-do",
      "created_at": "2025-10-15T10:30:00.000000Z",
      "updated_at": "2025-10-15T10:30:00.000000Z",
      "user": {
        "id": 1,
        "name": "Fahamidul",
        "email": "fahamidul123@gmail.com"
      }
    },
    {
      "id": 2,
      "user_id": 1,
      "title": "Review pull requests",
      "description": "Check pending PRs on GitHub",
      "status": "in-progress",
      "created_at": "2025-10-15T11:00:00.000000Z",
      "updated_at": "2025-10-15T11:30:00.000000Z",
      "user": {
        "id": 1,
        "name": "Fahamidul",
        "email": "fahamidul123@gmail.com"
      }
    },
    {
      "id": 3,
      "user_id": 1,
      "title": "Deploy to production",
      "description": "Deploy latest version to production server",
      "status": "done",
      "created_at": "2025-10-14T09:00:00.000000Z",
      "updated_at": "2025-10-15T14:00:00.000000Z",
      "user": {
        "id": 1,
        "name": "Fahamidul",
        "email": "fahamidul123@gmail.com"
      }
    }
  ]
}

Update Task
PUT /api/tasks/{task}
task: Task ID (integer, required)
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "in-progress"
}

Success Response (200 OK):

{
  "success": true,
  "message": "Task updated successfully.",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Updated task title",
    "description": "Updated description",
    "status": "in-progress",
    "created_at": "2025-10-15T10:30:00.000000Z",
    "updated_at": "2025-10-15T16:00:00.000000Z",
    "user": {
      "id": 1,
      "name": "Fahamidul",
      "email": "fahamidul123@gmail.com"
    }
  }
}

Delete Task
DELETE /api/tasks/{task}
Headers:
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
Example Request:
DELETE /api/tasks/1

Success Response (200 OK):
{
  "success": true,
  "message": "Task deleted successfully."
}






