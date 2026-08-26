import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | undefined;

function getAdminApp(): App {
  if (app) return app;

  const existing = getApps();
  if (existing.length > 0) {
    app = existing[0];
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Vercel env vars store literal "\n" for newlines; convert back to real ones.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    // Explicit service account — used locally and on hosts outside this
    // Firebase project (e.g. Vercel), where no ambient GCP identity exists.
    app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    return app;
  }

  // Running inside this Firebase project's own Cloud Functions/Cloud Run
  // (Firebase Hosting's Next.js integration): the runtime's service account
  // is picked up automatically, no manual credentials needed.
  app = initializeApp({ credential: applicationDefault() });
  return app;
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
