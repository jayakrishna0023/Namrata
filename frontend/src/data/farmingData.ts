// farmingData.ts - Local groundings & localized UI labels

export interface MultilingualText {
  en: string;
  hi: string;
  ta: string;
}

export interface DiseaseEntry {
  id: string;
  crop: MultilingualText;
  names: MultilingualText;
  symptoms: MultilingualText;
  treatment: MultilingualText;
  prevention: MultilingualText;
}

export interface CropVariety {
  varieties: string;
  sowing_season: MultilingualText;
  organic_prep: MultilingualText;
}

export interface SoilSeedEntry {
  soil_name: MultilingualText;
  crops: Record<string, CropVariety>;
}

export interface FinancialSchemeEntry {
  name: MultilingualText;
  details: MultilingualText;
  eligibility: MultilingualText;
}

export const DISEASES: Record<string, DiseaseEntry> = {
  "rice_blast": {
    "id": "rice_blast",
    "crop": { "en": "Rice", "hi": "धान", "ta": "நெல்" },
    "names": { "en": "Rice Blast", "hi": "धान का झोंका रोग", "ta": "நெல் குலை நோய்" },
    "symptoms": {
      "en": "Spindle-shaped spots with gray or white centers and brown borders on leaves. Can affect nodes and neck of the panicle, causing them to break.",
      "hi": "पत्तियों पर भूरे या सफेद केंद्र और भूरे रंग के किनारों वाले तकली के आकार (spindle-shaped) के धब्बे। तने की गांठों और बालियों के आधार पर भी प्रभाव पड़ सकता है, जिससे वे टूट सकती हैं।",
      "ta": "இலைகளில் சாம்பல் அல்லது வெள்ளை மையப்பகுதியும், பழுப்பு நிற ஓரமும் கொண்ட கதிர் வடிவப் புள்ளிகள் தோன்றும். இது கதிர் கழுத்துப் பகுதியைத் தாக்கி உடைந்து விழச் செய்யும்."
    },
    "treatment": {
      "en": "1. Spray Sour Buttermilk solution: Mix 2 liters of fermented sour buttermilk with 100 liters of water and spray on one acre.\n2. Cow Urine Spray: Mix 1 part cow urine with 9 parts water and spray.\n3. Avoid excess nitrogen fertilizer (like urea) as it increases blast severity.",
      "hi": "1. खट्टी छाछ का घोल: 2 लीटर खट्टी छाछ को 100 लीटर पानी में मिलाकर एक एकड़ भूमि पर छिड़काव करें।\n2. गोमूत्र का छिड़काव: 1 हिस्सा गोमूत्र और 9 हिस्सा पानी मिलाकर फसल पर छिड़काव करें।\n3. अत्यधिक यूरिया (नाइट्रोजन) के प्रयोग से बचें, क्योंकि यह इस रोग को बढ़ावा देता है।",
      "ta": "1. புளித்த மோர் கரைசல்: 2 லிட்டர் புளித்த மோரை 100 லிட்டர் நீரில் கலந்து ஒரு ஏக்கருக்குத் தெளிக்கவும்.\n2. கோமியம் கரைசல்: 1 பங்கு கோமியத்துடன் 9 பங்கு நீர் கலந்து தெளிக்கவும்.\n3. அதிகப்படியான யூரியா (நைட்ரஜன்) பயன்பாட்டைத் தவிர்க்கவும், ஏனெனில் இது நோயை அதிகரிக்கும்."
    },
    "prevention": {
      "en": "Treat seeds with Bijamrita before sowing. Grow resistant varieties. Clean crop debris after harvest to prevent spores from surviving.",
      "hi": "बुवाई से पहले बीजों का बीजामृत से उपचार करें। रोग-प्रतिरोधी किस्में उगाएं। कटाई के बाद फसल के अवशेषों को साफ करें ताकि फंगस के बीजाणु जीवित न रहें।",
      "ta": "விதைப்பதற்கு முன் பீஜாமிர்தம் கொண்டு விதை நேர்த்தி செய்யவும். நோய் எதிர்ப்புத் திறன் கொண்ட ரகங்களை வளர்க்கவும். அறுவடைக்குப் பின் பயிர் எச்சங்களை அகற்றி சுத்தப்படுத்தவும்."
    }
  },
  "tomato_late_blight": {
    "id": "tomato_late_blight",
    "crop": { "en": "Tomato", "hi": "टमाटर", "ta": "தக்காளி" },
    "names": { "en": "Late Blight", "hi": "टमाटर का पछेती झुलसा रोग", "ta": "தக்காளியின் லேட் பிளைட் நோய்" },
    "symptoms": {
      "en": "Dark, water-soaked patches on leaves that turn brown and dry. White mold appears on the underside of leaves in humid conditions. Fruits develop dark, leathery spots.",
      "hi": "पत्तियों पर काले, पानी जैसे धब्बे जो बाद में भूरे और सूखे हो जाते हैं। नमी वाले मौसम में पत्तियों के नीचे सफेद फंगस दिखाई देती है। फलों पर गहरे, कड़े धब्बे बन जाते हैं।",
      "ta": "இலைகளில் இருண்ட, நீர் தேங்கியது போன்ற புள்ளிகள் தோன்றி, பழுப்பு நிறமாக மாறி உலர்ந்துவிடும். ஈரப்பதமான நிலையில் இலைகளின் அடிப்பகுதியில் வெள்ளை நிற பூஞ்சை தோன்றும். பழங்களில் இருண்ட தழும்புகள் ஏற்படும்."
    },
    "treatment": {
      "en": "1. Milk-Water Spray: Mix 1 part raw milk with 9 parts water and spray every 10 days. The protein in milk prevents fungal growth.\n2. Garlic-Ginger Extract: Grind 100g garlic and 100g ginger, mix in 10 liters of water, strain and spray.\n3. Copper-based organic solution: Use sour buttermilk fermented in a copper vessel for 5-7 days (copper-buttermilk mix).",
      "hi": "1. दूध-पानी का घोल: 1 हिस्सा कच्चा दूध और 9 हिस्सा पानी मिलाकर हर 10 दिन में छिड़काव करें। दूध का प्रोटीन फंगस को रोकता है।\n2. लहसुन-अदरक का अर्क: 100 ग्राम लहसुन and 100 ग्राम अदरक पीसकर 10 लीटर पानी में मिलाएं, छानकर स्प्रे करें।\n3. तांबा-छाछ का घोल: खट्टी छाछ को तांबे के बर्तन में 5-7 दिनों के लिए रखकर घोल तैयार करें और छिड़काव करें।",
      "ta": "1. பால்-நீர் கரைசல்: 1 பங்கு காய்ச்சாத பாலுடன் 9 பங்கு நீர் கலந்து 10 நாட்களுக்கு ஒருமுறை தெளிக்கவும். பாலில் உள்ள புரதம் பூஞ்சை வளர்ச்சியைத் தடுக்கும்.\n2. பூண்டு-இஞ்சி சாறு: 100 கிராம் பூண்டு மற்றும் 100 கிராம் இஞ்சியை அரைத்து, 10 லிட்டர் நீரில் கலந்து, வடிகட்டி தெளிக்கவும்.\n3. செம்பு-மோர் கரைசல்: செம்பு பாத்திரத்தில் 5-7 நாட்கள் புளிக்க வைக்கப்பட்ட மோரை நீரில் கலந்து தெளிக்கவும்."
    },
    "prevention": {
      "en": "Ensure proper spacing for air circulation. Avoid overhead watering (drip irrigation is preferred). Mulch the soil to prevent soil-borne spores from splashing onto leaves.",
      "hi": "हवा के संचार के लिए पौधों के बीच उचित दूरी सुनिश्चित करें। ऊपर से पानी छिड़कने से बचें (टपक सिंचाई बेहतर है)। मिट्टी में मल्चिंग करें ताकि फंगस के बीजाणु पत्तों पर न उछलें।",
      "ta": "காற்றோட்டத்திற்கு போதிய இடைவெளி விட்டு நடவு செய்யவும். இலைகளின் மேல் தண்ணீர் தெளிப்பதைத் தவிர்க்கவும் (சொட்டு நீர் பாசனம் சிறந்தது). இலைகளில் மண் தெறிப்பதைத் தடுக்க மூடாக்கு (Mulch) போடவும்."
    }
  },
  "groundnut_leaf_spot": {
    "id": "groundnut_leaf_spot",
    "crop": { "en": "Groundnut", "hi": "मूंगफली", "ta": "நிலக்கடலை" },
    "names": { "en": "Tikka Leaf Spot", "hi": "मूंगफली का टिक्का रोग", "ta": "நிலக்கடலை டிக்கா இலைப்புள்ளி நோய்" },
    "symptoms": {
      "en": "Circular dark brown to black spots on both sides of leaves. Yellow halo rings around the spots (Early Tikka) or no halo (Late Tikka). Causes premature leaf fall.",
      "hi": "पत्तियों के दोनों तरफ गोलाकार गहरे भूरे से काले रंग के धब्बे। धब्बों के चारों ओर पीले रंग का घेरा (अगेती टिक्का) या बिना घेरा (पछेती टिक्का)। पत्तियां समय से पहले गिरने लगती हैं।",
      "ta": "இலைகளின் இருபுறமும் வட்டமான அடர் பழுப்பு முதல் கருப்பு நிறப் புள்ளிகள் தோன்றும். புள்ளிகளைச் சுற்றி மஞ்சள் வளையம் காணப்படும். இலைகள் முன்கூட்டியே உதிர்ந்துவிடும்."
    },
    "treatment": {
      "en": "1. Neemastra Spray: Mix 5 liters of Neemastra (prepared from neem leaves, cow urine, and cow dung) in 100 liters of water and spray.\n2. Sour Buttermilk and Hing (Asafoetida): Add 10g Hing powder to 5 liters of sour buttermilk, mix with 100 liters of water and spray.",
      "hi": "1. नीमास्त्र का छिड़काव: 5 लीटर नीमास्त्र (नीम की पत्तियों, गोमूत्र और गोबर से निर्मित) को 100 लीटर पानी में मिलाकर छिड़काव करें।\n2. खट्टी छाछ और हींग का घोल: 5 लीटर खट्टी छाछ में 10 ग्राम हींग पाउडर मिलाएं, फिर इसे 100 लीटर पानी में मिलाकर छिड़काव करें।",
      "ta": "1. வேப்பங்கரைசல் (நீமாஸ்திரம்) தெளிப்பு: 5 லிட்டர் நீமாஸ்திரத்தை 100 லிட்டர் நீரில் கலந்து தெளிக்கவும்.\n2. புளித்த மோர் மற்றும் பெருங்காயக் கரைசல்: 5 லிட்டர் புளித்த மோரில் 10 கிராம் பெருங்காயத் தூள் சேர்த்து, 100 லிட்டர் நீரில் கலந்து தெளிக்கவும்."
    },
    "prevention": {
      "en": "Follow crop rotation with cereals like Pearl Millet (Bajra) or Sorghum. Apply organic compost rich in Trichoderma viride to the soil.",
      "hi": "बाजरा या ज्वार जैसे अनाजों के साथ फसल चक्र (crop rotation) अपनाएं। मिट्टी में ट्राइकोडर्मा विरिडी से समृद्ध जैविक खाद का प्रयोग करें।",
      "ta": "கம்பு அல்லது சோளம் போன்ற பயிர்களுடன் பயிர் சுழற்சி முறையைப் பின்பற்றவும். மண்ணில் டிரைக்கோடெர்மா விரிடி கலந்த மக்கிய தொழு உரத்தை இடவும்."
    }
  }
};

