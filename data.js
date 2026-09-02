// js/data.js

// Default Configuration Schema
export const INITIAL_CONFIG = {
  masjidTitle: "SHAHI MASJID BAGH-E-AAM",
  masjidSub: "Under the Aegis of Online Madarsa Al Hamoomea for Islamic & Arabic Studies",
  compTitle: "3rd Seerat-un-Nabi Competition",
  compSubtitle: '"Bench to Exam Hall: Lessons of Discipline & Success from Seerat-un-Nabi ﷺ"',
  compBadge: "Annual Knowledge Contest",
  compDesc: "Open for Intermediate, Graduate, and Postgraduate levels with separate divisions for Boys & Girls. 48 Distinguished Prizes will be distributed InshaAllah.",
  examDate: "Saturday, January 31, 2026",
  prepTime: "09:30 AM to 10:15 AM (Pre-Exam Orientation & Guidelines)",
  examTime: "10:30 AM to 01:00 PM",
  examVenue: "Shahi Masjid Bagh-e-Aam, Nampally, Hyderabad, TS",
  pocContact: "+91 92900 00000 (Convenor)",
  masjidContact: "040-23200000 / info@shahimasjid.org",
  jumaLine: "Juma Khutbah: 1:00 PM | Juma Ba-Jamat: 1:30 PM (Shahi Masjid)",
  youtube: "https://youtube.com",
  facebook: "https://facebook.com",
  whatsappChannel: "https://whatsapp.com",
  prayers: [
    { name: "Fajr", adhan: "5:18 AM", iqama: "5:45 AM" },
    { name: "Dhuhr", adhan: "12:32 PM", iqama: "1:15 PM" },
    { name: "Asr", adhan: "4:35 PM", iqama: "4:55 PM" },
    { name: "Maghrib", adhan: "6:24 PM", iqama: "6:28 PM" },
    { name: "Isha", adhan: "7:44 PM", iqama: "8:10 PM" }
  ]
};

export const INITIAL_PAPERS = [
  { id: 1, title: "1st Seerat Competition Question Paper (All Categories)", year: "2024", url: "#", category: "General" },
  { id: 2, title: "2nd Seerat Competition Model Paper & Key", year: "2025", url: "#", category: "General" }
];

export const INITIAL_NOTICES = [
  { id: 1, title: "3rd Edition Announced", date: "Official", desc: "Registrations are live across Intermediate, Graduate, and PG brackets." },
  { id: 2, title: "ID Verification Alert", date: "Mandatory", desc: "Bring physical original of the submitted ID card (Aadhaar or PAN) on exam day." }
];

// Optional Firebase Cloud Real-time Syncer
// Replace values below with your Firebase project keys for cross-device syncing
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Storage helper with fallback to localStorage
export class DataStore {
  static get(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
