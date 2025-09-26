import db from '../models/index.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

const { Users } = db;

class UserService {
  async authenticateUser({ email, password }) {
    const user = await Users.findOne({ where: { email } });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const payload = {
      id: user.id,
      fname: user.fname,
      sname: user.sname,
      email: user.email,
    };
    const token = generateToken(payload);

    return { user: payload, token };
  }
}

export default new UserService();
