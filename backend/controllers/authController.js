const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // 1. Validations
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: "Name must be between 20 to 60 chars." });
        }
        if (address && address.length > 400) {
            return res.status(400).json({ error: "Address cannot exceed 400 chars." });
        }

        // Password must be 8-16 chars, 1 uppercase, 1 special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must be 8-16 chars, include one uppercase letter and one special char." });
        }

        // Email validation format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid mail format." });
        }

        // 2. Check if user already exists
        const [userExists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (userExists && userExists.length > 0) {
            return res.status(400).json({ error: "This email is already registered." });
        }

        // 3. Hash the Password securely
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);
        const userRole = role || 'NORMAL_USER';

        // 4. Insert New User into MySQL
        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, password_hash, address || null, userRole]
        );

        res.status(201).json({
            message: "Account created successfully!",
            user: {
                id: result.insertId,
                name,
                email,
                role: userRole
            }
        });

    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
            return res.status(400).json({ error: "This email is already registered." });
        }
        res.status(500).json({ error: "Registration failed." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!users || users.length === 0) {
            return res.status(401).json({ error: "Invalid mail id or password, try again." });
        }

        const user = users[0];

        // 2. Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid mail id or password, try again." });
        }

        // 3. Generate a JWT Token
        const jwtSecret = process.env.JWT_SECRET || 'roxiler_jwt_secret_key_default';
        const token = jwt.sign(
            { id: user.id, role: user.role },
            jwtSecret,
            { expiresIn: '1d' }
        );

        // 4. Send the token and user details to the frontend
        res.status(200).json({
            message: "Login successful !",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed. Server error occurred !" });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                error: "Password must be 8-16 characters long, include at least one uppercase letter and one special character."
            });
        }

        const [users] = await db.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
        if (!users || users.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        const user = users[0];

        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect old password." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);

        res.status(200).json({ message: "Password updated successfully !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Password updation failed . Server error occurred !" });
    }
};
