export const createAuthMiddleware = (tokenService) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = tokenService.verify(token);
      req.user = {
        id: Number(payload.sub),
        username: payload.username,
        name: payload.name,
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};


