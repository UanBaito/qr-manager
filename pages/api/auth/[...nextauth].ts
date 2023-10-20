import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "../../../lib/db";
import PostgresAdapter from "@auth/pg-adapter";
import bcrypt from "bcrypt";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      id: "credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const client = await db.connect();
        try {
          const userResult = await client.query(
            "SELECT * FROM users WHERE username = $1",
            [credentials.username]
          );

          const user: user = userResult.rows[0];

          if (!user) {
            return null;
          }

          const match = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!match) {
            return null;
          }

          return { id: user.id, name: user.username };
        } catch (err) {
          console.log(err);
          return null;
        } finally {
          client.release();
        }
      },
    }),
  ],
  adapter: PostgresAdapter(db),
});
