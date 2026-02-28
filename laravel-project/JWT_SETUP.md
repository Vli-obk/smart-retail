# JWT Authentication Setup Guide

This document explains the JWT authentication setup for the Retail Management System.

## Configuration Changes Made

### 1. Composer Dependencies
- `tymon/jwt-auth` package is already installed

### 2. Authentication Configuration (`config/auth.php`)
- API guard configured to use JWT driver
- Default guard set to 'web' for web routes
- API guard uses 'users' provider

### 3. JWT Configuration (`config/jwt.php`)
- JWT configuration file published and configured
- Token TTL: 60 minutes
- Refresh TTL: 20160 minutes (2 weeks)
- Algorithm: HS256
- Blacklist enabled

### 4. User Model (`app/Models/User.php`)
- Implements `JWTSubject` interface
- Added `getJWTIdentifier()` and `getJWTCustomClaims()` methods
- Includes custom claim for user role

### 5. JWT Middleware (`app/Http/Middleware/JwtMiddleware.php`)
- Custom middleware for JWT authentication
- Validates token and checks admin role
- Handles token expiration and invalidation
- Returns proper JSON responses for errors

### 6. Route Configuration (`routes/api.php`)
- All protected routes use `jwt.auth` middleware
- Authentication endpoints configured:
  - `POST /api/auth/login` - Public
  - `POST /api/auth/logout` - Protected
  - `GET /api/auth/me` - Protected
  - `POST /api/auth/refresh` - Protected

### 7. Environment Variables (`.env`)
Added JWT configuration variables:
```
JWT_SECRET=your_generated_secret_key
JWT_TTL=60
JWT_REFRESH_TTL=20160
JWT_ALGO=HS256
JWT_BLACKLIST_ENABLED=true
JWT_BLACKLIST_GRACE_PERIOD=0
```

## API Endpoints

### Authentication

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "password"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin User",
            "email": "admin@example.com",
            "role": "admin"
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "token_type": "bearer",
        "expires_in": 3600
    }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}
```

#### Refresh Token
```
POST /api/auth/refresh
Authorization: Bearer {token}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer {token}
```

### Protected Routes

All routes below require JWT authentication:
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search?term={term}` - Search products
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/sales/{id}` - Get sale
- `GET /api/sales/product/{productId}` - Get sales by product
- `GET /api/sales/date-range/{startDate}/{endDate}` - Get sales by date range
- `GET /api/stock-alerts` - Get low stock alerts
- `GET /api/dashboard/stats` - Get dashboard statistics

## Usage Examples

### Using cURL

1. **Login to get token:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

2. **Access protected route:**
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Set up environment variables:
   - `base_url`: `http://localhost:8000`
   - `token`: (will be set after login)

2. Login request:
   - Method: POST
   - URL: `{{base_url}}/api/auth/login`
   - Body: JSON with email and password
   - Tests: Set token from response

3. Protected requests:
   - Add Authorization header: `Bearer {{token}}`

## Error Responses

### 401 Unauthorized
```json
{
    "success": false,
    "message": "Token expired"
}
```

### 403 Forbidden
```json
{
    "success": false,
    "message": "Access denied. Admin role required."
}
```

### 422 Validation Error
```json
{
    "success": false,
    "message": "Validation errors",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    }
}
```

## Security Features

1. **Token Expiration**: Tokens expire after 60 minutes
2. **Token Refresh**: Can refresh tokens within 2 weeks
3. **Blacklist**: Invalidated tokens are blacklisted
4. **Role-based Access**: Only admin users can access protected routes
5. **Hashed Passwords**: Passwords are securely hashed
6. **Custom Claims**: User role included in JWT payload

## Setup Commands

```bash
# Install dependencies
composer install

# Generate JWT secret
php artisan jwt:secret

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

## Testing

Use the provided API endpoints to test the authentication flow:

1. Create an admin user in the database
2. Login to get JWT token
3. Use token to access protected endpoints
4. Test token refresh functionality
5. Test logout and token invalidation
