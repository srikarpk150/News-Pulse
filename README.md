# News Pulse

A modern news aggregation mobile application built with React Native and Expo, featuring personalized news feeds, trending stories, and user authentication.

## Features

- **User Authentication**: Secure login and signup system powered by Appwrite.
- **Personalized News Feed**: Customizable news categories for a tailored reading experience.
- **Trending Section**: Stay updated with the most popular stories across different categories.
- **Browse Categories**: Explore news by specific categories of interest.
- **Profile Management**: User profile customization and password management.
- **Dark Theme**: Eye-friendly dark mode design.
- **Share Functionality**: Easy sharing of articles with others.
- **Responsive Design**: Smooth performance across different device sizes.

## Tech Stack

- **React Native**
- **Expo**
- **TypeScript**
- **Appwrite** (Backend & Authentication)
- **News API**
- **React Navigation**
- **React Native Paper**
- **Axios**

## Prerequisites

Ensure you have the following installed before setting up the project:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Expo CLI**
- **Appwrite instance**
- **News API key**

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
EXPO_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
EXPO_PUBLIC_APPWRITE_ID=your_appwrite_project_id
EXPO_PUBLIC_API_KEY=your_newsapi_key
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/srikarpk150/news-pulse.git
   cd news-pulse
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npx expo start
   ```

## Project Structure

```
/news-pulse
│── /app
│   ├── /appwrite          # Appwrite service configuration and context
│   ├── /Routes            # Navigation configuration
│   ├── /screens           # Application screens
│   ├── /newsapi           # News API integration
│── /components            # Reusable UI components
│── /assets                # Static assets like images and fonts
│── /constants             # Application constants and theme configuration
```

## Key Features Implementation

### Authentication
The app uses **Appwrite** for secure user authentication, implementing:
- Email/password signup
- Secure login
- Password reset functionality
- Session management

### News Feed
News content is fetched from **NewsAPI**, featuring:
- Category-based news filtering
- Trending news section
- Article detail view
- Share functionality

### User Preferences
Users can:
- Select preferred news categories
- Save and manage reading preferences
- Customize their profile
- Reset their password

## Styling

The app features a **dark theme** with:
- **Primary color**: `#FF4500` (Orange Red)
- **Background**: `#121212` (Dark)
- **Text colors**: White and various gray shades
- **Custom font**: Times New Roman

## Acknowledgments

- **News API** for providing news content.
- **Appwrite** for backend services.
- **React Native community** for excellent documentation and support.

