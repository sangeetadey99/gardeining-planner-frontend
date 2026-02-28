# Gardening Planner Frontend

## Project Overview

The Gardening Planner Frontend is a modern, responsive web application designed to help gardening enthusiasts manage their gardens efficiently. Built with React and Vite, this application provides an intuitive interface for tracking plants, managing gardening tasks, maintaining journals, and connecting with a community of fellow gardeners. The frontend communicates with a robust backend API to provide real-time data synchronization and a seamless user experience.

## Tech Stack

- **React 19** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing for single-page applications
- **TailwindCSS** - Utility-first CSS framework for styling
- **Axios** - HTTP client for API communication
- **Framer Motion** - Animation library for smooth transitions
- **React Icons** - Icon library for UI components
- **React Hot Toast** - Notification system for user feedback
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - CSS vendor prefixing

## Features

### 🌱 Plant Management
- Add and track multiple plants in your garden
- Monitor plant health and growth stages
- Set watering schedules and care reminders
- Categorize plants by type, sunlight needs, and watering frequency

### 📋 Task Management
- Create and manage gardening tasks (watering, pruning, fertilizing, etc.)
- Set due dates and priority levels
- Track task completion status
- Receive notifications for upcoming tasks

### 📔 Garden Journal
- Maintain detailed gardening journals
- Add photos and notes about plant progress
- Track growth patterns and seasonal changes
- Document pest issues and solutions

### 🏡 Garden Layout Planning
- Design and visualize garden layouts
- Plan plant placement for optimal growth
- Save multiple garden designs
- Get spacing and companion planting recommendations

### 🐛 Pest & Disease Management
- Identify common garden pests and diseases
- Access treatment solutions and prevention tips
- Track pest incidents and treatments
- Get organic and chemical treatment options

### 🌤️ Weather Integration
- Get weather forecasts for your location
- Receive weather-based gardening recommendations
- Plan activities based on weather conditions
- Track rainfall and temperature patterns

### 🌾 Harvest Tracking
- Record harvest yields and dates
- Track produce quality and quantity
- Maintain harvest history for planning
- Get storage and preservation tips

### 💡 Gardening Tips
- Access seasonal gardening advice
- Get plant-specific care instructions
- Learn about companion planting
- Discover organic gardening techniques

### 👥 Community Features
- Connect with other gardeners
- Share experiences and photos
- Get advice from community members
- Participate in gardening discussions

## Installation Steps

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sangeetadey99/gardeining-planner-frontend.git
   cd gardeining-planner-frontend/gardening-frontend-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://gardeining-planner-backend-server.onrender.com/api
   VITE_APP_NAME=Gardening Planner
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_APP_NAME` | Application name | No |

## Project Structure

```
gardening-frontend-client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles and Tailwind config
│   ├── assets/            # Images and other assets
│   └── App.jsx            # Main application component
├── package.json           # Project dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # TailwindCSS configuration
└── README.md              # This file
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Deployment

**Frontend Application**: https://gardeining-planner-frontend.netlify.app

### Deployment Information
- **Platform**: Netlify
- **Build Tool**: Vite
- **Framework**: React 19
- **Status**: Active and running

The frontend is deployed on Netlify with automatic deployments from the main branch. The application is optimized for performance and includes proper SEO meta tags, responsive design, and progressive web app features.

## API Integration

The frontend integrates with the Gardening Planner Backend API for all data operations:

- **Authentication**: User registration, login, and profile management
- **Plant Data**: CRUD operations for plant management
- **Tasks**: Task creation, updates, and completion tracking
- **Journal**: Journal entry management and storage
- **Community**: Social features and user interactions
- **Weather**: Real-time weather data integration
- **Tips**: Gardening advice and recommendations

## Browser Support

This application supports all modern browsers:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with proper sizing
- **Caching**: Service worker for offline functionality
- **Bundle Optimization**: Tree shaking and minification

