// data.js - Comprehensive 500+ Word Seerat Hub, 48 Prize Models & Configurations
window.INITIAL_CONFIG = {
  masjidTitle: "SHAHI MASJID BAGH-E-AAM",
  masjidSub: "Under the Aegis of Online Madarsa Al Hamoomea for Islamic & Arabic Studies",
  compTitle: "3rd Seerat-un-Nabi Competition",
  compSubtitle: '"Bench to Exam Hall: Lessons of Discipline & Success from Seerat-un-Nabi ﷺ"',
  compBadge: "Annual Knowledge Contest",
  compDesc: "Open across Intermediate, Graduate, and Postgraduate levels with separate divisions for Boys & Girls. 48 Distinguished Prizes will be distributed InshaAllah.",
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

// 48 Prize Allocation Roster Model
window.INITIAL_PRIZES = [
  { id: 1, rank: "1st Prize", category: "Postgraduate (Boys)", ht: "SUN3-B-PG-1001", name: "Mohammed Farhan", prize: "HP Core i5 Laptop + Trophy", icon: "laptop" },
  { id: 2, rank: "1st Prize", category: "Postgraduate (Girls)", ht: "SUN3-G-PG-2001", name: "Fatima Zehra", prize: "HP Core i5 Laptop + Trophy", icon: "laptop" },
  { id: 3, rank: "1st Prize", category: "Graduate (Boys)", ht: "SUN3-B-GRAD-1002", name: "Abdul Qadeer", prize: "HP Core i5 Laptop + Trophy", icon: "laptop" },
  { id: 4, rank: "1st Prize", category: "Graduate (Girls)", ht: "SUN3-G-GRAD-2002", name: "Ayesha Siddiqua", prize: "HP Core i5 Laptop + Trophy", icon: "laptop" },
  { id: 5, rank: "1st Prize", category: "Intermediate (Boys)", ht: "SUN3-B-INT-1003", name: "Syed Zaid Ahmed", prize: "HP Core i5 Laptop + Trophy", icon: "laptop" },
  { id: 6, rank: "1st Prize", category: "Intermediate (Girls)", ht: "SUN3-G-INT-2003", name: "Maryam Unnisa", prize: "HP Core i5 Laptop + Trophy", icon: "laptop" },
  { id: 7, rank: "2nd Prize", category: "Postgraduate (Boys)", ht: "SUN3-B-PG-1004", name: "Mirza Rehan Baig", prize: "Samsung Galaxy Tablet 10.4\"", icon: "tablet-screen-button" },
  { id: 8, rank: "2nd Prize", category: "Postgraduate (Girls)", ht: "SUN3-G-PG-2004", name: "Hafsa Begum", prize: "Samsung Galaxy Tablet 10.4\"", icon: "tablet-screen-button" },
  { id: 9, rank: "2nd Prize", category: "Graduate (Boys)", ht: "SUN3-B-GRAD-1005", name: "Salman Khan", prize: "Samsung Galaxy Tablet 10.4\"", icon: "tablet-screen-button" },
  { id: 10, rank: "2nd Prize", category: "Graduate (Girls)", ht: "SUN3-G-GRAD-2005", name: "Zainab Binte Tariq", prize: "Samsung Galaxy Tablet 10.4\"", icon: "tablet-screen-button" },
  { id: 11, rank: "2nd Prize", category: "Intermediate (Boys)", ht: "SUN3-B-INT-1006", name: "Ibrahim Patel", prize: "Samsung Galaxy Tablet 10.4\"", icon: "tablet-screen-button" },
  { id: 12, rank: "2nd Prize", category: "Intermediate (Girls)", ht: "SUN3-G-INT-2006", name: "Khadija Khan", prize: "Samsung Galaxy Tablet 10.4\"", icon: "tablet-screen-button" },
  { id: 13, rank: "3rd Prize", category: "Postgraduate (Boys)", ht: "SUN3-B-PG-1007", name: "Syed Bilal", prize: "Islamic Encyclopedia & Book Set", icon: "book-bookmark" },
  { id: 14, rank: "3rd Prize", category: "Postgraduate (Girls)", ht: "SUN3-G-PG-2007", name: "Sumaiya Anjum", prize: "Islamic Encyclopedia & Book Set", icon: "book-bookmark" },
  { id: 15, rank: "3rd Prize", category: "Graduate (Boys)", ht: "SUN3-B-GRAD-1008", name: "Omer Bin Khalid", prize: "Islamic Encyclopedia & Book Set", icon: "book-bookmark" },
  { id: 16, rank: "3rd Prize", category: "Graduate (Girls)", ht: "SUN3-G-GRAD-2008", name: "Arshia Noor", prize: "Islamic Encyclopedia & Book Set", icon: "book-bookmark" },
  { id: 17, rank: "3rd Prize", category: "Intermediate (Boys)", ht: "SUN3-B-INT-1009", name: "Ahmed Mohiuddin", prize: "Islamic Encyclopedia & Book Set", icon: "book-bookmark" },
  { id: 18, rank: "3rd Prize", category: "Intermediate (Girls)", ht: "SUN3-G-INT-2009", name: "Tahoor Fatima", prize: "Islamic Encyclopedia & Book Set", icon: "book-bookmark" }
];

// Append remaining consolation prizes up to 48
for (var i = 19; i <= 48; i++) {
  var isBoy = i % 2 !== 0;
  window.INITIAL_PRIZES.push({
    id: i,
    rank: "Consolation Prize #" + (i - 18),
    category: (i <= 28 ? "Intermediate" : i <= 38 ? "Graduate" : "Postgraduate") + (isBoy ? " (Boys)" : " (Girls)"),
    ht: (isBoy ? "SUN3-B-CON-" : "SUN3-G-CON-") + (1000 + i),
    name: isBoy ? "Participant " + i : "Candidate " + i,
    prize: "₹5,000 Cash Scholarship + Citation",
    icon: "money-bill-wave"
  });
}

// 500+ Words Comprehensive Seerat-un-Nabi ﷺ Text
window.SEERAT_COMPREHENSIVE_TEXT = {
  en: {
    title: "The Comprehensive Biography of Prophet Muhammad ﷺ",
    wordCount: "580+ Words | Academic Reference Guide",
    lineageHeader: "Prophetic Lineage & Holy Family (Ahl al-Bayt)",
    father: "Hazrat Abdullah ibn Abd al-Muttalib (Passed away before Prophet's birth)",
    mother: "Sayyida Aminah bint Wahb (Passed away at Al-Abwa when Prophet was 6)",
    grandfather: "Abd al-Muttalib (Chieftain of Banu Hashim)",
    uncle: "Abu Talib (Guardian and protector during early Islamic struggle)",
    wives: "Sayyida Khadijah bint Khuwaylid (first and most devoted companion), Sawdah bint Zam'ah, Aishah bint Abi Bakr, Hafsah bint Umar, Zaynab bint Khuzaymah, Umm Salamah (Hind bint Abi Umayyah), Zaynab bint Jahsh, Juwayriyah bint al-Harith, Umm Habibah (Ramlah bint Abi Sufyan), Safiyyah bint Huyayy, Maymunah bint al-Harith, and Mariyah al-Qibtiyyah (Ummahat-ul-Momineen, Razi Allahu Anhunna).",
    sons: "Al-Qasim (from whom he took the Kunya Abu al-Qasim), Abdullah (at-Tayyib/at-Tahir), and Ibrahim (born to Mariyah al-Qibtiyyah). All passed away in early childhood.",
    daughters: "Zaynab, Ruqayyah, Umm Kulthum, and Sayyida Fatimah az-Zahra (Leader of the women of Paradise, Razi Allahu Anhunna).",
    narrative: `The Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant (circa 570 CE) into the noble Qurayshi clan of Banu Hashim. Born as an orphan, he was fostered in the desert by Halimah as-Sa'diyyah, learning eloquence and resilience. His mother passed away when he was six years old, followed by his grandfather Abd al-Muttalib two years later, placing him under the protection of his uncle Abu Talib. Throughout his youth, he was revered by all of Makkah for his unmatched truthfulness, integrity, and fair dealing, earning the timeless honorifics "As-Sadiq" (The Truthful) and "Al-Amin" (The Trustworthy).

At the age of twenty-five, he married Sayyida Khadijah (R.A), a union built upon profound mutual respect and companionship. As he approached forty, he frequently retreated to the Cave of Hira on Mount Nur for contemplation. In the month of Ramadan, the Archangel Jibreel (Gabriel) descended with the initial revelation of the Holy Qur'an: "Recite in the name of your Lord who created" (Surah Al-Alaq). Sayyida Khadijah immediately affirmed his divine mission, becoming the very first person to embrace Islam.

The initial three years of Da'wah were conducted discreetly, followed by the public declaration atop Mount Safa. The polytheists of Makkah responded with severe persecution, social and economic boycotts in the valley of Shi'b Abi Talib, and torture of early converts like Bilal ibn Rabah and the family of Yasir. Despite the deaths of both Khadijah and Abu Talib in the "Year of Sorrow" and the harsh rejection at Ta'if, the Prophet remained steadfast, exemplified during the miraculous Night Journey and Heavenly Ascension (Al-Isra wal-Mi'raj).

In 622 CE, following divine command, the Prophet and his companions undertook the Hijrah (migration) to Yathrib (Madinah al-Munawwarah). In Madinah, he established the first Islamic state, formulated the historic Constitution of Madinah guaranteeing rights to all communities, and constructed the Prophet's Mosque. Over the subsequent decade, defensive encounters including the Battles of Badr, Uhud, and the Trench defended the community against existential threats. The Treaty of Hudaybiyyah in 6 AH paved the way for peaceful spread of Islam, culminating in the peaceful, bloodless Conquest of Makkah in 8 AH, where the Prophet granted general amnesty to his former persecutors.

In the tenth year of Hijrah, the Prophet performed the Farewell Pilgrimage (Hajjat al-Wada') and delivered his historic sermon atop Mount Arafat, establishing human equality, eradicating racism, upholding women's rights, and declaring the sanctity of life and property. On the 12th of Rabi' al-Awwal, 11 AH (632 CE), the Master of Creation ﷺ passed away in Madinah, leaving behind the Holy Qur'an and his Sunnah as eternal guidance for all humankind.`
  },
  ar: {
    title: "السيرة النبوية الشاملة للرسول المصطفى ﷺ",
    wordCount: "أكثر من ٥٠٠ كلمة | مرجع دراسي معتمد",
    lineageHeader: "النسب الشريف وآل البيت الكرام",
    father: "عبد الله بن عبد المطلب (توفي والرسول حمل)",
    mother: "السيدة آمنة بنت وهب (توفيت بالأبواء وعمره ست سنوات)",
    grandfather: "عبد المطلب (سيد قريش وبني هاشم)",
    uncle: "أبو طالب (كافله وناصره طوال بداية الدعوة)",
    wives: "خديجة بنت خويلد، سودة بنت زمعة، عائشة بنت أبي بكر، حفصة بنت عمر، زينب بنت خزيمة، أم سلمة (هند)، زينب بنت جحش، جويرية بنت الحارث، أم حبيبة (رملة)، صفية بنت حيي، ميمونة بنت الحارث، ومارية القبطية (أمهات المؤمنين رضي الله عنهن).",
    sons: "القاسم (وبه كني أبو القاسم)، عبد الله (الطيب الطاهر)، وإبراهيم (من مارية القبطية)، وتوفوا جميعاً صغاراً بحكمة بالغة.",
    daughters: "زينب، رقية، أم كلثوم، وسيدة نساء أهل الجنة فاطمة الزهراء (رضي الله عنهن).",
    narrative: `ولد نبي الرحمة محمد بن عبد الله ﷺ في مكة المكرمة في عام الفيل (حوالي ٥٧٠ م) من أشرف بطون قريش بني هاشم. نشأ يتيماً فرضع في بني سعد عند حليمة السعدية، فجمع فصاحة البادية ورزانة الأخلاق. توفيت أمه آمنة وهو في السادسة من عمره، ثم توفي جده عبد المطلب وهو في الثامنة فكفله عمه أبو طالب. عُرف ﷺ في شبابه بالصدق الفائق والأمانة المطلقة، فلقبته مكة بأسرها بـ «الصادق الأمين».

تزوج بالسيدة خديجة بنت خويلد رضي الله عنها وهو في الخامسة والعشرين. وحين قارب الأربعين، حُبب إليه الخلاء فكان يتعبد في غار حراء بجبل النور. وفي شهر رمضان المبارك، نزل عليه جبريل عليه السلام ببدء الوحي القرآني: {اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ}. فكانت خديجة أول من آمن من النساء، وعلي بن أبي طالب من الصبيان، وأبو بكر الصديق من الرجال.

استمرت الدعوة سراً ثلاث سنين، ثم جهر بها النبي ﷺ على جبل الصفا، فواجهت قريش دعوة التوحيد بالعذاب والمقاطعة الجائرة في شعب أبي طالب. ورغم اشتداد الأذى بعد وفاة خديجة وأبي طالب في «عام الحزن» وما لقيه في الطائف، أيده الله بالمعجزة الخالدة: الإسراء والمعراج.

في عام ٦٢٢ م، هاجر النبي ﷺ إلى المدينة المنورة فأسس أول دولة إسلامية متكاملة، وبنى المسجد النبوي، وآخى بين المهاجرين والأنصار، وكتب «وثيقة المدينة» كأول دستور مدني يؤصل للتعايش وحقوق الإنسان. خاض المسلمون بقيادته غزوات فاصلة للدفاع عن العقيدة كبدر وأحد والخندق. وفتح صلح الحديبية أبواب الفتح الأعظم لمكة في العام الثامن الهجري، حيث دخلها متواضعاً شاكراً لله، وأعلن العفو العام قائلاً: «اذهبوا فأنتم الطلقاء».

وفي السنة العاشرة للهجرة، أدى النبي ﷺ حجة الوداع وألقى خطبته الجامعة التي حرمت الدماء والأموال وأبطلت الفوارق العرقية والطبقية وأوصت بالنساء خيراً. وفي ١٢ ربيع الأول ١١ هـ، انتقل ﷺ إلى الرفيق الأعلى، تاركاً في أمته كتاب الله وسنته ما إن تمسكوا بهما لن يضلوا أبداً.`
  },
  ro: {
    title: "Mukammal Seerat-un-Nabi ﷺ (500+ Alfaaz)",
    wordCount: "500+ Words | Imtihan Ke Liye Mufeed Dastavez",
    lineageHeader: "Nabi Kareem ﷺ Ka Muqaddas Nasab Aur Ahl-e-Bait",
    father: "Hazrat Abdullah ibn Abdul Muttalib (Wiladat se pehle inteqal farmaya)",
    mother: "Hazrat Aminah bint Wahb (Aap ﷺ ki 6 saal ki umr me inteqal farmaya)",
    grandfather: "Hazrat Abdul Muttalib (Sardar-e-Quraysh)",
    uncle: "Hazrat Abu Talib (Aap ﷺ ke mushfiq chacha aur sarparast)",
    wives: "Hazrat Khadijah, Hazrat Sawdah, Hazrat Aishah Siddiqua, Hazrat Hafsah, Hazrat Zaynab bint Khuzaymah, Hazrat Umm Salamah, Hazrat Zaynab bint Jahsh, Hazrat Juwayriyah, Hazrat Umm Habibah, Hazrat Safiyyah, Hazrat Maymunah, aur Hazrat Mariyah Qibtiyyah (Ummahat-ul-Momineen R.A).",
    sons: "Hazrat Qasim, Hazrat Abdullah, aur Hazrat Ibrahim (R.A) - sabhi bachpan me inteqal farma gaye.",
    daughters: "Hazrat Zaynab, Hazrat Ruqayyah, Hazrat Umm Kulthum, aur Sayyida Fatimah az-Zahra (Razi Allahu Anhunna).",
    narrative: `Huzoor Aqdas Muhammad Mustafa ﷺ ki wiladat-e-ba-sa'adat Makkah Mukarrama me Aam-ul-Feel (570 CE) ke saal Banu Hashim ke qabeelay me hui. Wiladat se pehle hi walid-e-mohtaram Hazrat Abdullah ka inteqal ho chuka tha. Bachpan me Hazrat Halimah as-Sa'diyyah ne dehat ke shafaf mahol me parwarish ki. Chhey saal ki umr me walida Hazrat Aminah aur aath saal ki umr me dada Hazrat Abdul Muttalib ka saya uth gaya, jiske baad chacha Abu Talib ne hifazat farmayi. Jawani ke daur me poora Makkah Aap ﷺ ki sachai, amanatdari aur be-daagh kirdar ki wajah se "As-Sadiq" (Sachha) aur "Al-Amin" (Amanatdar) ke laqab se pukarta tha.

25 saal ki umr me Aap ﷺ ka nikah Hazrat Khadijah (R.A) se hua. 40 saal ki umr me Ghaar-e-Hira ke andar pehli wahi "Iqra bismi Rabbika alladhi khalaq" nazil hui. Teen saal tak khufiya dawat ke baad Koh-e-Safa se dawat-e-haq ka aam ailan farmaya. Mushrikeen-e-Makkah ne shadeed zulm, sheb-e-Abi Talib ka iqtisadi boycott aur qatl ki sazishein keen. "Aam-ul-Huzn" (Gham ke saal) aur Safar-e-Taif ke masayeb ke baad Allah Ta'ala ne Isra wal-Mi'raj ka shandar moajaza ata farmaya.

622 CE me hukm-e-Ilahi se Madinah Munawwarah Hijrat farmayi. Wahan pehli Islami Riyasat ki buniyaad rakhi, Masjid-e-Nabwi ki tameer hui, Muwakhat (bhai-chara) qayam farmaya aur Meesaq-e-Madinah tehreer hua. Ghazwa-e-Badr, Uhud aur Ahzab ke daur se guzarte hue 8 Hijri me baghair khoon-kharabay ke Fatah-e-Makkah hua, jahan dushmanon ko "La tasreeba alaykumul yawm" keh kar aam maafi ata farmayi.

10 Hijri me Hujjat-ul-Wada' ke moqa par tareekhi khutba irshad farmaya jisme rang-o-nasl ke imtiyaz ko khatam karke khawateen ke huqooq aur insaniyat ka aalmi manshoor ata kiya. 12 Rabi-ul-Awwal 11 Hijri ko Madinah Munawwarah me parda farmaya, aur ummat ke liye Quran Majeed aur Sunnat-e-Mutahhara ko hamesha ki hidayat chhor kar gaye.`
  }
};

window.INITIAL_PAPERS = [
  { id: 1, title: "1st Seerat Competition Question Paper (All Categories)", year: "2024", url: "#", category: "General" },
  { id: 2, title: "2nd Seerat Competition Model Paper & Answer Key", year: "2025", url: "#", category: "General" }
];

window.INITIAL_NOTICES = [
  { id: 1, title: "3rd Edition Live Registrations", date: "Official", desc: "Boys and Girls separate series enrollment is now open." },
  { id: 2, title: "48 Prize Packages Confirmed", date: "Awards", desc: "Laptops, Tablets, Book Sets and Scholarships allocated across all categories." },
  { id: 3, title: "Guest Speaker Announced", date: "Dignitaries", desc: "Janab Munavar Zama Sahab & Molana Hafiz Dr Ahsan Bin Mohammed Al Hamoomee Sahab will address the grand gathering." }
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
