import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firebase (you'll need to add your Firebase config)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.startsWith('image/')) {
    return new Response('Invalid or missing content-type header.', {
      status: 400,
    });
  }

  const filename = req.headers.get('x-vercel-filename') || 'file.txt';
  const fileType = `.${contentType.split('/')[1]}`;
  const timestamp = Date.now();
  const finalName = filename.includes(fileType)
    ? `${filename}-${timestamp}`
    : `${filename}-${timestamp}${fileType}`;

  try {
    const arrayBuffer = await req.arrayBuffer();
    const storageRef = ref(storage, finalName);
    await uploadBytes(storageRef, new Uint8Array(arrayBuffer), { contentType });
    const downloadURL = await getDownloadURL(storageRef);

    return NextResponse.json({ url: downloadURL });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(`Error uploading file: ${error}`, {
      status: 500,
    });
  }
}
