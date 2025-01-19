import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request) {
    const { isAuthenticated } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    
    if (isUserAuthenticated) {
        return NextResponse.next();
    }
    
    // Redirect to Account page if user is not authenticated
    return NextResponse.redirect(new URL('/Account', request.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - Account route (to avoid redirect loop)
         * - api routes (/api/*)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!Account|api|_next/static|_next/image|favicon.ico).*)',
    ],
};