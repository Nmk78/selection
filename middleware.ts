
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    // try {
    //   // This will throw if the user is not authenticated
    //   // auth().protect();
    // } catch (error) {
    //   // Redirect to the login page or handle it according to your needs
    //   console.error('Authentication failed:', error);
    //   return NextResponse.redirect(new URL("/", request.url)); // Adjust to your login page
    // }
  }

  // Continue processing the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};