import NextAuth from 'next-auth';
// import GithubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';

export const authOptions = {
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    jwt: ({ token, accept, profile }) => {
      console.log('accept', accept);
      console.log('profile', profile);
      console.log('token', token);
      return token;
    },
  },
};

export default NextAuth(authOptions);
