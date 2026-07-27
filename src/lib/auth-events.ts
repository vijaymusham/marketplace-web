/** Ask the navbar Sign In control to open the auth drawer. */
export function requestSignIn() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("dealmarket:signin"));
}

export const SIGN_IN_EVENT = "dealmarket:signin";
