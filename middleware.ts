import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('[MIDDLEWARE] Path:', pathname)
  console.log('[MIDDLEWARE] ENV exists:', !!process.env.ADMIN_PASSWORD_HASH)

  if (pathname === '/admin/login' || pathname.startsWith('/api/auth/')) {
    console.log('[MIDDLEWARE] Skipping login/api')
    return NextResponse.next()
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const token = request.cookies.get('admin_token')?.value
    console.log('[MIDDLEWARE] Token found:', !!token)
    
    if (!token) {
      console.log('[MIDDLEWARE] No token -> Redirect to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const secret = process.env.ADMIN_PASSWORD_HASH
      if (!secret) {
        console.log('[MIDDLEWARE] ERROR: ADMIN_PASSWORD_HASH missing')
        throw new Error('ENV missing')
      }
      await jwtVerify(token, new TextEncoder().encode(secret))
      console.log('[MIDDLEWARE] Token valid -> Allow')
      return NextResponse.next()
    } catch (error) {
      console.log('[MIDDLEWARE] Token invalid:', (error as Error).message)
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
