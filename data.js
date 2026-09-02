// data.js - Configurations, Clean State Models, Seerat Hub & Initial Papers
window.INITIAL_CONFIG = {
  masjidTitle: "SHAHI MASJID BAGH-E-AAM",
  masjidSub: "Under the Aegis of Online Madarsa Al Hamoomea for Islamic & Arabic Studies",
  compTitle: "3rd Seerat-un-Nabi Competition",
  compSubtitle: '"Bench to Exam Hall: Lessons of Discipline & Success from Seerat-un-Nabi ﷺ"',
  compBadge: "Annual Knowledge Contest",
  compDesc: "Academic competition across Intermediate, Graduate, and Postgraduate levels with separate halls for Boys & Girls.",
  examDate: "Saturday, January 31, 2026",
  prepTime: "09:30 AM to 10:15 AM (Pre-Exam Seating & Verification)",
  examTime: "10:30 AM to 01:00 PM",
  examVenue: "Shahi Masjid Bagh-e-Aam, Nampally, Hyderabad, TS",
  pocContact: "+91 92900 00000 (Convenor)",
  masjidContact: "040-23200000 / info@shahimasjid.org",
  jumaLine: "Juma Khutbah: 1:00 PM | Juma Ba-Jamat: 1:30 PM (Shahi Masjid)",
  youtube: "https://youtube.com/@ShahiMasjidHyderabad",
  facebook: "https://facebook.com/ShahiMasjidHyderabad",
  instagram: "https://instagram.com/ShahiMasjidHyderabad",
  whatsappChannel: "https://whatsapp.com/channel/ShahiMasjidHyd",
  seatingConfig: {
    layoutType: "2x2", // 2x2, 3x3, 4x4, nxn
    rows: 20,
    colsPerRow: 4
  },
  prayers: [
    { name: "Fajr", adhan: "5:18 AM", iqama: "5:45 AM" },
    { name: "Dhuhr", adhan: "12:32 PM", iqama: "1:15 PM" },
    { name: "Asr", adhan: "4:35 PM", iqama: "4:55 PM" },
    { name: "Maghrib", adhan: "6:24 PM", iqama: "6:28 PM" },
    { name: "Isha", adhan: "7:44 PM", iqama: "8:10 PM" }
  ]
};

// Clean Student Store (Dynamic Assignment Enabled)
window.INITIAL_STUDENTS = [
  {
    appId: "APP-2026-1001",
    ticketNo: "SUN3-B-INT-1001",
    name: "Mohammed Farhan",
    father: "Abdul Rasheed",
    dob: "2006-04-12",
    phone: "9848011223",
    email: "farhan@example.com",
    idType: "Government ID",
    idNumber: "ID-5544-2201",
    category: "INT",
    gender: "M",
    attempt: "1st Time (New Applicant)",
    seat: "Hall A (Boys Wing) - R1-A",
    prize: "None",
    marks: 88,
    status: "Verified",
    attendance: "Present",
    feedback: "",
    registeredDate: "2026-01-10"
  },
  {
    appId: "APP-2026-2001",
    ticketNo: "SUN3-G-GRAD-2001",
    name: "Fatima Zehra",
    father: "Mirza Nayeem Baig",
    dob: "2004-08-22",
    phone: "9848033445",
    email: "fatima@example.com",
    idType: "Government ID",
    idNumber: "ID-9988-1122",
    category: "GRAD",
    gender: "F",
    attempt: "1st Time (New Applicant)",
    seat: "Hall B (Girls Wing) - R1-A",
    prize: "None",
    marks: 94,
    status: "Verified",
    attendance: "Present",
    feedback: "",
    registeredDate: "2026-01-11"
  }
];

// Faculty Accounts & Pending Approval Registry
window.INITIAL_FACULTIES = [
  {
    id: "FAC-101",
    name: "Mufti Zubair Ahmed",
    email: "zubair@madarsa.org",
    phone: "9876543210",
    dept: "Islamic Jurisprudence & Hadith",
    status: "Approved", // Approved or Pending
    role: "faculty",
    assignedHall: "Hall A (Boys Wing)"
  }
];

