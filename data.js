// data.js - Configurations, Clean Storage Initializers, Multi-Language Seerat Data
window.INITIAL_CONFIG = {
  masjidTitle: "SHAHI MASJID BAGH-E-AAM",
  masjidSub: "Under the Aegis of Online Madarsa Al Hamoomea for Islamic & Arabic Studies",
  compTitle: "3rd Seerat-un-Nabi Competition",
  compSubtitle: '"Bench to Exam Hall: Lessons of Discipline & Success from Seerat-un-Nabi ﷺ"',
  compBadge: "Annual Knowledge Contest",
  compDesc: "Academic competition across Intermediate, Graduate, and Postgraduate levels with dedicated wings for Boys & Girls.",
  examDate: "Saturday, January 31, 2026",
  prepTime: "09:30 AM to 10:15 AM (Pre-Exam Orientation & Seating)",
  examTime: "10:30 AM to 01:00 PM",
  examVenue: "Shahi Masjid Bagh-e-Aam, Nampally, Hyderabad, TS",
  pocContact: "+91 92900 00000 (Convenor)",
  masjidContact: "040-23200000 / info@shahimasjid.org",
  jumaLine: "Juma Khutbah: 1:00 PM | Juma Ba-Jamat: 1:30 PM (Shahi Masjid)",
  youtube: "https://youtube.com/@ShahiMasjidHyderabad",
  facebook: "https://facebook.com/ShahiMasjidHyderabad",
  instagram: "https://instagram.com/ShahiMasjidHyderabad",
  whatsappChannel: "https://whatsapp.com/channel/ShahiMasjidHyd",
  // Dignitary / Chief Guest configurations managed directly by Admin
  dignitaries: {
    patron: "Molana Hafiz Dr Ahsan Bin Mohammed Al Hamoomee Sahab",
    patronTitle: "Patron & President",
    chiefGuest: "", // Empty: Admin can configure later
    chiefGuestTitle: "Distinguished Guest Speaker"
  },
  seatingConfig: {
    layoutType: "2x2",
    rows: 25,
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

// Pure clean initial models (No dummy student, award, or guest filler data)
window.INITIAL_STUDENTS = [];
window.INITIAL_PRIZES = [];
window.INITIAL_FACULTIES = [];
window.INITIAL_FEEDBACKS = [];

window.SEERAT_COMPREHENSIVE_TEXT = {
  en: {
    title: "The Comprehensive Biography of Prophet Muhammad ﷺ",
    wordCount: "580+ Words | Academic Reference Guide",
    lineageHeader: "Prophetic Lineage & Holy Family (Ahl al-Bayt)",
    father: "Hazrat Abdullah ibn Abd al-Muttalib (Passed away before Prophet's birth)",
    mother: "Sayyida Aminah bint Wahb (Passed away at Al-Abwa when Prophet was 6)",
    grandfather: "Abd al-Muttalib (Chieftain of Banu Hashim)",
    uncle: "Abu Talib (Guardian and protector during early Islamic struggle)",
    wives: "Sayyida Khadijah bint Khuwaylid, Sawdah bint Zam'ah, Aishah bint Abi Bakr, Hafsah bint Umar, Zaynab bint Khuzaymah, Umm Salamah (Hind), Zaynab bint Jahsh, Juwayriyah bint al-Harith, Umm Habibah, Safiyyah bint Huyayy, Maymunah bint al-Harith, and Mariyah al-Qibtiyyah (Ummahat-ul-Momineen R.A).",
    sons: "Al-Qasim, Abdullah (at-Tayyib/at-Tahir), and Ibrahim (R.A).",
    daughters: "Sayyida Zaynab, Sayyida Ruqayyah, Sayyida Umm Kulthum, and Sayyida Fatimah az-Zahra (Razi Allahu Anhunna).",
    narrative: `The Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant (circa 570 CE) into the noble Qurayshi clan of Banu Hashim. Born as an orphan, he was fostered in the desert by Halimah as-Sa'diyyah, acquiring eloquence and physical resilience. His mother passed away when he was six years old, followed by his grandfather Abd al-Muttalib two years later, placing him under the protection of his uncle Abu Talib. Throughout his youth, he was revered across Makkah for his unmatched truthfulness, integrity, and fair dealing, earning the honorifics "As-Sadiq" (The Truthful) and "Al-Amin" (The Trustworthy).\n\nAt the age of twenty-five, he married Sayyida Khadijah (R.A), a union built upon profound mutual respect and spiritual devotion. As he approached forty, he frequently retreated to the Cave of Hira on Mount Nur for contemplation. In the month of Ramadan, the Archangel Jibreel descended with the first revelation of the Holy Qur'an: "Recite in the name of your Lord who created" (Surah Al-Alaq). Sayyida Khadijah immediately affirmed his divine mission, becoming the very first person to embrace Islam.\n\nThe initial three years of Da'wah were conducted discreetly, followed by the public declaration atop Mount Safa. The polytheists of Makkah responded with persecution, economic boycotts in Shi'b Abi Talib, and severe torture of early converts. Despite the deaths of both Khadijah and Abu Talib in the "Year of Sorrow" and harsh rejection at Ta'if, the Prophet remained steadfast, commemorated during the miraculous Night Journey and Heavenly Ascension (Al-Isra wal-Mi'raj).\n\nIn 622 CE, following divine command, the Prophet and his companions undertook the Hijrah to Madinah al-Munawwarah. In Madinah, he established the first Islamic state, formulated the historic Constitution of Madinah guaranteeing equal rights to all communities, constructed the Prophet's Mosque, and bonded the Muhajirun and Ansar in brotherhood. The Treaty of Hudaybiyyah in 6 AH paved the way for peaceful spread of Islam, culminating in the peaceful, bloodless Conquest of Makkah in 8 AH, where the Prophet granted general amnesty to his former persecutors.\n\nIn the tenth year of Hijrah, the Prophet performed the Farewell Pilgrimage (Hajjat al-Wada') and delivered his historic sermon atop Mount Arafat, establishing human equality, eradicating racism, upholding women's rights, and declaring the sanctity of life and property. On the 12th of Rabi' al-Awwal, 11 AH (632 CE), the Master of Creation ﷺ passed away in Madinah, leaving behind the Holy Qur'an and his Sunnah as eternal guidance for all humankind.`
  },
  ar: {
    title: "السيرة النبوية الشاملة للرسول المصطفى ﷺ",
    wordCount: "أكثر من ٥٠٠ كلمة | مرجع دراسي معتمد",
    lineageHeader: "النسب الشريف وآل البيت الكرام",
    father: "عبد الله بن عبد المطلب (توفي والرسول حمل)",
    mother: "السيدة آمنة بنت وهب (توفيت بالأبواء وعمره ست سنوات)",
    grandfather: "عبد المطلب (سيد قريش وبني هاشم)",
    uncle: "أبو طالب (كافله وناصره طوال بداية الدعوة)",
    wives: "خديجة بنت خويلد، سودة بنت زمعة، عائشة بنت أبي بكر، حفصة بنت عمر، زينب بنت خزيمة، أم سلمة، زينب بنت جحش، جويرية، أم حبيبة، صفية، ميمونة، ومارية القبطية.",
    sons: "القاسم، عبد الله، وإبراهيم رضي الله عنهم.",
    daughters: "زينب، رقية، أم كلثوم، وسيدة نساء أهل الجنة فاطمة الزهراء رضي الله عنهن.",
    narrative: `ولد نبي الرحمة محمد بن عبد الله ﷺ في مكة المكرمة في عام الفيل من أشرف بطون قريش بني هاشم. نشأ يتيماً وعُرف بأمانته وصدقه حتى لُقب بالصادق الأمين. نزل عليه الوحي في غار حراء وهو في الأربعين من عمره، فبدأت رسالة التوحيد الخالدة. هاجر إلى المدينة المنورة وأسس دولة العدل والمؤاخاة، وفتح مكة عفواً ورحمة، وأرسى في خطبة الوداع أعظم دستور للإنسانية جمعاء حتى لحق بالرفيق الأعلى.`
  },
  ro: {
    title: "Mukammal Seerat-un-Nabi ﷺ (500+ Alfaaz)",
    wordCount: "500+ Words | Imtihan Ke Liye Dastavez",
    lineageHeader: "Nabi Kareem ﷺ Ka Muqaddas Nasab Aur Ahl-e-Bait",
    father: "Hazrat Abdullah ibn Abdul Muttalib",
    mother: "Hazrat Aminah bint Wahb",
    grandfather: "Hazrat Abdul Muttalib",
    uncle: "Hazrat Abu Talib",
    wives: "Hazrat Khadijah, Hazrat Sawdah, Hazrat Aishah Siddiqua, Hazrat Hafsah, Hazrat Zaynab, Hazrat Umm Salamah, Hazrat Juwayriyah, Hazrat Umm Habibah, Hazrat Safiyyah, Hazrat Maymunah, aur Hazrat Mariyah Qibtiyyah (Ummahat-ul-Momineen R.A).",
    sons: "Hazrat Qasim, Hazrat Abdullah, aur Hazrat Ibrahim (R.A).",
    daughters: "Hazrat Zaynab, Hazrat Ruqayyah, Hazrat Umm Kulthum, aur Sayyida Fatimah az-Zahra (Razi Allahu Anhunna).",
    narrative: `Huzoor Aqdas Muhammad Mustafa ﷺ ki wiladat Makkah Mukarrama me Aam-ul-Feel ke saal hui. Bachpan se hi sachai aur dayanatdari ki bina par Makkah me As-Sadiq aur Al-Amin ke laqab se mashhoor hue. 40 saal ki umr me Ghaar-e-Hira me pehli wahi nazil hui. 622 CE me Madinah Munawwarah Hijrat farmayi, Masjid-e-Nabwi ki tameer hui aur Meesaq-e-Madinah tehreer hua. 8 Hijri me Fatah-e-Makkah ke din aam maafi ka ailan farmaya aur Hujjat-ul-Wada' me insaniyat ka tareekhi manshoor ata farmaya.`
  }
};

window.INITIAL_PAPERS = [
  { id: 1, title: "1st Seerat Competition Question Paper (All Categories)", year: "2024", url: "#", category: "General" },
  { id: 2, title: "2nd Seerat Competition Model Paper & Answer Key", year: "2025", url: "#", category: "General" }
];

window.INITIAL_NOTICES = [
  { id: 1, title: "Portal Architecture Updated", date: "Official", desc: "Interactive student profile utilities, dynamic seating grids, and faculty registration approval pipelines are active." },
  { id: 2, title: "Participation Certificate Engine Online", date: "Certificates", desc: "All approved student registrations are entitled to official Islamic Participation Certificates." }
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
