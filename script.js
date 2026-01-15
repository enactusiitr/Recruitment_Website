// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifier = document.getElementById('loginIdentifier').value;
        const password = document.getElementById('loginPassword').value;
        
        console.log('Login attempt:', { identifier, password });
        // Redirect to recruitments page after successful login
        alert('Login successful!');
        window.location.href = 'recruitments.html';
    });
}

// Signup Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        const formData = {
            name: document.getElementById('name').value,
            username: document.getElementById('username').value,
            gsuite: document.getElementById('gsuite').value,
            password: password,
            collegeClub: document.getElementById('collegeClub').value,
            clubId: document.getElementById('clubId').value
        };
        
        console.log('Signup data:', formData);
        alert('Signup successful! Please login to continue.');
        window.location.href = 'index.html';
    });
}

// Forgot Password Form Handler
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const gmail = document.getElementById('resetGmail').value;
        
        console.log('OTP request for:', gmail);
        alert('OTP sent to ' + gmail);
        window.location.href = 'reset-password.html';
    });
}

// Reset Password Form Handler
const resetPasswordForm = document.getElementById('resetPasswordForm');
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const otp = document.getElementById('otp').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        if (newPassword !== confirmNewPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        console.log('Password reset with OTP:', otp);
        alert('Password reset successful!');
        window.location.href = 'index.html';
    });
}
