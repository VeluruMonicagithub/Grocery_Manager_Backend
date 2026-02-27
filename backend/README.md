# ⚙️ My Pantry - API Core Service

This is the robust Node.js backend for the My Pantry ecosystem. It serves as the orchestration layer between the React frontend, Supabase database, and Google Gemini AI models.

## 🚀 Deployment Link
*   **Production API**: [https://your-app-name.onrender.com](DEPLOYMENT_LINK_HERE)

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
*   **Utilities**: Nodemailer, UUID

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
The database is built on **Supabase (PostgreSQL)** with the following core relationships:
*   **`profiles`**: Extended user data linked to `auth.users`.
*   **`pantry_items`**: The primary inventory table (FK: `user_id`).
*   **`grocery_items`**: Temporary shopping tracking linked to `list_id`.
*   **`shopping_history`**: Immutable records of past purchases for trend analysis.
*   **`invite_links`**: UUID-based tokens for secure household guest access.

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
