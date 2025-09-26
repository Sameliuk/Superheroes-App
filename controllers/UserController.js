import UserService from '../services/UserService.js';

class UserController {
  async signUp(req, res) {
    try {
      const newUserWithToken = await UserService.registerUser(req.body);
      res.status(201).json(newUserWithToken);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async signIn(req, res) {
    try {
      const authResult = await UserService.authenticateUser(req.body);
      if (!authResult) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.json(authResult);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async logOut(req, res) {
    res.json({ message: 'Logout successful. Remove token on client side.' });
  }
}

export default new UserController();
