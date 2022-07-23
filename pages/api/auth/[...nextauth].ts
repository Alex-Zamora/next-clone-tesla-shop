import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here

    Credentials({
      name: 'Custom Login',
      credentials: {
        email:  { label: 'Correo', type: 'email', placeholder: 'correo electronico' },
        password:  { label: 'Contraseña', type: 'password', placeholder: 'contraseña' },
      },
      async authorize(credentials) {
        // console.log(credentials);
        // return { name: 'Alex', correo: 'jaja@gmail.com', role: 'admin' }
        
        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );
        
      }
    })
  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    strategy: 'jwt',
    maxAge: 2592000, // 30 días
    updateAge: 86400, // se actualice cada día
  },

  // Callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      
      if ( account ) {
        token.accessToken = account.access_token;

        switch ( account.type ) {
          case 'credentials':
            token.user = user
          break;

          case 'oauth':  
            //TODO: crear usuario o verificar si existe en mi DB
            token.user = await dbUsers.oAuthDBUser( user?.email || '', user?.name || '' );
          break;
        }
      }
      
      return token;
    },

    async session({ session, token, user }) {
      
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      
      return session;
    }
  }
})