# Admin Security Implementation

This document outlines the secure authentication system implemented for the admin dashboard.

## Security Features

### 🔐 Authentication

- **JWT Tokens**: Secure JSON Web Tokens with HTTP-only cookies
- **Bcrypt Hashing**: Password hashed with cost factor 12 (very secure)
- **Token Expiration**: 7-day token expiration with automatic refresh
- **Brute Force Protection**: 1-second delay on failed login attempts

### 🛡️ Authorization

- **Middleware Protection**: All admin routes protected by Next.js middleware
- **Token Validation**: JWT signature and payload validation
- **Role-Based Access**: Admin-only access control
- **Automatic Redirects**: Unauthorized users redirected to sign-in

### 🍪 Cookie Security

- **HTTP-Only**: Cookies inaccessible to JavaScript (XSS protection)
- **Secure Flag**: HTTPS-only in production
- **SameSite**: Strict same-site policy (CSRF protection)
- **Path Scoped**: Cookies scoped to admin routes

### 🔒 Additional Security

- **Environment Variables**: Sensitive data in environment variables
- **Token Cleanup**: Invalid tokens automatically cleared
- **HTTPS Enforcement**: Secure cookies in production only
- **Input Validation**: Password requirements and validation

## Setup Instructions

### 1. Generate Admin Password

```bash
node scripts/generate-admin-hash.js
```

### 2. Configure Environment Variables

Create `.env.local` with:

```bash
ADMIN_PASSWORD_HASH=your-bcrypt-hash-here
JWT_SECRET=your-secure-jwt-secret-minimum-32-characters
```

### 3. Access Admin Dashboard

1. Navigate to `/admin/signin`
2. Enter your admin password
3. Access protected admin routes

## Protected Routes

All routes under `/admin/*` are protected except:

- `/admin/signin` - Sign-in page
- `/admin/api/auth` - Authentication API

## API Endpoints

### Authentication

- `POST /admin/api/auth` - Sign in
- `DELETE /admin/api/auth` - Sign out
- `GET /admin/api/auth` - Check auth status

## Security Best Practices

### Password Requirements

- Minimum 8 characters (enforced in script)
- Use strong, unique password
- Store hash securely in environment variables

### JWT Secret

- Minimum 32 characters
- Use cryptographically secure random string
- Never expose in client-side code

### Environment Variables

- Never commit `.env.local` to version control
- Use different secrets for development/production
- Rotate secrets periodically

## Deployment Considerations

### Production Environment

- Ensure `NODE_ENV=production`
- Use HTTPS for secure cookies
- Set strong environment variables
- Monitor failed authentication attempts

### Security Headers

Consider adding these security headers:

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
```

## Troubleshooting

### Common Issues

1. **"Server configuration error"**: Check environment variables
2. **Redirect loops**: Clear cookies and regenerate tokens
3. **Token expired**: Tokens expire after 7 days, sign in again

### Debug Mode

Check browser console and server logs for authentication errors.

## Security Audit Checklist

- [ ] Strong admin password set
- [ ] JWT secret is cryptographically secure (32+ chars)
- [ ] Environment variables not in version control
- [ ] HTTPS enabled in production
- [ ] Cookie security flags properly set
- [ ] Middleware protecting all admin routes
- [ ] Token expiration working correctly
- [ ] Invalid tokens properly cleared
- [ ] Brute force delay implemented
- [ ] Input validation working

## Maintenance

### Regular Tasks

- Rotate JWT secret every 90 days
- Monitor authentication logs
- Update dependencies regularly
- Review and test security measures

For questions or security concerns, contact the administrator.
