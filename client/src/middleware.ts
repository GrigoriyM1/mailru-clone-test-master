import { NextRequest, NextResponse } from 'next/server';
import { EnumTokens } from './services';

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request;

	const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value;

	const isAuthPage = url.includes('/register');

  if (url.includes('_next')) { 
		return NextResponse.next();
  }

	if (isAuthPage && refreshToken) {
		return NextResponse.redirect(new URL('/', url));
	}

	if (isAuthPage) {
		return NextResponse.next();
	}

	if (!refreshToken) {
		return NextResponse.redirect(new URL('/register', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/:path*', '/register/:path'],
};
