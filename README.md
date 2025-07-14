# RP Estate 🏠

A modern, full-stack real estate web application that enables users to buy, sell, and rent properties with advanced search, secure authentication, image uploads, and direct messaging between users and landlords.

## 🚀 Tech Stack

### Frontend:
- **React** (with React Router for SPA navigation)
- **Redux & Redux Persist** (state management)
- **Tailwind CSS** (utility-first styling)
- **Swiper.js** (image carousels)
- **Vite** (build tool)

### Backend:
- **Node.js & Express.js** (REST API)
- **MongoDB & Mongoose** (database)
- **JWT** (authentication)
- **Nodemailer** (email notifications)
- **Cloudinary** (image storage)
- **Multer** (file uploads)
- **dotenv** (environment variable management)

## ✨ Key Features

- **User Authentication:** Secure sign-up, sign-in, and sign-out with JWT and HTTP-only cookies
- **Profile Management:** Users can update their profile, change password, and delete their account
- **Property Listings:** Authenticated users can create, update, and delete property listings with up to 6 images per listing
- **Image Uploads:** Images are uploaded to Cloudinary for fast, reliable storage and delivery
- **Advanced Search & Filters:** Search listings by keyword, type (rent/sale), price, amenities (parking, furnished), and offers. Sort results by price or date
- **Responsive UI:** Fully responsive design using Tailwind CSS for seamless experience on all devices
- **Listing Details:** Each listing page features a Swiper image carousel, property details, and amenities
- **Direct Messaging:** Users can contact landlords directly via email using a secure backend-powered form (Nodemailer)
- **Admin & Security:** Only listing owners can edit or delete their listings. All sensitive data is managed via environment variables

## 📦 Folder Structure

```
RP-Estate/
├── api/                    # Express backend
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication & validation
│   ├── config/            # Database & service configs
│   └── utils/             # Helper functions
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   ├── assets/        # Images & static files
│   │   └── utils/         # Helper functions
│   ├── public/            # Public assets
│   └── package.json
├── .env                   # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Email service (Gmail, SendGrid, etc.)

### Environment Variables
Create a `.env` file in the root directory with the variables mentioned in env-example file:

### Backend Setup
```bash
# Navigate to the project root
cd RP-Estate

# Install backend dependencies
npm install

# Start the backend server
npm run dev
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/google` - Google OAuth authentication

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/update/:id` - Update user profile
- `DELETE /api/user/delete/:id` - Delete user account

### Property Listings
- `GET /api/listing/` - Get all listings with filters
- `GET /api/listing/:id` - Get specific listing
- `POST /api/listing/create` - Create new listing
- `PUT /api/listing/update/:id` - Update listing
- `DELETE /api/listing/delete/:id` - Delete listing
- `GET /api/listing/user/:userId` - Get user's listings

### Communication
- `POST /api/contact` - Send message to landlord

## 🛡️ Security & Best Practices

- All API keys and secrets are stored in `.env` and never committed to version control
- JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
- Input validation and error handling are implemented throughout the stack
- CORS is configured for secure cross-origin requests
- Password hashing using bcrypt
- Protected routes with authentication middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions or collaboration, please contact the project maintainer (Ujjawal Patidar).

**RP Estate** — Find your next perfect place with ease! 🏡✨

---

*Built with ❤️ using React, Node.js, and MongoDB*