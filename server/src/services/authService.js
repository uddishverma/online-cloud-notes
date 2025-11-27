import bcrypt from 'bcryptjs';

export class AuthService {
  constructor(userService, tokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
  }

  async login(username, password) {
    const user = this.userService.findByUsername(username);
    if (!user) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      throw error;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      throw error;
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
    };

    const token = this.tokenService.sign(safeUser);

    return {
      user: safeUser,
      token,
    };
  }

  getProfile(userId) {
    return this.userService.findById(userId);
  }
}


