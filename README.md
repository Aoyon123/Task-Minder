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
1. Clone the Repository
git clone https://github.com/Aoyon123/task-minder.git
cd task-minder

2. Backend Setup
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



3. Database Migration
# Run migrations
php artisan migrate

4. Database Seeding
# Seed the database with sample data
php artisan db:seed

# Or run specific seeder
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=TaskSeeder

5. Frontend Setup
# Install Node dependencies
npm install

6. Queue Configuration
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
php artisan test --filter=TaskTest

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
  "password": "password123",
  "password_confirmation": "password123"
}

Login

POST /api/login
Content-Type: application/json

{
  "email": "fahamidul123@gmail.com",
  "password": "password123"
}


Get All Tasks
GET /api/tasks
Authorization: Bearer {token}

Create Task
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README file",
  "status": "to-do"
}

Update Task
PUT /api/tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "in-progress"
}


Delete Task
DELETE /api/tasks/{id}
Authorization: Bearer {token}







