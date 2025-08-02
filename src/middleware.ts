import { NextResponse, type NextRequest } from 'next/server'
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
 
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  
  const { user } = session;

  if (!user?.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}
 
export const config = {
  matcher: ['/admin/:path*'],
}
