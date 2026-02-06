# Dynamic QR Code MVP

Simple dynamic QR codes with Firebase. Create once, update forever.

## 🚀 Deploy to GitHub Pages

1. **Upload to GitHub**
   - Create new repo
   - Upload all files
   
2. **Enable GitHub Pages**
   - Settings → Pages
   - Source: main branch
   - Save

3. **Set up Firebase**
   - Already configured in the code
   - Just need to set Firestore rules (see below)

4. **Done!**
   - Visit: `https://yourusername.github.io/repo-name`

## Firebase Setup

Your config is already in the code. Just need to set Firestore rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `polorfriends`
3. Firestore Database → Rules
4. Paste this (test mode - allows anyone to read/write):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /qrcodes/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Important:** These rules allow ANYONE to create/edit QR codes. Good for testing, not production.

## How It Works

1. **Create QR** → Generates random 7-char ID → Saves to Firebase
2. **Edit Content** → Updates Firebase → Changes reflect instantly
3. **Scan QR** → Shows live content from Firebase

## Files

```
index.html       → Create QR codes
dashboard.html   → View all QR codes  
edit.html        → Edit content
q.html          → Public page
styles.css      → Styling
app.js          → QR generation
dashboard.js    → Dashboard
edit.js         → Editor
q.js            → Public display (real-time)
```

## Database Structure

Firestore collection: `qrcodes`

```javascript
{
  id: "Ab3Xk92",
  title: "Welcome",
  text: "Hello world",
  imageUrl: "https://...",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Features

✅ Real-time updates (edit content, QR updates instantly)  
✅ Works across all devices  
✅ No backend needed (Firebase handles it)  
✅ Mobile responsive  
✅ Free to host on GitHub Pages  

## Limitations

- No authentication (anyone can create/edit)
- Firebase free tier limits apply
- Need internet for real-time updates

## Next Steps

For production:
- Add Firebase Authentication
- Add proper security rules
- Add user accounts
- Add analytics
- Custom domains

That's it. Works out of the box.
