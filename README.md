# HomeSuite

A modern real estate browsing application with gesture controls and location-based search.

## Production Setup Guide

### Prerequisites

- Node.js 16 or higher
- Supabase account and project
- Mapbox API key
- Melissa API key for address validation

### Environment Setup

The application uses Supabase for secret management. Required secrets:

- OPENAI_API_KEY - For AI chat features
- MELISSA_API_KEY - For address validation
- MAPBOX_API_KEY - For geocoding and maps

These should be configured in your Supabase project's secret management.

### Security Considerations

1. **Authentication**: 
   - Email verification enabled by default
   - JWT token-based session management
   - Secure password requirements

2. **Database Security**:
   - Row Level Security (RLS) policies enforced
   - Input validation on all user inputs
   - Prepared statements for database queries

3. **API Security**:
   - Rate limiting on API endpoints
   - CORS configuration
   - Input sanitization

### Error Handling

The application implements:
- Global error boundaries
- Graceful degradation
- Comprehensive error logging
- User-friendly error messages

### Performance Optimization

1. **Frontend**:
   - Code splitting
   - Image optimization
   - Lazy loading
   - Caching strategies

2. **Backend**:
   - Query optimization
   - Connection pooling
   - Edge function caching

### Monitoring

- Console logging for development
- Error tracking
- Performance monitoring
- User analytics

### Deployment Checklist

1. Configure all required secrets in Supabase
2. Enable required authentication providers
3. Verify RLS policies
4. Test all error scenarios
5. Monitor initial deployment

### Development Workflow

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Supabase project
4. Start development server: `npm run dev`

For more details on specific features or configurations, refer to the documentation in the `docs` folder.