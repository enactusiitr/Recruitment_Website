# Recruitment Admin Portal

A minimalistic admin authentication system for recruitment websites.

## Features

- **Admin Login** - Username/Gmail and password authentication
- **Admin Signup** - Complete registration with club details
- **Forgot Password** - Gmail-based password recovery
- **Reset Password** - OTP verification and password reset

## Installation

No installation required! This is a pure HTML/CSS/JavaScript project.

### Option 1: Direct Browser Access
Simply open `index.html` in your web browser.

### Option 2: Using Live Server (Recommended)
```bash
npm install
npm start
```

This will start a local development server at http://localhost:3000

## Project Structure

```
├── index.html              # Admin login page
├── signup.html             # Admin signup page
├── forgot-password.html    # Password recovery page
├── reset-password.html     # OTP verification & reset page
├── styles.css              # All styling
├── script.js               # Form validation & handlers
└── package.json            # Project configuration
```

## Pages

### Login Page (index.html)
- Username/Gmail input
- Password input
- Forgot password link
- Sign up link

### Signup Page (signup.html)
All fields are mandatory:
- Name
- Username
- Gsuite (Gmail)
- Create Password
- Confirm Password
- College Club (dropdown)
- Club ID

### Forgot Password (forgot-password.html)
- Gmail input
- Sends OTP (to be connected to backend)

### Reset Password (reset-password.html)
- OTP verification
- New password
- Confirm new password

## Backend Integration

Currently, the forms use JavaScript alerts. To integrate with your backend:

1. Replace the form handlers in `script.js` with API calls
2. Add your backend endpoint URLs
3. Implement actual OTP sending via email service
4. Add database connectivity for user management

## Technologies Used

- HTML5
- CSS3 (with gradients and animations)
- Vanilla JavaScript
- No external dependencies for frontend

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
