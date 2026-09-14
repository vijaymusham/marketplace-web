// This file configures the initialization of Sentry on the client.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: isProd
    ? "https://20e2a170c66faa51f0d48ab7c96eaa38@o4511830816063488.ingest.de.sentry.io/4511864662458448"
    : undefined,

  // Replay is heavy on main-thread / TBT — only enable in production at a low rate.
  integrations: isProd ? [Sentry.replayIntegration()] : [],

  tracesSampleRate: isProd ? 0.05 : 0,

  enableLogs: false,

  replaysSessionSampleRate: isProd ? 0.01 : 0,
  replaysOnErrorSampleRate: isProd ? 0.5 : 0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
