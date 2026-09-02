// data.js - Central Data Store & Initial Datasets
window.INITIAL_CONFIG = {
  masjidTitle: "SHAHI MASJID BAGH-E-AAM",
  masjidSub: "Under the Aegis of Online Madarsa Al Hamoomea for Islamic & Arabic Studies",
  compTitle: "3rd Seerat-un-Nabi Competition",
  compSubtitle: '"Bench to Exam Hall: Lessons of Discipline & Success from Seerat-un-Nabi ﷺ"',
  compBadge: "Annual Knowledge Contest",
  compDesc: "Open for Intermediate, Graduate, and Postgraduate levels with separate divisions for Boys & Girls. 48 Distinguished Prizes will be distributed InshaAllah.",
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
  prayers: [
    { name: "Fajr", adhan: "5:18 AM", iqama: "5:45 AM" },
    { name: "Dhuhr", adhan: "12:32 PM", iqama: "1:15 PM" },
    { name: "Asr", adhan: "4:35 PM", iqama: "4:55 PM" },
    { name: "Maghrib", adhan: "6:24 PM", iqama: "6:28 PM" },
    { name: "Isha", adhan: "7:44 PM", iqama: "8:10 PM" }
  ]
};

window.SEERAT_KNOWLEDGE_BASE = {
  en: {
    lineageTitle: "Blessed Lineage & Family of Prophet Muhammad ﷺ",
    father: "Abdullah ibn Abd al-Muttalib",
    mother: "Aminah bint Wahb",
    grandfather: "Abd al-Muttalib (Chief of Quraysh)",
    uncle: "Abu Talib (Protector during early Da'wah)",
    birth: "12th Rabi' al-Awwal, Year of the Elephant (570 CE) in Makkah",
    wives: "Khadijah bint Khuwaylid (first wife), Sawdah, Aishah, Hafsah, Zaynab bint Khuzaymah, Umm Salamah, Zaynab bint Jahsh, Juwayriyah, Umm Habibah, Safiyyah, Maymunah, and Mariyah al-Qibtiyyah (Mothers of the Believers - Razi Allahu Anhunna).",
    sons: "Al-Qasim, Abdullah, and Ibrahim (all passed away in infancy).",
    daughters: "Zaynab, Ruqayyah, Umm Kulthum, and Fatimah az-Zahra (Razi Allahu Anhunna).",
    faqs: [
      { q: "Q1: What is the main theme of the 3rd Seerat Competition?", a: "Bench to Exam Hall: Lessons of Discipline & Success from Seerat-un-Nabi ﷺ." },
      { q: "Q2: How many total prizes are to be awarded?", a: "48 distinguished prizes distributed across Intermediate, Graduate, and Postgraduate tiers for both Male and Female categories." },
      { q: "Q3: At what age did the Prophet ﷺ receive the first revelation?", a: "At the age of 40 in the Cave of Hira via Angel Jibreel (Surah Al-Alaq, 1-5)." },
      { q: "Q4: How long did the Makkan and Madinan eras last?", a: "The Makkan period spanned 13 years focusing on Tawheed and patience; the Madinan period spanned 10 years establishing the Islamic state and society." }
    ]
  },
  ar: {
    lineageTitle: "النسب الشريف والأسرة المباركة للنبي محمد ﷺ",
    father: "عبد الله بن عبد المطلب",
    mother: "آمنة بنت وهب",
    grandfather: "عبد المطلب (سيد قريش)",
    uncle: "أبو طالب (كافله وناصره)",
    birth: "١٢ ربيع الأول عام الفيل (٥٧٠ م) بمكة المكرمة",
    wives: "خديجة بنت خويلد، سودة، عائشة، حفصة، زينب بنت خزيمة، أم سلمة، زينب بنت جحش، جويرية، أم حبيبة، صفية، ميمونة، ومارية القبطية (أمهات المؤمنين رضي الله عنهن).",
    sons: "القاسم، عبد الله، وإبراهيم (توفوا صغاراً).",
    daughters: "زينب، رقية، أم كلثوم، وفاطمة الزهراء (رضي الله عنهن).",
    faqs: [
      { q: "السؤال ١: ما هو شعار المسابقة السنوية الثالثة للسيرة النبوية؟", a: "من مقاعد الدراسة إلى قاعة الامتحان: دروس الانضباط والنجاح من السيرة النبوية الشريفة ﷺ." },
      { q: "السؤال ٢: كم عدد الجوائز المخصصة للفائزين؟", a: "٤٨ جائزة كبرى موزعة على فئات المتوسط، الجامعي، والدراسات العليا للبنين والبنات بشكل منفصل." },
      { q: "السؤال ٣: في أي سن نزل الوحي على النبي ﷺ؟", a: "في سن الأربعين في غار حراء بواسطة جبريل عليه السلام (اقرأ باسم ربك الذي خلق)." },
      { q: "السؤال ٤: ما هي مدة الدعوة في مكة والمدينة؟", a: "١٣ سنة في مكة ركزت على التوحيد وتربية القلوب، و١٠ سنوات في المدينة المنورة لبناء الدولة والمجتمع." }
    ]
  },
  ro: {
    lineageTitle: "Nabi Kareem ﷺ Ka Muqaddas Khandaan Aur Nasab",
    father: "Hazrat Abdullah ibn Abdul Muttalib",
    mother: "Hazrat Aminah bint Wahb",
    grandfather: "Hazrat Abdul Muttalib (Sardar-e-Quraysh)",
    uncle: "Hazrat Abu Talib",
    birth: "12 Rabi-ul-Awwal, Aam-ul-Feel (570 CE), Makkah Mukarrama",
    wives: "Hazrat Khadijah, Hazrat Sawdah, Hazrat Aishah, Hazrat Hafsah, Hazrat Zaynab bint Khuzaymah, Hazrat Umm Salamah, Hazrat Zaynab bint Jahsh, Hazrat Juwayriyah, Hazrat Umm Habibah, Hazrat Safiyyah, Hazrat Maymunah, aur Hazrat Mariyah Qibtiyyah (Ummahat-ul-Momineen R.A).",
    sons: "Hazrat Qasim, Hazrat Abdullah, aur Hazrat Ibrahim (bachpan me inteqal farmaya).",
    daughters: "Hazrat Zaynab, Hazrat Ruqayyah, Hazrat Umm Kulthum, aur Hazrat Fatimah az-Zahra (R.A).",
    faqs: [
      { q: "Sawal 1: 3rd Seerat Competition ka markazi unwan kya hai?", a: "Bench se Exam Hall tak: Seerat-un-Nabi ﷺ se Nazm-o-Zabt aur Kamyabi ke Sabaq." },
      { q: "Sawal 2: Kul kitne inamat taqseem honge?", a: "Total 48 Shandar Inamat Intermediate, Degree, aur PG level ke tulba aur talibaat ke darmiyan." },
      { q: "Sawal 3: Pehli Wahi kis umr me aur kahan nazil hui?", a: "40 saal ki umr me Ghaar-e-Hira ke andar Hazrat Jibreel (A.S) ke zariye Surah Al-Alaq ki ibtedai aayat nazil huin." },
      { q: "Sawal 4: Makki aur Madani daur kitne arse par mushtamil tha?", a: "Makki daur 13 saal (Tawheed aur Sabr par mabni) aur Madani daur 10 saal (Islami Muashra aur Riyasat ki tameer)." }
    ]
  }
};

window.INITIAL_PAPERS = [
  { id: 1, title: "1st Seerat Competition Question Paper (All Categories)", year: "2024", url: "#", category: "General" },
  { id: 2, title: "2nd Seerat Competition Model Paper & Key", year: "2025", url: "#", category: "General" }
];

window.INITIAL_NOTICES = [
  { id: 1, title: "3rd Edition Live Registrations", date: "Official", desc: "Boys and Girls separate series enrollment is now open." },
  { id: 2, title: "Dignitaries Confirmed", date: "Update", desc: "Molana Hafiz Dr Ahsan Bin Mohammed Al Hamoomee Sahab & Janab Munavar Zama Sahab will grace the event." },
  { id: 3, title: "Official Stamp Verification", date: "Mandatory", desc: "Printed admit cards must obtain the Madarsa Al Hamoomea seal at verification desks." }
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