export const SEED_SELECTION: Record<string, SoilSeedEntry> = {
  "alluvial": {
    "soil_name": { "en": "Alluvial Soil (Loamy / Clayey)", "hi": "जलोढ़ मिट्टी (दोमट / चिकनी मिट्टी)", "ta": "வண்டல் மண் (வண்டல் / களிமண்)" },
    "crops": {
      "Rice": {
        "varieties": "Jaya, Basmati 370, CR Dhan 310, Ponni (South)",
        "sowing_season": { "en": "Kharif (June - July)", "hi": "खरीफ (जून - जुलाई)", "ta": "காரிஃப் (ஜூன் - ஜூலை)" },
        "organic_prep": {
          "en": "Soak seeds in Bijamrita solution for 24 hours. Air dry in shade before sowing.",
          "hi": "बीजों को 24 घंटे के लिए बीजामृत घोल में भिगोएं। बुवाई से पहले छाया में सुखा लें।",
          "ta": "விதைகளை பீஜாமிர்தக் கரைசலில் 24 மணி நேரம் ஊறவைக்கவும். விதைப்பதற்கு முன் நிழலில் உலர்த்தவும்."
        }
      },
      "Wheat": {
        "varieties": "HD 2967, PBW 343, Shriram Super 303",
        "sowing_season": { "en": "Rabi (October - November)", "hi": "रबी (अक्टूबर - नवंबर)", "ta": "ரபி (அக்டோபர் - நவம்பர்)" },
        "organic_prep": {
          "en": "Mix seeds gently with Bijamrita. Prevents soil-borne fungal rots during germination.",
          "hi": "बीजों को बीजामृत के साथ हल्के हाथ से मिलाएं। अंकुरण के समय मिट्टी से होने वाले फंगल सड़न को रोकता है।",
          "ta": "விதைகளை பீஜாமிர்தத்துடன் மெதுவாகக் கலக்கவும். இது முளைக்கும் போது மண்ணில் தோன்றும் பூஞ்சை அழுகலைத் தடுக்கும்."
        }
      }
    }
  },
  "black": {
    "soil_name": { "en": "Black Cotton Soil", "hi": "काली मिट्टी (कपास मिट्टी)", "ta": "கரிசல் மண் (பருத்தி மண்)" },
    "crops": {
      "Cotton": {
        "varieties": "MCU 5, Bunny, Jayadhar",
        "sowing_season": { "en": "Kharif (May - June)", "hi": "खरीफ (मई - जून)", "ta": "காரிஃப் (மே - ஜூன்)" },
        "organic_prep": {
          "en": "Rub seeds with cow dung slurry and ash mixture to remove lint and protect seeds from pests.",
          "hi": "बीजों को गोबर के घोल और राख के मिश्रण से रगड़ें ताकि रूई हट जाए और बीजों की कीटों से सुरक्षा हो सके।",
          "ta": "விதை பஞ்சை நீக்கவும், பூச்சிகளிடமிருந்து பாதுகாக்கவும் பசு சாணம் மற்றும் சாம்பல் கலவையைக் கொண்டு விதைகளைத் தேய்க்கவும்."
        }
      },
      "Soybean": {
        "varieties": "JS 335, JS 95-60, NRC 37",
        "sowing_season": { "en": "Kharif (June - July)", "hi": "खरीफ (जून - जुलाई)", "ta": "காரிஃப் (ஜூன் - ஜூலை)" },
        "organic_prep": {
          "en": "Treat seeds with Rhizobium culture mixed in jaggery water, followed by Trichoderma viride.",
          "hi": "गुड़ के पानी में मिले राइजोबियम कल्चर से बीजों का उपचार करें, फिर ट्राइकोडर्मा विरिडी लगाएं।",
          "ta": "வெல்ல நீரில் கலந்த ரைசோபியம் கல்ச்சர் மற்றும் டிரைக்கோடெர்மா விரிடி கொண்டு விதை நேர்த்தி செய்யவும்."
        }
      }
    }
  },
  "red": {
    "soil_name": { "en": "Red Sandy / Loamy Soil", "hi": "लाल बलुई / दोमट मिट्टी", "ta": "செம்மண் (மணல் / வண்டல்)" },
    "crops": {
      "Groundnut": {
        "varieties": "Kadiri-6, G-2, TMV-2, JL-24",
        "sowing_season": { "en": "Kharif (June - July) / Rabi (Nov - Dec in south)", "hi": "खरीफ (जून - जुलाई) / रबी (नवंबर - दिसंबर दक्षिण में)", "ta": "காரிஃப் (ஜூன் - ஜூலை) / ரபி (நவம்பர் - டிசம்பர் தென்னிந்தியாவில்)" },
        "organic_prep": {
          "en": "Treat seed kernels with Trichoderma powder (10g/kg of seed) to prevent root rot.",
          "hi": "जड़ सड़न रोकने के लिए बीज गिरी को ट्राइकोडर्मा पाउडर (10 ग्राम प्रति किलोग्राम बीज) से उपचारित करें।",
          "ta": "வேரழுகல் நோயைத் தடுக்க நிலக்கடலை பருப்புகளை டிரைக்கோடெர்மா பொடி (10கி/கிலோ விதை) கொண்டு நேர்த்தி செய்யவும்."
        }
      }
    }
  }
};

