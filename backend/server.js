// backend/server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

// CONFIG
const PORT = 3001; // Đổi port để tránh conflict với frontend
const N8N_WEBHOOK = 'https://n8n.nhathung.fun/webhook-test/task-assignment';

// ENDPOINT: Proxy trigger to n8n
app.get('/api/trigger-ai', async (req, res) => {
  try {
    console.log('--- TRIGGERING AI AGENT ---');
    console.log(`Target: ${N8N_WEBHOOK}`);

    const response = await axios.get(N8N_WEBHOOK, {
      timeout: 120000
    });

    console.log('n8n Response Status:', response.status);
    console.log('n8n Response Data:', response.data);

    return res.json({
      success: true,
      message: 'AI Agent triggered successfully',
      data: response.data
    });

  } catch (err) {
    console.error('!!! ERROR calling n8n !!!', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger AI Agent',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Targeting n8n: ${N8N_WEBHOOK}`);
});