# Smart Car Parking Management System - Web App

This is the React-based web application for the Enderase Smart Car Parking Management System.

## Features

- Firebase Authentication integration
- Firebase Cloud Functions support (with local emulator)
- Google Maps integration
- **Vercel Speed Insights** for performance monitoring

## Getting Started

### Prerequisites

- Node.js 22.x
- npm 10.x
- Firebase CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure your Firebase and Google Maps credentials in `.env`

### Development

Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Testing

Run tests:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

### Building

Create a production build:
```bash
npm run build
```

## Vercel Speed Insights

This project includes [Vercel Speed Insights](https://vercel.com/docs/speed-insights) for monitoring web performance metrics.

### Configuration

Speed Insights is configured in `src/index.js`:

```javascript
import { SpeedInsights } from '@vercel/speed-insights/react';

root.render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
  </React.StrictMode>
);
```

### What It Monitors

Speed Insights automatically tracks:
- Real User Monitoring (RUM) data
- Core Web Vitals (LCP, FID, CLS)
- First Contentful Paint (FCP)
- Time to First Byte (TTFB)

### Viewing Analytics

After deploying to Vercel:
1. Navigate to your project in the Vercel Dashboard
2. Click on the "Speed Insights" tab
3. View performance metrics and trends

### Local Development

Speed Insights works in development mode but won't send data unless deployed to Vercel. The component is lightweight and won't affect your development experience.

## Firebase Emulators

### Running Functions Emulator

```bash
npm run firebase:emulators
```

This runs only the Cloud Functions emulator at `http://localhost:5001`

### Running All Emulators

```bash
npm run firebase:emulators:all
```

## Deployment

### Deploy Functions

```bash
npm run deploy:functions
```

### Deploy Firestore Rules

```bash
npm run deploy:firestore
```

### Deploy to Vercel

For optimal Speed Insights integration, deploy using Vercel:

```bash
vercel deploy
```

## Project Structure

```
Web App/
├── public/          # Static files
├── src/
│   ├── App.js       # Main application component
│   ├── index.js     # Entry point with Speed Insights
│   ├── App.css      # Application styles
│   └── index.css    # Global styles
├── package.json     # Dependencies and scripts
└── .env.example     # Environment variables template
```

## Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://create-react-app.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