export const FINANCIAL_SCHEMES: FinancialSchemeEntry[] = [
  {
    "name": {
      "en": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      "hi": "पीएम-किसान योजना (PM-KISAN)",
      "ta": "பிஎம்-கிசான் திட்டம் (PM-KISAN)"
    },
    "details": {
      "en": "Rs. 6,000 per year is provided in three equal installments of Rs. 2,000 directly into the bank accounts of small and marginal farmers.",
      "hi": "लघु और सीमांत किसानों के बैंक खातों में सीधे तीन समान किश्तों में प्रति वर्ष 6,000 रुपये (2,000 रुपये की किस्त) प्रदान किए जाते हैं।",
      "ta": "சிறு மற்றும் குறு விவசாயிகளின் வங்கி கணக்குகளில் ஆண்டுக்கு ரூ. 6,000 மூன்று தவணைகளாக (ரூ. 2,000 வீதம்) நேரடியாக செலுத்தப்படுகிறது."
    },
    "eligibility": {
      "en": "Landholder farmer families with cultivable land in their names.",
      "hi": "कृषि योग्य भूमि वाले किसान परिवार जिनके नाम पर जमीन दर्ज है।",
      "ta": "தங்கள் பெயரில் விவசாய நிலம் வைத்துள்ள விவசாய குடும்பங்கள்."
    }
  },
  {
    "name": {
      "en": "PKVY (Paramparagat Krishi Vikas Yojana)",
      "hi": "परम्परागत कृषि विकास योजना (PKVY)",
      "ta": "பரம்பராகத் கிருஷி விகாஸ் யோஜனா (PKVY)"
    },
    "details": {
      "en": "Financial assistance of Rs. 50,000 per hectare for 3 years is provided for organic farming, including biological fertilizers, seeds, and organic certifications.",
      "hi": "जैविक खेती के लिए 3 वर्षों तक 50,000 रुपये प्रति हेक्टेयर की वित्तीय सहायता प्रदान की जाती है, जिसमें जैविक खाद, बीज और जैविक प्रमाणीकरण (organic certification) शामिल हैं।",
      "ta": "இயற்கை விவசாயத்தை ஊக்குவிக்க ஹெக்டேருக்கு ரூ. 50,000 வீதம் 3 ஆண்டுகளுக்கு நிதி உதவி வழங்கப்படுகிறது (உயிர் உரங்கள், விதைகள் மற்றும் சான்றளிப்பு உட்பட)."
    },
    "eligibility": {
      "en": "Farmers practicing cluster-based organic farming (minimum 20 hectares cluster size).",
      "hi": "क्लस्टर-आधारित जैविक खेती करने वाले किसान (न्यूनतम 20 हेक्टेयर क्लस्टर आकार)।",
      "ta": "குழு அடிப்படையிலான இயற்கை விவசாயம் செய்யும் விவசாயிகள் (குறைந்தபட்சம் 20 ஹெக்டேர் குழு அளவு)."
    }
  }
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  "en": {
    "title": "Namrata",
    "subtitle": "Voice-Based Multilingual Natural Farming Consultant",
    "tagline": "Empowering farmers with instant, organic, and practical farming advice in English, Hindi, and Tamil.",
    "onboarding_title": "How Namrata can help you today",
    "card1_title": "🌱 Disease Treatment",
    "card1_desc": "Identify crop diseases and get step-by-step organic remedies (like Jivamrita, Neemastra).",
    "card2_title": "🌾 Seed & Soil Guidance",
    "card2_desc": "Get seed variety recommendations matched to your soil type and sowing season.",
    "card3_title": "💰 Financial & Subsidies",
    "card3_desc": "Learn about PM-KISAN, PKVY organic farming subsidies, and insurance schemes.",
    "quick_prompts": "Quick Actions (Click to ask)",
    "prompt1": "My crop leaves are turning yellow and have brown spots",
    "prompt2": "Which seeds are best for black soil in Kharif season?",
    "prompt3": "How do I prepare Jivamrita bio-fertilizer naturally?",
    "prompt4": "What financial help can I get for natural farming?",
    "input_placeholder": "e.g., How do I control pests in tomato naturally?",
    "btn_ask": "Send Question",
    "sidebar_history": "Saved Queries & Bookmarks",
    "sidebar_history_title": "History",
    "sidebar_bookmarks_title": "Bookmarks",
    "no_history": "No saved queries yet.",
    "no_bookmarks": "No bookmarked items yet.",
    "response_title": "Namrata's Organic Advice",
    "speak_btn": "Speak Advice",
    "stop_btn": "Stop Voice",
    "copy_btn": "Copy Text",
    "bookmark_btn": "Bookmark",
    "copied_alert": "Copied to clipboard!",
    "bookmarked_alert": "Added to bookmarks!",
    "removed_bookmark_alert": "Removed from bookmarks!",
    "loading_msg": "Namrata is analyzing your query...",
    "empty_state_header": "Welcome to Namrata!",
    "empty_state_desc": "Ask a question by speaking into the microphone or typing in the box. Select your language at the top.",
    "footer": "Developed with love for sustainable farming. 🌾 💚",
    "setting_title": "Voice Assistant Settings",
    "api_key_help": "Select a voice from the list of text-to-speech models installed on your browser for the selected language.",
    "btn_save": "Apply Voice Settings",
    "search_db_placeholder": "Search diseases or crops...",
    "soil_label": "Select Soil Type",
    "soil_alluvial": "Alluvial (Loamy / Clayey)",
    "soil_black": "Black Cotton Soil",
    "soil_red": "Red Sandy / Loamy Soil",
    "btn_filter_seeds": "Get Varieties",
    "status_idle": "Tap the Orb or speak to start",
    "status_listening": "Listening... speak now",
    "status_thinking": "Thinking... analyzing query",
    "status_speaking": "Namrata is speaking...",
    "auto_speak_label": "Auto-Speak Responses",
    "voice_select_label": "Choose Assistant Voice (Different Voice)"
  },
  "hi": {
    "title": "नम्रता",
    "subtitle": "आवाज-आधारित बहुभाषी प्राकृतिक खेती सलाहकार",
    "tagline": "अंग्रेजी, हिंदी और तमिल में किसानों को त्वरित, जैविक और व्यावहारिक खेती की सलाह देकर सशक्त बनाना।",
    "onboarding_title": "नम्रता आज आपकी कैसे मदद कर सकती है",
    "card1_title": "🌱 रोग उपचार",
    "card1_desc": "फसल के रोगों की पहचान करें और चरण-दर-चरण जैविक उपचार (जैसे जीवामृत, नीमास्त्र) प्राप्त करें।",
    "card2_title": "🌾 बीज और मिट्टी मार्गदर्शन",
    "card2_desc": "अपनी मिट्टी के प्रकार और बुवाई के मौसम के अनुसार बीज किस्मों की सिफारिशें प्राप्त करें।",
    "card3_title": "💰 वित्तीय और सब्सिडी",
    "card3_desc": "पीएम-किसान, पीकेवीवाई जैविक खेती सब्सिडी और फसल बीमा योजनाओं के बारे में जानें।",
    "quick_prompts": "त्वरित प्रश्न",
    "prompt1": "मेरी फसल के पत्ते पीले पड़ रहे हैं और उन पर भूरे रंग के धब्बे हैं",
    "prompt2": "खरीफ मौसम में काली मिट्टी के लिए कौन से बीज सबसे अच्छे हैं?",
    "prompt3": "मैं प्राकृतिक रूप से जीवामृत जैविक खाद कैसे तैयार करूं?",
    "prompt4": "प्राकृतिक खेती के लिए मुझे क्या सरकारी वित्तीय मदद मिल सकती है?",
    "input_placeholder": "जैसे, टमाटर में कीड़ों को प्राकृतिक रूप से कैसे रोकें?",
    "btn_ask": "सवाल भेजें",
    "sidebar_history": "सहेजे गए प्रश्न और बुकमार्क",
    "sidebar_history_title": "इतिहास",
    "sidebar_bookmarks_title": "बुकमार्क",
    "no_history": "अभी तक कोई सहेजा गया प्रश्न नहीं है।",
    "no_bookmarks": "अभी तक कोई बुकमार्क नहीं है।",
    "response_title": "नम्रता की जैविक सलाह",
    "speak_btn": "सलाह सुनें",
    "stop_btn": "आवाज बंद करें",
    "copy_btn": "कॉपी करें",
    "bookmark_btn": "बुकमार्क करें",
    "copied_alert": "क्लिपबोर्ड पर कॉपी किया गया!",
    "bookmarked_alert": "बुकमार्क में जोड़ा गया!",
    "removed_bookmark_alert": "बुकमार्क से हटाया गया!",
    "loading_msg": "नम्रता आपके प्रश्न का विश्लेषण कर रही है...",
    "empty_state_header": "नम्रता में आपका स्वागत है!",
    "empty_state_desc": "माइक्रोफोन में बोलकर या बॉक्स में टाइप करके सवाल पूछें। सबसे ऊपर अपनी पसंदीदा भाषा चुनें।",
    "footer": "सतत खेती के प्रति समर्पित। 🌾 💚",
    "setting_title": "आवाज सहायक सेटिंग्स",
    "api_key_help": "अपने ब्राउज़र में सहेजे गए आवाज़ मॉडलों में से पसंदीदा सहायक आवाज़ चुनें।",
    "btn_save": "आवाज लागू करें",
    "search_db_placeholder": "रोगों या फसलों की खोज करें...",
    "soil_label": "मिट्टी का प्रकार चुनें",
    "soil_alluvial": "जलोढ़ मिट्टी (दोमट/चिकनी)",
    "soil_black": "काली कपास मिट्टी",
    "soil_red": "लाल रेतीली/दोमट मिट्टी",
    "btn_filter_seeds": "किस्में प्राप्त करें",
    "status_idle": "बोलने के लिए ऑर्ब को दबाएं या बात करें",
    "status_listening": "सुन रहा हूँ... बोलिए",
    "status_thinking": "सोच रहा हूँ... विश्लेषण जारी है",
    "status_speaking": "नम्रता सलाह पढ़ रही हैं...",
    "auto_speak_label": "स्वचालित आवाज उत्तर",
    "voice_select_label": "सहायक आवाज़ चुनें (अलग आवाज़)"
  },
  "ta": {
    "title": "நம்ரதா",
    "subtitle": "குரல் வழி பன்மொழி இயற்கை விவசாய ஆலோசகர்",
    "tagline": "விவசாயிகளுக்கு ஆங்கிலம், இந்தி மற்றும் தமிழில் உடனடி, கரிம மற்றும் நடைமுறை விவசாய ஆலோசனைகளை வழங்குதல்.",
    "onboarding_title": "நம்ரதா இன்று உங்களுக்கு எவ்வாறு உதவ முடியும்",
    "card1_title": "🌱 நோய் கட்டுப்பாடு",
    "card1_desc": "பயிர் நோய்களைக் கண்டறிந்து, படி படியான இயற்கை வைத்தியம் (ஜீவாமிர்தம், நீமாஸ்திரம் போன்றவை) பெறலாம்.",
    "card2_title": "🌾 விதை & மண் வழிகாட்டி",
    "card2_desc": "உங்கள் மண்ணின் வகை மற்றும் விதைப்பு காலத்திற்கு ஏற்ற சிறந்த விதை ரகங்களைப் பெறுங்கள்.",
    "card3_title": "💰 மானியம் & நிதியுதவி",
    "card3_desc": "பிஎம்-கிசான், இயற்கை விவசாய மானியங்கள் (PKVY) மற்றும் காப்பீட்டுத் திட்டங்களைப் பற்றி அறிந்து கொள்ளுங்கள்.",
    "quick_prompts": "விரைவான கேள்விகள்",
    "prompt1": "என் பயிர் இலைகள் மஞ்சள் நிறமாக மாறி பழுப்பு நிற புள்ளிகள் உள்ளன",
    "prompt2": "காரிஃப் பருவத்தில் கரிசல் மண்ணுக்கு எந்த விதைகள் சிறந்தது?",
    "prompt3": "ஜீவாமிர்தம் உயிர் உரத்தை இயற்கையாக தயாரிப்பது எப்படி?",
    "prompt4": "இயற்கை விவசாயத்திற்கு நான் என்ன அரசாங்க நிதி உதவி பெற முடியும்?",
    "input_placeholder": "உதாரணம்: தக்காளியில் பூச்சிகளை இயற்கையாகக் கட்டுப்படுத்துவது எப்படி?",
    "btn_ask": "கேள்வியைக் கேள்",
    "sidebar_history": "கேள்விகள் & புக்மார்க்குகள்",
    "sidebar_history_title": "வரலாறு",
    "sidebar_bookmarks_title": "புக்மார்க்குகள்",
    "no_history": "வரலாறு எதுவும் இல்லை.",
    "no_bookmarks": "புக்மார்க்குகள் எதுவும் இல்லை.",
    "response_title": "நம்ரதாவின் இயற்கை ஆலோசனை",
    "speak_btn": "பதிலைக் கேள்",
    "stop_btn": "ஒலியை நிறுத்து",
    "copy_btn": "நகலெடு",
    "bookmark_btn": "புக்மார்க்",
    "copied_alert": "நகலெடுக்கப்பட்டது!",
    "bookmarked_alert": "புக்மார்க்கில் சேர்க்கப்பட்டது!",
    "removed_bookmark_alert": "புக்மார்க்கில் இருந்து நீக்கப்பட்டது!",
    "loading_msg": "நம்ரதா உங்கள் கேள்வியைக் கேட்கிறது...",
    "empty_state_header": "நம்ரதாவிற்கு உங்களை வரவேற்கிறோம்!",
    "empty_state_desc": "ஒலிவாங்கியில் பேசுவதன் மூலம் அல்லது பெட்டியில் தட்டச்சு செய்வதன் மூலம் உங்கள் கேள்வியைக் கேளுங்கள். மேலே மொழியைத் தேர்ந்தெடுக்கவும்.",
    "footer": "நிலையான விவசாயத்திற்கான அர்ப்பணிப்புடன் உருவாக்கப்பட்டது. 🌾 💚",
    "setting_title": "குரல் உதவி அமைப்புகள்",
    "api_key_help": "உலாவி குரல் மாதிரிகளில் இருந்து உங்களுக்கு தேவையான குரல் உச்சரிப்பை தேர்வு செய்யவும்.",
    "btn_save": "குரலை சேமி",
    "search_db_placeholder": "பயிர் அல்லது நோயைத் தேடுக...",
    "soil_label": "மண் வகையைத் தேர்ந்தெடுக்கவும்",
    "soil_alluvial": "வண்டல் மண் (களிமண்)",
    "soil_black": "கரிசல் மண் (பருத்தி மண்)",
    "soil_red": "செம்மண் (மணல் / வண்டல்)",
    "btn_filter_seeds": "விதை ரகங்கள் பெறுக",
    "status_idle": "ஒலிவாங்கியைத் தட்டவும் அல்லது பேசவும்",
    "status_listening": "கேட்கிறது... பேசுங்கள்",
    "status_thinking": "ஆராய்கிறது... பதில் தயாரிப்பிலுள்ளது",
    "status_speaking": "நம்ரதா ஆலோசனை வழங்குகிறது...",
    "auto_speak_label": "தானியங்கி குரல் பதில்",
    "voice_select_label": "உதவி குரல் தேர்வு (மாற்று குரல்)"
  }
};
