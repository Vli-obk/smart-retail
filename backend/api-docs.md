# API Documentation

Below is a summary of all available backend endpoints, including HTTP method, expected request body for write operations, and the typical JSON response structure.

| Endpoint | Method | Request Body (JSON) | Response Format (JSON) |
|---------|--------|---------------------|------------------------|
| `/api/auth/login` | POST | `{ "email": "string", "password": "string" }` | `{ "success": true|false, "message": "...", "data": { "user": {...}, "token": "...", "token_type": "bearer", "expires_in": number } }`  |
| `/api/auth/logout` | POST | _none_ | `{ "success": true|false, "message": "..." }` |
| `/api/auth/me` | GET | _none_ | `{ "success": true|false, "data": { "id": number, "name": "...", "email": "...", "role": "..." } }` |
| `/api/auth/refresh` | POST | _none_ | `{ "success": true|false, "data": { "token": "...", "token_type": "bearer", "expires_in": number } }` |
| `/api/products` | GET | _optional filters:_ `category_id`, `search` (query params) | `{ "success": true, "data": [ <ProductResource>... ], "pagination": { ... } }` |
| `/api/products` | POST | `{ "name": "string", "category": "string", "price": number, "current_stock": integer, "safety_stock": integer, "description": "string"? }` | `{ "success": true, "data": <ProductResource> }` (201) |
| `/api/products/{id}` | GET | _none_ | `{ "success": true|false, "data": <ProductResource> }` |
| `/api/products/{id}` | PUT/PATCH | any of: `name`, `category`, `price`, `current_stock`, `safety_stock`, `description` | `{ "success": true|false, "data": <ProductResource> }` |
| `/api/products/{id}` | DELETE | _none_ | `{ "success": true|false, "message": "..." }` |
| `/api/products/search` | GET | _query param_ `q` or others? (controller uses request->only(['category_id','search'])) | Same as GET /api/products |
| `/api/sales` | GET | _none_ | `{ "success": true, "data": [ <SaleResource>... ], "pagination": { total, per_page, current_page, last_page } }` |
| `/api/sales` | POST | `{ "product_id": integer, "quantity": integer, "date": "YYYY-MM-DD"? }` | `{ "success": true|false, "message": "...", "data": <SaleResource> }` (201) |
| `/api/sales/{id}` | GET | _none_ | `{ "success": true|false, "data": <SaleResource> }` |
| `/api/sales/product/{productId}` | GET | _none_ | `{ "success": true, "data": [ <SaleResource>... ] }` |
| `/api/sales/date-range/{startDate}/{endDate}` | GET | _none_ | `{ "success": true|false, "data": [ <SaleResource>... ] }` |
| `/api/stock-alerts` | GET | _none_ | `{ "success": true, "data": [ <ProductResource>... ], "count": integer }` |
| `/api/dashboard/stats` | GET | _none_ | `{ "success": true, "data": { "total_products": number, "total_sales": number, "total_revenue": number, "low_stock_count": number, "top_selling_products": [ <ProductResource>... ] } }` |


> **Note:**
> - All endpoints under `/api` except `/auth/login` require a valid JWT sent in the `Authorization: Bearer <token>` header.
> - `<ProductResource>` expands to:  
>   `{ "id": number, "category_id": number, "name": "...", "reference": "...", "price": number, "stock_quantity": number, "stock_min": number, "stock_max": number, "is_low_stock": bool, "is_overstock": bool, "category": { id, name }?, "created_at": "...", "updated_at": "..." }`.
> - `<SaleResource>` expands to:  
>   `{ "id": number, "product_id": number, "quantity": number, "unit_price": number, "total_price": number, "sale_date": "...", "product": { id, name, reference }?, "created_at": "...", "updated_at": "..." }`.

Feel free to copy this table into your frontend docs.  Adjust query parameter names as needed based on how you call the endpoints.