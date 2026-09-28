# Smart Trading Website

A full-stack, professional stock market trading platform and portfolio management dashboard.

## Features
- **User Authentication:** Secure registration and login with JWT and role-based access (Trader vs Admin).
- **Dashboard Analytics:** Visual real-time portfolio performance using Chart.js.
- **Market Data:** Live simulation of 50+ real-world global and Indian stocks (AAPL, MSFT, RELIANCE, TCS, etc.) with real-time price fluctuation.
- **Admin Panel:** Separate dashboard for administrators to manage users, view system-wide transaction records, and monitor overall platform statistics.
- **Portfolio Management:** Track available balance, invested amount, and total Profit & Loss dynamically.
- **Learning Hub:** Built-in educational modules for beginner to advanced traders.
- **Notifications System:** Alert system for system events and market volatility.

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Lucide React (Icons), Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose (ODM)
- **Security:** bcryptjs (Password Hashing), JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MohithPilla/TradingWebsite.git
   cd TradingWebsite
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/smart-trading
   JWT_SECRET=your_super_secret_jwt_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup Frontend:**
   Open a new terminal tab.
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend server:
   ```bash
   npm run dev
   ```

4. **Access the App:**
   Open your browser and navigate to `http://localhost:5173`

## Project Structure
- `/frontend` - Contains the Vite React frontend application.
- `/backend` - Contains the Node.js Express backend API, Mongoose models, and seeding scripts.

## License
MIT License
