import jwt from 'jsonwebtoken';

export class TokenService {
  constructor({ secret, expiresIn }) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(user) {
    return jwt.sign(
      {
        username: user.username,
        name: user.name,
      },
      this.secret,
      {
        subject: String(user.id),
        expiresIn: this.expiresIn,
      }
    );
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }
}


