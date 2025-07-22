import { redirect } from 'next/navigation';
import { SignInPage } from "@/app/(myapp)/components/shadcn/sign-in-flow-1";
import { SessionProvider } from "next-auth/react";
import {auth} from "@/lib/auth";

export default async function App() {

    const session = await auth();

      if (session) {
    redirect('/home');
  }

  return (
    <div>
        <SessionProvider>
        <SignInPage />
        </SessionProvider>
    </div>
  );
}
