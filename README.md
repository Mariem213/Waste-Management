# ♻️ Waste Management System

> A civic-tech web application that empowers citizens to report waste, contribute to environmental cleanliness, and earn rewards — built as a front-end project using HTML, Bootstrap, Firebase, and AI image analysis.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Target Users](#target-users)
- [Live Demo](#live-demo)
- [UI Screens](#ui-screens)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema (Firebase)](#database-schema-firebase)
- [Installation & Setup](#installation--setup)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 About the Project

The **Waste Management System** is a community-driven web platform designed to encourage citizens of Saudi Arabia to actively participate in keeping their cities clean. Users can:

- **Report waste** by uploading photos from their surroundings
- **Earn coins** for every valid waste image submission
- **Redeem rewards** (eco-bags and special offers) using their accumulated coins
- **View geographic maps** showing reported waste hotspots across multiple cities
- **Manage their profiles** and track contribution history

The platform leverages an AI-powered image recognition model to validate waste submissions and auto-classify waste types. It connects to Firebase for real-time authentication, data storage, and user management.

---

## 🎯 Target Users

| User Type | Description |
|-----------|-------------|
| **General Citizens** | Residents who want to report waste and earn rewards for contributing to a cleaner environment |
| **Environmental Volunteers** | Active contributors who regularly upload waste images and track hotspot activity on the map |
| **Municipality / Admins** | Officials who monitor waste reports, geographic data, and platform activity *(future scope)* |
| **Youth & Students** | Young users motivated by the gamified coin & reward system to participate in sustainability campaigns |

---

## 🌐 Live Demo

> **Deployment URL:** *(Add your deployed link here — e.g., GitHub Pages, Vercel, Netlify)*

```
[Waste-Management](https://waste-management-lemon-one.vercel.app/)
```

To deploy on **GitHub Pages**:
1. Push the project to a GitHub repository
2. Go to **Settings → Pages**
3. Set the source branch to `main` and folder to `/root`
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`

---

## 🖥️ UI Screens

### 1. 🏠 Home Page (`index.html`)
The landing page featuring:
- Hero section with a call-to-action button to upload waste photos
- **About Us** section explaining the platform's mission
- **Geographic Map** (Leaflet.js) showing waste report locations across cities in Saudi Arabia
- **Services** section showcasing recycling and waste trading capabilities
- **Contact Us** form powered by EmailJS

### 2. 🔐 Login / Register Page (`pages/login.html`)
A dual-panel animated authentication page:
- **Sign In** panel for existing users (email + password)
- **Sign Up** panel for new user registration (name, email, password)
- **Forgot Password** link redirects to the reset flow
- Auth is handled via **Firebase Authentication**

### 3. 🔑 Forgot Password Page (`pages/forgetpass.html`)
- User enters their registered email
- If found, a form appears to set and confirm a new password
- Inline validation with error messages

### 4. 📤 Upload Page (`pages/upload.html`)
The core feature of the platform:
- Displays the user's current **coin balance**
- File input to upload a waste image
- Image preview before submission
- On upload, user earns **10 coins** per valid submission
- Quick-access button to the **Rewards** page

### 5. 🎁 Rewards Page (`pages/reward.html`)
A full rewards hub:
- **Coin & Bag Balance** summary bar
- **Shop Section** — purchase eco bags using coins (Eco Bag: 50, Green Bag: 70, Classic Bag: 90 coins)
- **Special Offers** — time-limited deals (e.g., 20% off, free bags)
- **My Bags** — inventory of purchased/received bags

### 6. 👤 Profile Page (`pages/profile.html`)
Displays the authenticated user's information:
- Profile photo, name, email, coin count
- Extended details: gender, phone, address, age, occupation
- **Edit Profile** button linking to the edit form

### 7. ✏️ Edit Profile Page (`pages/edit-profile.html`)
A form to update all user profile fields:
- Full name, email, profile image upload
- Gender, phone number, address, age, occupation
- **Save Changes** persists data to Firebase; **Cancel** returns to profile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Markup** | HTML5 |
| **Styling** | CSS3, Bootstrap 5.3 |
| **Interactivity** | Vanilla JavaScript (ES6 Modules) |
| **Maps** | Leaflet.js |
| **Authentication** | Firebase Authentication |
| **Database** | Firebase Firestore |
| **File Storage** | Firebase Storage |
| **Email** | EmailJS |
| **Icons** | Font Awesome 6.5 |

---

## 📁 Project Structure

```
waste-management/
│
├── index.html                  # Home page
│
├── pages/
│   ├── login.html              # Login & Register
│   ├── forgetpass.html         # Password reset
│   ├── upload.html             # Waste image upload
│   ├── reward.html             # Rewards & shop
│   ├── profile.html            # User profile view
│   └── edit-profile.html       # Edit profile form
│
├── JS/
│   ├── main.js                 # Navbar auth state, map init, contact form
│   ├── login.js                # Firebase login/register logic
│   ├── forget.js               # Password reset logic
│   ├── upload.js               # Image upload & coin award logic
│   ├── reward.js               # Rewards & shop logic
│   ├── profile.js              # Profile data rendering
│   └── editProfile.js          # Profile update logic
│
├── css/
│   ├── style.css               # Global styles
│   └── login.css               # Login/Register page styles
│
└── assets/
    └── images/
        ├── waste.png
        ├── service_1.png
        ├── service_2.png
        ├── service_3.png
        ├── service_4.png
        └── service_5.png
```

---

## 🗄️ Database Schema (Firebase Firestore)

### Collection: `users`

Each document ID = Firebase Auth `uid`

```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "photoURL": "string (Firebase Storage URL)",
  "gender": "Male | Female",
  "phone": "string",
  "address": "string",
  "age": "number",
  "job": "string",
  "coins": "number",
  "bags": "number",
  "createdAt": "timestamp"
}
```

---

### Collection: `uploads`

Each document = one waste image submission

```json
{
  "userId": "string (ref to users)",
  "imageURL": "string (Firebase Storage URL)",
  "city": "string",
  "latitude": "number",
  "longitude": "number",
  "coinsAwarded": 10,
  "uploadedAt": "timestamp"
}
```

---

### Collection: `rewards`

Tracks shop purchases and redeemed offers

```json
{
  "userId": "string (ref to users)",
  "itemName": "string",
  "itemType": "bag | offer",
  "coinsSpent": "number",
  "status": "pending | received",
  "redeemedAt": "timestamp"
}
```

---

### Collection: `contact_messages`

Stores contact form submissions

```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "sentAt": "timestamp"
}
```

---

## 🚀 Installation & Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge)
- A **Firebase project** (free tier is sufficient)
- A code editor (VS Code recommended)
- *(Optional)* [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension for local development

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/waste-management.git
cd waste-management
```

---

### Step 2 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** and follow the setup wizard
3. Enable the following services:
   - **Authentication** → Email/Password provider
   - **Firestore Database** → Start in test mode
   - **Storage** → Start in test mode

---

### Step 3 — Configure Firebase

1. In your Firebase project, go to **Project Settings → Your apps → Web app**
2. Register a new web app and copy the config object
3. Create a file `JS/firebase-config.js` (or update the existing one):

```javascript
// JS/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

### Step 4 — Configure EmailJS (Contact Form)

1. Sign up at [https://www.emailjs.com](https://www.emailjs.com)
2. Create an **Email Service** and an **Email Template**
3. In `JS/main.js`, update the EmailJS initialization:

```javascript
emailjs.init("YOUR_PUBLIC_KEY");
// And in the form handler:
emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams);
```

---

### Step 5 — Run the Project

**Option A — VS Code Live Server:**
1. Open the project folder in VS Code
2. Right-click `index.html` → **Open with Live Server**

**Option B — Python HTTP Server:**
```bash
# Python 3
python -m http.server 8000
# Then open http://localhost:8000
```

**Option C — Node.js HTTP Server:**
```bash
npx serve .
```

> ⚠️ **Important:** The project uses ES6 modules (`type="module"`). You **must** serve it via an HTTP server — opening `index.html` directly in a browser (`file://`) will cause CORS errors with Firebase imports.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| User Registration & Login | ✅ |
| Password Reset | ✅ |
| Waste Image Upload | ✅ |
| Coin Reward System | ✅ |
| User Profile (view & edit) | ✅ |
| Geographic Map (Leaflet.js) | ✅ |
| Rewards Shop | ✅ |
| Special Offers | ✅ |
| Contact Form (EmailJS) | ✅ |
| Responsive Design (Mobile) | ✅ |
| AI Waste Classification | 🔄 Planned |
| Admin Dashboard | 🔄 Planned |
| Push Notifications | 🔄 Planned |

---

## 🌍 Supported Cities (Map)

The geographic map currently includes waste report markers for the following cities in Saudi Arabia:

- Khamis Mushait
- Abha
- Al-Mansak
- Al-Badea
- King Khalid University area
- Al-Harir
- Al-Rasras
- Al-Safq
- King Faisal City

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

Please make sure your code is clean, commented where necessary, and follows the existing file/folder structure.

---

## 📄 License

© 2025 Waste Management System. All Rights Reserved.

---

> Built with 💚 to keep Saudi Arabia clean and green.
