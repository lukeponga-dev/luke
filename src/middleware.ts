import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('auth')
 
  if (!cookie && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
 
  if (cookie && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/admin/:path*', '/login'],
}
