import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

function createAccessToken(payload) {
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  return jwt.sign(payload, secret, { expiresIn });
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // adapt depending on your model's method name
    const valid = user.verifyPassword
      ? await user.verifyPassword(password)
      : await bcrypt.compare(
        password,
        user.password || user.passwordHash || ''
      );
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // build minimal token payload (optional: include role here)
    const payload = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const token = createAccessToken(payload);

    // Respond with token + safe user object (omit sensitive fields)
    const safeUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name || '',
      role: user.role || 'user',
    };

    return res.json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
}
