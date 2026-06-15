import axios from 'axios';
import jwt from 'jsonwebtoken';

async function run() {
  try {
    const token = jwt.sign(
      { sub: 'ea5c3c36-62e7-4320-9ba8-93544af6cc37', role: 'MANAGER' },
      'change-me-to-a-random-64-char-string-for-production',
      { expiresIn: '1h' }
    );
    
    console.log("Token generated:", token);

    const chatRes = await axios.post('http://localhost:3000/api/v1/chat/conversations', {
      type: 'SUPPORT'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("SUCCESS:", chatRes.data);
  } catch (err) {
    console.error("ERROR:");
    console.error(err.response?.status);
    console.error(JSON.stringify(err.response?.data, null, 2));
  }
}

run();
