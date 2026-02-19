// Quick API Connection Test
// Open your browser console (F12) and paste this code to test the backend connection

fetch('http://localhost:8000/health')
    .then(response => response.json())
    .then(data => {
        console.log('✅ Backend is accessible!', data);
    })
    .catch(error => {
        console.error('❌ Backend connection failed:', error);
    });

// Test the register endpoint
fetch('http://localhost:8000/api/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpass123',
        full_name: 'Test User'
    })
})
    .then(response => response.json())
    .then(data => {
        console.log('✅ Register endpoint response:', data);
    })
    .catch(error => {
        console.error('❌ Register endpoint failed:', error);
    });
