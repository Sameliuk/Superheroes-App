import db from '../models/index.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

const { Users } = db;

class UserService {
  async registerUser({ fname, sname, email, password }) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await Users.create({
      fname,
      sname,
      email,
      password: hashedPassword,
    });

    const payload = {
      id: newUser.id,
      fname: newUser.fname,
      sname: newUser.sname,
      email: newUser.email,
    };

    const token = generateToken(payload);

    return { user: payload, token };
  }

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
