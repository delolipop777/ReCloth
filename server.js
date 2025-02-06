require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');

const port = process.env.PORT || 5000; // Use the environment variable or default to 5000

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors());         // Enable cross-origin resource sharing
app.use(express.static(__dirname)); // Serve static files from the current directory

// Connect to MongoDB Atlas
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/users';
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if unable to connect
  });


const db = mongoose.connection;
db.once('open', () => {
    console.log('MongoDB connected!');
});

// User Schema for MongoDB
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    originalPassword: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const clothingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the user who posted
});

const Clothing = mongoose.model('Clothing', clothingSchema);

// Serve index.html on the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve signup.html
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Add Clothing Route
app.post('/add-clothing', async (req, res) => {
    const { name, description, price, image } = req.body;

    if (!name || !description || !price || !image) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newClothing = new Clothing({
            name,
            description,
            price,
            image
        });

        await newClothing.save();

        res.status(201).json({ message: "Clothing added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});


// Get all clothes (GET request to fetch clothes for sale)
app.get('/clothes', async (req, res) => {
    try {
        const clothesList = await Clothing.find();
        res.status(200).json(clothesList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Delete clothing (DELETE request to remove clothing item by ID)
// Delete Clothing Route
app.delete('/delete-clothing/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedClothing = await Clothing.findByIdAndDelete(id);

        if (!deletedClothing) {
            return res.status(404).json({ message: "Clothing not found." });
        }

        res.status(200).json({ message: "Clothing deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});


// Register route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields." });
    }

    try {
        const existingUserName = await User.findOne({username});

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUserName||existingUser) {
            return res.status(400).json({ message: "Email or UserName already exists!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user and save to database
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            originalPassword: password
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input fields
    if (!username || !password) {
        return res.status(400).json({ message: "Please fill in all fields." });
    }

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        // If login is successful
        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Change Password Route
app.post('/change-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "Please fill in all fields." });
    }

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Delete Account Route
app.post('/delete-account', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Username is required." });
    }

    try {
        // Delete the user by username
        const result = await User.deleteOne({ username });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Account deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});


// Start the server
app.listen(port,'0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
});
