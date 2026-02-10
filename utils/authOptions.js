import GoogleProvider from "next-auth/providers/google";
import User from "../models/User";
import connectDB from "../config/database";

export const authOptions = {
    session: { strategy: "jwt" },

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    pages: {
        error: "/auth/error",
    },

    callbacks: {
        async signIn({ profile }) {
            await connectDB();
        
            const dbUser = await User.findOne({ email: profile.email });
        
            // ONLY allow users who already exist in DB
            if (!dbUser) {
                return false; // Deny login for anyone not pre-approved
            }
        
            // Allow only admins & superadmins
            if (!["admin", "superadmin"].includes(dbUser.role)) {
                return false; // Deny login for normal users
            }

            // NEW User creation instead
            //     if (!user) {
            //       await User.create({
            //         first_name: profile.given_name,
            //         last_name: profile.family_name,
            //         email: profile.email,
            //         role: "user",
            //       });
            //     }
        
            return true;
        },
      
        // fetch user from DB here
        async jwt({ token }) {
            await connectDB();

            const user = await User.findOne({ email: token.email });
            console.log("JWT user:", user);

            if (user) {
                token.id = user._id.toString();
                token.role = user.role;
                token.phone = user.phone;
            }

            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.phone = token.phone;
            return session;
        },
    },
};
