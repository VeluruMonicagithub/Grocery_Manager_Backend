# ⚙️ My Pantry - API Core Service

This is the robust Node.js backend for the My Pantry ecosystem. It serves as the orchestration layer between the React frontend, Supabase database, and Google Gemini AI models.

## 🚀 Deployment Links (Production)
*   **Live Application (Frontend)**: [https://manageyourpantry.netlify.app/](https://manageyourpantry.netlify.app/)
*   **Production API (Backend)**: [https://grocery-manager-backend.onrender.com/api](https://grocery-manager-backend.onrender.com/api)

---

## 📖 Project Overview
The My Pantry backend is built on a modular MVC architecture, providing secure RESTful endpoints for inventory management, household collaboration, and AI-driven insights. It handles complex business logic like the "Complete Shopping Trip" synchronization, where list items are atomically moved into the pantry inventory.

---

## 🛠️ Tech Stack
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: Supabase (PostgreSQL)
*   **AI Engine**: Google Gemini 2.5-Flash
*   **Authentication**: Supabase Auth (JWT) + Custom Invite Token Proxy
*   **Utilities**: UUID

---

## 📡 API Documentation

### 1. Pantry Management
*   `GET /api/pantry`: Retrieve all items for the authenticated household.
*   `POST /api/pantry`: Add new items with threshold tracking.
*   `PUT /api/pantry`: Update quantities or expiration details.

### 2. AI Services
*   `POST /api/ai/`: Contextual chat with the "AI Chef" (Pantry-aware).
*   `POST /api/ai/estimate-price`: Real-time market price estimation in INR.
*   `POST /api/ai/estimate-nutrition`: Fetching nutritional data for ingredients.

### 3. Shopping & History
*   `POST /api/grocery/complete`: Atomic operation to clear list and update pantry.
*   `GET /api/analytics`: Aggregate data for spending and health charts.

### 4. Members & Sharing
*   `POST /api/members/generate-link`: Create secure UUID sharing tokens.
*   `POST /api/members/accept`: Link an existing user to a household list.

---

## 🗄️ Database Schema Explanation
The database is built on **Supabase (PostgreSQL)**. It is comprised of 9 core tables, tightly coupled using Foreign Keys, cascading deletes, and strict Row Level Security (RLS) to ensure multi-tenant data isolation.

### Core Tables & Relationships
1.  **`profiles`**: Stores extended user data (e.g., `full_name`, `dietary_preferences`). Linked 1:1 with `auth.users(id)`.
2.  **`pantry_items`**: The dynamic inventory ledger. Tracks `quantity`, `unit`, `threshold` (for low-stock alerts), and `expiry_date`. Linked to `auth.users(id)`.
3.  **`grocery_lists`**: Defines separate shopping trips/lists, tracking `budget_limit` and active modes. Linked to `auth.users(id)`.
4.  **`grocery_items`**: Temporary items needed for a shopping trip, including `price` and `coupon` status. Linked to `grocery_lists(id)`.
5.  **`recipes`**: A global dictionary of meals, tracking macros (`calories`, `protein`, `carbs`, `fat`) and `dietary_tags`.
6.  **`recipe_ingredients`**: Join table mapping specific `ingredient_name` and `quantity` constraints to a `recipes(id)`.
7.  **`meal_plans`**: Associates a `user_id` and a `recipe_id` on a specific `planned_date` for scheduling.
8.  **`coupons`**: Global table tracking available `discount_percentage` values associated with `grocery_item_name` substrings.
9.  **`shopping_history`**: Immutable archival table tracking the `total_spent` for historical charts. Linked to `auth.users(id)` and `grocery_lists(id)`.

### 🔐 Security & Row Level Security (RLS)
The database enforces strict zero-trust access controls directly at the PostgreSQL layer via **Row Level Security (RLS)**.
*   **Enabled on Tables**: `profiles`, `pantry_items`, `grocery_lists`, `grocery_items`, `meal_plans`, `shopping_history`.
*   **Enforcement Rule**: Users can only query, insert, or modify rows where the `user_id` matches their authenticated JWT token (`auth.uid()`). 
*   **Cascading Rules**: Items within a grocery list (`grocery_items`) are secured via relational checks: a user can only interact with a `grocery_item` if they implicitly own the parent `grocery_lists(id)`.

---

## 📦 Installation Steps

1.  **Clone the Repository**:
    ```bash
    git clone [BACKEND_REPO_URL]
    cd backend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables**:
    Create a `.env` file in the root:
    ```env
    PORT=5001
    SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_key
    GEMINI_API_KEY=your_google_ai_key
    ```
4.  **Start the Server**:
    ```bash
    npm start
    ```

---

## 🛡️ Authentication Logic
The backend uses a dual-verification system:
1.  **Standard Mode**: Verifies Bearer JWT tokens via Supabase Auth.
2.  **Guest Mode**: Verifies `Invite <token>` headers to "proxy" access to an owner's pantry without requiring a guest login.
