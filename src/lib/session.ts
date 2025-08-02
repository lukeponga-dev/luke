import type { IronSessionOptions } from 'iron-session';
import type { SessionData } from './types';

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'portfolio-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

declare module 'iron-session' {
  interface IronSessionData {
    user?: SessionData;
  }
}
