import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
    const token = request.cookies.get('token');

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url)); 
        }

        // Verify the token and check the role
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url)); 
            }
        } catch (err) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
