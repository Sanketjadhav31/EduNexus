// Quick test script to verify setup
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testSetup() {
  console.log('🧪 Testing EduNexus Setup...\n');

  try {
    // Test 1: Backend Health Check
    console.log('1️⃣ Testing Backend Connection...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is running:', health.data.message);
    console.log('');

    // Test 2: Test Registration
    console.log('2️⃣ Testing User Registration...');
    const testUser = {
      name: 'Test Student',
      email: `test${Date.now()}@test.com`,
      password: 'test123',
      role: 'student'
    };
    
    const registerRes = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('✅ Registration successful');
    console.log('   User:', registerRes.data.user.name);
    console.log('   Role:', registerRes.data.user.role);
    console.log('');

    // Test 3: Test Login
    console.log('3️⃣ Testing Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');
    console.log('   Token received:', loginRes.data.token.substring(0, 20) + '...');
    console.log('');

    // Test 4: Test Protected Route
    console.log('4️⃣ Testing Protected Route...');
    const token = loginRes.data.token;
    const meRes = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Protected route working');
    console.log('   Authenticated as:', meRes.data.user.name);
    console.log('');

    console.log('🎉 All tests passed! Your setup is working correctly!\n');
    console.log('📝 Next steps:');
    console.log('   1. Open http://localhost:5173 in your browser');
    console.log('   2. Register as instructor and create courses');
    console.log('   3. Register as student and enroll in courses');
    console.log('   4. Test all features!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure backend is running on port 5000');
    console.log('   - Check MongoDB connection');
    console.log('   - Verify .env file configuration');
  }
}

testSetup();
