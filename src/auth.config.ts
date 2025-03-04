import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    //signIn: '/login',
    signIn: '/cloud-mining/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith(
        '/cloud-mining/dashboard',
      );
      //const loginPage = nextUrl.pathname.startsWith('/login');
      const loginPage = nextUrl.pathname.startsWith('/cloud-mining/signin');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        if (loginPage)
          return Response.redirect(new URL('/cloud-mining/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