// 500+ Words Seerat Reference Knowledge Hub
window.SEERAT_COMPREHENSIVE_TEXT = {
  en: {
    title: "The Comprehensive Biography of Prophet Muhammad ﷺ",
    wordCount: "580+ Words | Academic Reference Guide",
    lineageHeader: "Prophetic Lineage & Holy Family (Ahl al-Bayt)",
    father: "Hazrat Abdullah ibn Abd al-Muttalib (Passed away before the blessed birth)",
    mother: "Sayyida Aminah bint Wahb (Passed away at Al-Abwa when Prophet was six)",
    grandfather: "Abd al-Muttalib (Chieftain of Banu Hashim)",
    uncle: "Abu Talib (Guardian and protector during early Islamic struggle)",
    wives: "Sayyida Khadijah bint Khuwaylid, Sawdah bint Zam'ah, Aishah bint Abi Bakr, Hafsah bint Umar, Zaynab bint Khuzaymah, Umm Salamah (Hind bint Abi Umayyah), Zaynab bint Jahsh, Juwayriyah bint al-Harith, Umm Habibah (Ramlah bint Abi Sufyan), Safiyyah bint Huyayy, Maymunah bint al-Harith, and Mariyah al-Qibtiyyah (Ummahat-ul-Momineen R.A).",
    sons: "Al-Qasim, Abdullah (at-Tayyib/at-Tahir), and Ibrahim (R.A).",
    daughters: "Sayyida Zaynab, Sayyida Ruqayyah, Sayyida Umm Kulthum, and Sayyida Fatimah az-Zahra (Razi Allahu Anhunna).",
    narrative: `The Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant (circa 570 CE) into the noble Qurayshi clan of Banu Hashim. Born as an orphan, he was fostered in the desert by Halimah as-Sa'diyyah, acquiring eloquence and physical resilience. His mother passed away when he was six years old, followed by his grandfather Abd al-Muttalib two years later, placing him under the protection of his uncle Abu Talib. Throughout his youth, he was revered across Makkah for his unmatched truthfulness, integrity, and fair dealing, earning the honorifics "As-Sadiq" (The Truthful) and "Al-Amin" (The Trustworthy).\n\nAt the age of twenty-five, he married Sayyida Khadijah (R.A), a union built upon mutual respect and spiritual devotion. As he reached forty, he frequently retreated to the Cave of Hira on Mount Nur for contemplation. In the month of Ramadan, Archangel Jibreel descended with the first revelation of the Holy Qur'an: "Recite in the name of your Lord who created" (Surah Al-Alaq). Sayyida Khadijah immediately affirmed his divine mission, becoming the very first person to embrace Islam.\n\nThe initial three years of Da'wah were conducted discreetly, followed by the public declaration atop Mount Safa. The polytheists of Makkah responded with persecution, economic boycotts in Shi'b Abi Talib, and severe torture of early converts. Despite the deaths of Khadijah and Abu Talib in the "Year of Sorrow" and harsh rejection at Ta'if, the Prophet remained steadfast, commemorated during the miraculous Night Journey and Heavenly Ascension (Al-Isra wal-Mi'raj).\n\nIn 622 CE, following divine command, the Prophet and his companions undertook the Hijrah to Madinah al-Munawwarah. In Madinah, he established the first Islamic state, formulated the Constitution of Madinah guaranteeing rights to all communities, built the Prophet's Mosque, and bonded the Muhajirun and Ansar in brotherhood. The Treaty of Hudaybiyyah in 6 AH paved the way for peaceful spread of Islam, culminating in the bloodless Conquest of Makkah in 8 AH, where the Prophet granted universal amnesty to his former persecutors.\n\nIn the tenth year of Hijrah, the Prophet performed the Farewell Pilgrimage (Hajjat al-Wada') and delivered his historic sermon atop Mount Arafat, establishing human equality, eradicating racism, and upholding women's rights. On the 12th of Rabi' al-Awwal, 11 AH (632 CE), the Master of Creation ﷺ passed away in Madinah, leaving behind the Holy Qur'an and his Sunnah as eternal guidance for all humankind.`
  }
};

window.INITIAL_PAPERS = [
  { id: 1, title: "1st Seerat Competition Question Paper (All Categories)", year: "2024", url: "#" },
  { id: 2, title: "2nd Seerat Competition Model Paper & Answer Key", year: "2025", url: "#" }
];

window.INITIAL_NOTICES = [
  { id: 1, title: "Official Seating Matrix Released", date: "Update", desc: "Hall configurations and seating numbers are now live." },
  { id: 2, title: "Participation Certificates Available", date: "Awards", desc: "All enrolled candidates can download their digital certificate with authentic Hadith." }
];

window.DataStore = {
  get: function(key, fallback) {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  },
  set: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
