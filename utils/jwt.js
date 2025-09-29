import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      fname: user.fname,
      sname: user.sname,
      email: user.email,
    },
    SECRET,
    { expiresIn: '1h' },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
