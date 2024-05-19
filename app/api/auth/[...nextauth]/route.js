import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";

import User from '@models/User';
import { connectToDB } from '@utils/database';

import bcrypt from "bcryptjs";
// const handler = NextAuth({
const  authOption =({
  providers: [
    
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    
  ],

  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
  }
})

const handler= NextAuth(authOption);
export { handler as GET, handler as POST }

// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';
// import GithubProvider from 'next-auth/providers/github';
// import FacebookProvider from 'next-auth/providers/facebook';

// import User from '@models/User'; // Import your User model
// import { connectToDB } from '@utils/database'; // Import database connection function

// import bcrypt from 'bcryptjs';

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email', placeholder: 'youremail@example.com' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         await connectToDB(); // Connect to database

//         try {
//           const user = await User.findOne({ email: credentials.email });

//           if (user) {
//             // Validate password using bcrypt
//             const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
//             if (isPasswordValid) {
//               return user; // User found and password matched
//             }
//           }

//           // User not found or invalid password
//           throw new Error('Invalid email or password');
//         } catch (error) {
//           console.error('Error authorizing user:', error);
//           throw new Error('Invalid email or password'); // Handle errors gracefully
//         }
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider && account.provider !== 'credentials') {
//         // Handle social login providers (GitHub, Google, Facebook)
//         await connectToDB();

//         try {
//           const existingUser = await User.findOne({ email: user.email });
//           if (!existingUser) {
//             // Create a new user for social login if not already registered
//             const newUser = new User({
//               email: user.email,
//               username: user.name.replace(' ', '').toLowerCase(),
//               // Add other user profile fields as needed
//             });
//             await newUser.save();
//           }
//           return true; // Allow sign-in
//         } catch (error) {
//           console.error('Error saving user after social login:', error);
//           return false; // Handle errors gracefully
//         }
//       }

//       // Successful sign-in for credentials provider (handled within authorize)
//       return true;
//     },
//   },
//   // Add other NextAuth.js options (session, JWT, etc.) as needed
// });
