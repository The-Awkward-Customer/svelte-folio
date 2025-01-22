const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // declares the port

// Enable CORS
app.use(cors());

// Define a basic endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello World from Express" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
