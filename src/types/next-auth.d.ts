import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "STUDENT" | "ADMIN";
      profileCompletion: number;
    };
  }

  interface User {
    role: "STUDENT" | "ADMIN";
    profileCompletion?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "STUDENT" | "ADMIN";
    profileCompletion?: number;
  }
}
