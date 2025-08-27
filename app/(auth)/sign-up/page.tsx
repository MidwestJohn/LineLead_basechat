import Link from "next/link";

import { getSignInPath } from "@/lib/paths";
import * as settings from "@/lib/server/settings";

import { Title } from "../common";
import GoogleSignIn from "../google-sign-in";

import SignUp from "./sign-up";

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ redirectTo?: string }> }) {
  const { redirectTo } = await searchParams;

  // Create sign-in URL with safer URL construction
  let signInUrl: URL;
  try {
    signInUrl = new URL(getSignInPath(), settings.BASE_URL || "http://localhost:3000");
  } catch {
    // Fallback if BASE_URL is invalid
    signInUrl = new URL(getSignInPath(), "http://localhost:3000");
  }

  if (redirectTo) {
    signInUrl.searchParams.set("redirectTo", redirectTo);
  }

  return (
    <>
      <Title className="mb-12">
        Welcome to {settings.APP_NAME}.<br />
        Sign up to build your chatbot.
      </Title>

      <div className="flex flex-col items-center w-full">
        <GoogleSignIn redirectTo={redirectTo} />
      </div>

      <div className="flex flex-col items-center mb-8 w-full relative">
        <hr className="w-full" />
        <div className="absolute text-base top-[-24px] bg-white p-3 text-center text-[#74747A]">or</div>
      </div>

      <SignUp redirectTo={redirectTo} />

      <div className="mt-6 text-[16px]">
        <span className="text-[#74747A]">Already using {settings.APP_NAME}?&nbsp;</span>
        <Link href={signInUrl.toString()} className="text-[#DC1714] hover:underline">
          Sign in
        </Link>
      </div>
    </>
  );
}
