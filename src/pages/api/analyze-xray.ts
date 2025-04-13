// pages/api/analyze-xray.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Disable built-in bodyParser so we can use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received request to analyze X-ray');
    
    // Parse the form data
    const form = new formidable.IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });
    
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form data:', err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    // Get the file
    const file = files.file as formidable.File;
    if (!file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`File received: ${file.originalFilename}, size: ${file.size} bytes, type: ${file.mimetype}`);
    
    // Check if file exists and has size
    if (!fs.existsSync(file.filepath) || fs.statSync(file.filepath).size === 0) {
      console.error('File is empty or does not exist');
      return res.status(400).json({ error: 'File is empty or invalid' });
    }

    // Create FormData for Python API
    const formData = new FormData();
    const fileStream = fs.createReadStream(file.filepath);
    formData.append('file', fileStream, {
      filename: file.originalFilename || 'image.jpg',
      contentType: file.mimetype || 'image/jpeg',
    });

    // Send to Python backend
    const apiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000/api/predict';
    console.log('Sending request to Python API:', apiUrl);
    
    try {
      // Test API connection first with a simple GET request
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const healthCheck = await fetch('http://localhost:8000/', { 
          method: 'GET',
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));
        console.log('Health check status:', healthCheck.status);
        if (!healthCheck.ok) {
          throw new Error(`API server health check failed with status ${healthCheck.status}`);
        }
      } catch (healthError) {
        console.error('API server health check failed:', healthError);
        return res.status(502).json({ 
          error: 'Analysis service is not responding. Please ensure the Python backend is running.' 
        });
      }
      
      // Now send the actual prediction request
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
     
      });
      
      console.log('Received response from Python API, status:', response.status);

      // Read the response as text first
      const responseText = await response.text();
      console.log('Response text length:', responseText.length);
      
      // If no response or empty, return error
      if (!responseText || responseText.trim() === '') {
        console.error('Empty response from Python API');
        return res.status(502).json({ error: 'Analysis service returned empty response' });
      }
      
      // Try to parse the response as JSON
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Successfully parsed JSON response');
      } catch (jsonError) {
        console.error('Invalid JSON from Python API:', responseText.substring(0, 200));
        return res.status(502).json({ error: 'Invalid response format from analysis service' });
      }

      // If response has error property or status is not ok
      if (!response.ok || result.error) {
        console.error(`Python API error (${response.status}):`, result.error || responseText.substring(0, 200));
        return res.status(response.status || 500).json({ 
          error: result.error || `Error from model API: ${responseText.substring(0, 200)}` 
        });
      }

      // Return the parsed result
      console.log('Successfully processed image analysis');
      return res.status(200).json(result);
    } catch (fetchError) {
      console.error('Error connecting to Python API:', fetchError);
      return res.status(502).json({ 
        error: 'Failed to connect to analysis service. Please ensure the Python backend is running.' 
      });
    } finally {
      // Clean up the temporary file
      try {
        if (file && file.filepath) {
          fs.unlinkSync(file.filepath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : 'Internal server error processing your request' 
    });
  }
}