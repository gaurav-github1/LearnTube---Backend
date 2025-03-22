# LearnTube

A dedicated platform for educational video content, similar to YouTube but specifically focused on learning materials.

## Overview

LearnTube is a robust video-sharing platform designed for educational content creators and learners. The platform enables users to upload, view, and interact with educational videos across various subjects and disciplines.

## Features

### Current Features
- 🔐 User authentication (signup, login, logout)
- 👤 User profile management
- 📹 Video upload with Cloudinary integration
- 🖼️ Thumbnail generation and management
- 📝 Video metadata (title, description, duration)
- 👀 View tracking for videos
- 🔍 Basic search functionality

### Upcoming Features
- 📊 Advanced analytics for content creators
- 💬 Comment system for videos
- 👍 Like/dislike functionality
- 📋 Playlist creation and management
- 🔔 Notification system
- 📱 Mobile responsive design
- 📚 Course creation with multiple videos
- 🏷️ Tagging and categorization system
- 🌐 Multi-language support
- 📲 Progressive Web App (PWA) support
- 🔄 Recommendation engine

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Cloudinary for media storage
- Multer for file handling

### Future Frontend (Planned)
- React.js
- Responsive UI with modern design principles

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/learntube.git
cd learntube
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### User Management
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update user profile

### Video Management
- `POST /api/v1/videos` - Upload a new video
- `GET /api/v1/videos` - Get all videos (with pagination)
- `GET /api/v1/videos/:videoId` - Get a specific video
- `PATCH /api/v1/videos/:videoId` - Update video details
- `DELETE /api/v1/videos/:videoId` - Delete a video
- `GET /api/v1/videos/user/:userId` - Get videos by user

## Deployment

### Docker (Upcoming)
Docker support will be added for containerized deployment.

### Traditional Deployment
1. Set up a production MongoDB instance
2. Configure environment variables for production
3. Build the application:
```bash
npm run build
```
4. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgements

- Express.js for the web framework
- MongoDB for the database
- Cloudinary for media storage
- All our contributors and supporters