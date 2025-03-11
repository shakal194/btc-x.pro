import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    //signIn: '/login',
    signIn: '/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      //const loginPage = nextUrl.pathname.startsWith('/login');
      const loginPage = nextUrl.pathname.startsWith('/signin');
      if (isOnDashboard) {
        console.log('callback isOnDashboard', nextUrl);
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        if (loginPage) return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
