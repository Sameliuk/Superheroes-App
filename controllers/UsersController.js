import db from '../models/index.js';
import bcrypt from 'bcrypt';

const Users = db.Users;

class UserController {
  async signUpHandler(req, res) {
    try {
      const { fname, sname, email, password } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await Users.create({
        fname,
        sname,
        email,
        password: hashedPassword,
      });

      req.session.userId = newUser.id;

      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          return res
            .status(500)
            .json({ error: 'Error saving session after registration.' });
        }

        res.status(200).json({
          user: {
            id: newUser.id,
            fname: newUser.fname,
            sname: newUser.sname,
            email: newUser.email,
          },
        });
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ error: 'Error while registering. Please try again.' });
      }
    }
  }

  async signInHandler(req, res) {
    try {
      const { email, password: plainPassword } = req.body;

      const user = await Users.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Incorrect email or password' });
      }

      const isPasswordValid = await bcrypt.compare(
        plainPassword,
        user.password,
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Incorrect email or password' });
      }

      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          return res
            .status(500)
            .json({ error: 'Error saving session after login.' });
        }

        res.status(200).json({
          user: {
            id: user.id,
            fname: user.fname,
            sname: user.sname,
            email: user.email,
          },
        });
      });
    } catch (error) {
      console.error('CRITICAL ERROR in signInHandler:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Server error during login' });
      }
    }
  }

  async logOutHandler(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Server error during logout', err);
        return res.status(500).json({ error: 'Server error' });
      }

      res.clearCookie('connect.sid');
      res.setHeader('Cache-Control', 'no-store');

      res.status(200).json({ message: 'User successfully logged out' });
    });
  }
}

export default new UserController();
