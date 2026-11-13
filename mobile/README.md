# Art & Art — Mobile App (React Native / Expo)

This is the cross-platform mobile application for **Art & Art**, built with React Native and Expo. It shares the same Node.js/Express backend as the web client and admin panel.

---

## 📁 Project Structure

```text
mobile/
├── assets/                  # App icons, splash screens, and local media
├── src/
│   ├── api/                 # API endpoint mappings & Axios client
│   │   └── apiClient.js
│   ├── components/          # Reusable UI widgets (cards, headers, buttons)
│   ├── constants/           # Color palettes, spacing tokens, and typography
│   │   └── theme.js
│   ├── context/             # Global state (Cart, Wishlist, Auth token)
│   ├── navigation/          # React Navigation (Bottom Tabs & Native Stacks)
│   └── screens/             # Screen views (Home, Explore, Details, Cart, Orders, AR...)
├── App.js                   # Main application entry point
├── app.json                 # Expo configuration
└── package.json
```

---

## ⚙️ Environment & Network Setup

When testing on a real device via **Expo Go** or an Android/iOS emulator:
- **Do not use `localhost`** (as the mobile device treats `localhost` as itself).
- Create a `.env` file inside `mobile/`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:4000
```
> Example: `EXPO_PUBLIC_API_URL=http://192.168.1.15:4000` (Find your IP with `ipconfig` on Windows).
> If using Android Emulator on the same machine, you can also use `http://10.0.2.2:4000`.

---

## 🚀 Running the App

Inside this directory:
```bash
cd mobile
npm start
```
Then:
- Press **`a`** to open in Android Emulator
- Press **`i`** to open in iOS Simulator (macOS only)
- Scan the QR code using the **Expo Go** app on your physical iOS or Android phone
