# HomeSuite

A modern real estate browsing application with gesture controls and location-based search. HomeSuite allows users to discover properties through an intuitive swipe interface and interact with AI-powered chat features.

## Features

- 🏠 Property browsing with swipe gestures
- 📍 Location-based property search
- 🤖 AI-powered property chat
- 📱 Responsive design
- 🎥 Gesture control support
- 🗺️ Interactive map visualization

## Tech Stack

- React + TypeScript
- Supabase for backend and authentication
- Mapbox for geocoding and maps
- OpenAI for chat features
- TailwindCSS + shadcn/ui for styling
- FastAPI for gesture processing

## Prerequisites

- Node.js 16 or higher
- Supabase account and project
- Mapbox API key
- OpenAI API key
- Melissa API key for address validation

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd homesuite
```

2. Install dependencies
```bash
npm install
```

3. Configure Supabase
- Create a new Supabase project
- Set up the following secrets in your Supabase dashboard:
  - `OPENAI_API_KEY`
  - `MELISSA_API_KEY`
  - `MAPBOX_API_KEY`

4. Start the development server
```bash
npm run dev
```

## Environment Setup

The application uses Supabase for secret management. Required secrets:

- `OPENAI_API_KEY` - For AI chat features
- `MELISSA_API_KEY` - For address validation
- `MAPBOX_API_KEY` - For geocoding and maps

## Security Features

1. **Authentication**: 
   - Email verification enabled
   - JWT token-based session management
   - Secure password requirements

2. **Database Security**:
   - Row Level Security (RLS) policies
   - Input validation
   - Prepared statements

3. **API Security**:
   - Rate limiting
   - CORS configuration
   - Input sanitization

## Performance Features

1. **Frontend**:
   - Code splitting
   - Image optimization
   - Lazy loading
   - Caching strategies

2. **Backend**:
   - Query optimization
   - Connection pooling
   - Edge function caching

## Monitoring

The application implements:
- Console logging for development
- Error tracking
- Performance monitoring
- User analytics

## Production Deployment

1. Configure all required secrets in Supabase
2. Enable required authentication providers
3. Verify RLS policies
4. Test all error scenarios
5. Monitor initial deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.