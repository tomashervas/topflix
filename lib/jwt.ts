import jwt, { JwtPayload } from 'jsonwebtoken';

export const generateToken = (email: string, admin: boolean) => {
  const payload = {
    user: email,
    admin
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '4h' });

  return token;
};

export const verifyToken = (token: string) => {
  if (!token) {
    return new Response('No token provided', { status: 401 });
  }
  return jwt.verify(token, process.env.JWT_SECRET!);
}