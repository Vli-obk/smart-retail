# Smart Retail

Full-stack retail management platform with an AI-powered service that predicts which products are likely to remain unsold in stock, helping retailers cut waste and optimize inventory decisions.

---

## About

Smart Retail is a full-stack application built to help retail businesses manage inventory more intelligently. Beyond standard stock and sales management, it includes a dedicated AI service that analyzes product and sales data to flag items at risk of sitting unsold — giving store managers early warning to discount, bundle, or reallocate stock before it becomes dead inventory.

## Features

- Inventory and product management
- Sales tracking and reporting
- Client-facing storefront / registration flow
- AI-driven prediction of slow-moving and likely-unsold stock
- Role-based access for staff and admins

## Tech Stack

**Backend**
- Laravel (PHP) — core application logic, authentication, database layer

**Frontend**
- React — client-facing and admin interfaces

**AI Service**
- Python — lightweight LLM-based service that analyzes stock and sales patterns to predict which products are likely to remain unsold

**Database**
- MySQL / PostgreSQL (Laravel-managed)

## Project Structure

```
smart-retail/
├── backend/       # Laravel API — auth, inventory, orders, business logic
├── frontend/      # React app — UI for staff and customers
├── ai-service/    # Python service — unsold-stock prediction model
└── git_op.bat     # Local dev/git helper script
```

## How the AI Service Works

The `ai-service` module uses a small LLM to analyze historical sales and current stock data, then predicts which products are at the highest risk of remaining unsold. This lets the backend surface early alerts to store managers, enabling proactive decisions — discounts, bundling, or restocking adjustments — before inventory turns into a loss.

## Getting Started

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

### AI Service (Python)
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

## Contributors

- [Ali (Vli-obk)](https://github.com/Vli-obk)
- [AminaJeddou](https://github.com/AminaJeddou)

## Status

Actively developed as part of an academic PFE (final year) project.
