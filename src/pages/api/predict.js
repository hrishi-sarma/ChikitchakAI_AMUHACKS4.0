// pages/api/predict.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST requests are allowed.' });
    }
    try {
      // Forward the incoming request body to the Flask service.
      const response = await fetch('http://localhost:5000', {
        method: 'POST',
        // Pass along the request body (which is FormData containing the file)
        body: req.body,
      });
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error("Error forwarding request:", error);
      res.status(500).json({ error: 'Prediction failed.' });
    }
  }
  