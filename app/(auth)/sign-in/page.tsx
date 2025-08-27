import Link from "next/link";

import * as settings from "@/lib/server/settings";

import { Title } from "../common";
import GoogleSignIn from "../google-sign-in";

import SignIn from "./sign-in";

interface Params {
  redirectTo?: string;
  reset?: string;
}

export default async function SignInPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { reset, redirectTo } = await searchParams;

  // Create sign-up URL with safer URL construction
  let signUpUrl: URL;
  try {
    signUpUrl = new URL("/sign-up", settings.BASE_URL || "http://localhost:3000");
  } catch {
    // Fallback if BASE_URL is invalid
    signUpUrl = new URL("/sign-up", "http://localhost:3000");
  }

  if (redirectTo) {
    signUpUrl.searchParams.set("redirectTo", redirectTo);
  }

  return (
    <>
      <Title className="mb-12">
        Welcome back.
        <br />
        Log in to your account below.
      </Title>

      <div className="flex flex-col items-center w-full">
        <GoogleSignIn redirectTo={redirectTo} />
      </div>

      <div className="flex flex-col items-center mb-8 w-full relative">
        <hr className="w-full" />
        <div className="absolute text-base top-[-24px] bg-white p-3 text-center text-[#74747A]">or</div>
      </div>

      <SignIn reset={!!reset} redirectTo={redirectTo} />

      <Link href="/reset" className="text-[#D946EF] text-[16px] mt-6 hover:underline">
        Forgot password?
      </Link>

      <div className="mt-6 text-[16px]">
        <span className="text-[#74747A]">Need to create a new organization?&nbsp;</span>
        <Link href={signUpUrl.toString()} className="text-[#D946EF] hover:underline">
          Sign up
        </Link>
      </div>
    </>
  );
}
