import NextAuth from "next-auth";
import { FinanceaAuthOptions } from "./options";


const handler = NextAuth(FinanceaAuthOptions);

export { handler as GET, handler as POST };