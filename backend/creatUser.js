const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path if necessary
require('dotenv').config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingUser = await User.findOne({ email: 'testuser@example.com' });
    if (!existingUser) {
      const user = new User({
        email: 'testuser@example.com',
        password: 'password123', // Use a plaintext password; it will be hashed by the model
      });
      await user.save();
      console.log('User created successfully');
    } else {
      console.log('User already exists');
    }
    mongoose.disconnect();
  } catch (err) {
    console.error('Error creating user:', err);
  }
};

createUser();
