import type { PendingGoogleSignup } from "@/components/auth/useCompleteAuth";

export const SIGN_IN_EVENT = "dealmarket:signin";

export type SignInEventDetail = { googleSignup?: PendingGoogleSignup };

/** Ask the navbar Sign In control to open the auth drawer. */
export function requestSignIn(detail?: SignInEventDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<SignInEventDetail>(SIGN_IN_EVENT, { detail }));
}
