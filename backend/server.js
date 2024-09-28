const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const userPostRoutes = require('./routes/userPostRoutes');

const app = express();
const PORT = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
}));


// Database connection
const connectDB = async () => {
  try {
     await mongoose.connect('mongodb://localhost:27017/VolontirajDataBase');
     console.log('Mongodb connected');
  }
  catch (err) {
     console.error(err.message);
     process.exit(1); //Exits the running script on error
  }
}
connectDB();

// Route to verify server is running
app.get('/', (req, res) => {
  res.send('Server is up and running');
});

// Use API routes
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', userPostRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
