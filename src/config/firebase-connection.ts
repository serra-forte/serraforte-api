import * as firebase from 'firebase-admin';
import 'dotenv/config';
import { env } from '@/env';

export const firebaseApp = firebase
  .initializeApp({
    credential: firebase.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY
    }),
    storageBucket: env.FIREBASE_BUCKET,
  })
