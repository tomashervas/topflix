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

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || typeof decoded.exp === 'undefined') {
      return true;
    }

    const expirationTime = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime > expirationTime;
  } catch (error) {
    return true;
  }
};