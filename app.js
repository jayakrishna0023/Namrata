// app.js - Advanced Google Material & GSAP Voice Assistant (Secure Client-Server Version)

// ----------------- LOCAL KNOWLEDGE BASE (FALLBACK DATABASE) -----------------
const DISEASES = {
    "rice_blast": {
        "id": "rice_blast",
        "crop": { "en": "Rice", "hi": "धान", "ta": "நெல்" },
        "names": { "en": "Rice Blast", "hi": "धान का झोंका रोग", "ta": "நெல் कुலை நோய்" },
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
            "hi": "1. दूध-पानी का घोल: 1 हिस्सा कच्चा दूध और 9 हिस्सा पानी मिलाकर हर 10 दिन में छिड़काव करें। दूध का प्रोटीन फंगस को रोकता है।\n2. लहसुन-अदरक का अर्क: 100 ग्राम लहसुन और 100 ग्राम अदरक पीसकर 10 लीटर पानी में मिलाएं, छानकर स्प्रे करें।\n3. तांबा-छाछ का घोल: खट्टी छाछ को तांबे के बर्तन में 5-7 दिनों के लिए रखकर घोल तैयार करें और छिड़काव करें।",
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

const SEED_SELECTION = {
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

const FINANCIAL_SCHEMES = [
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

// ----------------- UI TRANSLATIONS -----------------
const TRANSLATIONS = {
    "en": {
        "title": "Vriksha",
        "subtitle": "Voice-Based Multilingual Natural Farming Consultant",
        "tagline": "Empowering farmers with instant, organic, and practical farming advice in English, Hindi, and Tamil.",
        "lang_label": "Select Language",
        "onboarding_title": "How Vriksha can help you today",
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
        "input_label": "Ask your farming question (Type or use the Microphone):",
        "input_placeholder": "e.g., How do I control pests in tomato naturally?",
        "btn_ask": "Send Question",
        "sidebar_history": "Saved Queries & Bookmarks",
        "sidebar_history_title": "History",
        "sidebar_bookmarks_title": "Bookmarks",
        "no_history": "No saved queries yet.",
        "no_bookmarks": "No bookmarked items yet.",
        "response_title": "Vriksha's Organic Advice",
        "speak_btn": "Speak Advice",
        "stop_btn": "Stop Voice",
        "copy_btn": "Copy Text",
        "bookmark_btn": "Bookmark",
        "copied_alert": "Copied to clipboard!",
        "bookmarked_alert": "Added to bookmarks!",
        "removed_bookmark_alert": "Removed from bookmarks!",
        "loading_msg": "Vriksha is analyzing your query...",
        "empty_state_header": "Welcome to Vriksha!",
        "empty_state_desc": "Ask a question by speaking into the microphone or typing in the box. Select your language at the top.",
        "footer": "Developed with love for sustainable farming. 🌾 💚",
        "setting_title": "Voice Assistant Settings",
        "api_key_placeholder": "",
        "api_key_help": "Select a voice from the list of text-to-speech models installed on your browser for the selected language.",
        "btn_save": "Apply Voice Settings",
        "btn_close": "Close",
        "search_db_placeholder": "Search diseases or crops...",
        "soil_label": "Select Soil Type",
        "soil_alluvial": "Alluvial (Loamy / Clayey)",
        "soil_black": "Black Cotton Soil",
        "soil_red": "Red Sandy / Loamy Soil",
        "btn_filter_seeds": "Get Varieties",
        "offline_note": "*(Running in local database mode. Set Groq key in server .env to activate conversational AI)*",
        "status_idle": "Tap the Orb or speak to start",
        "status_listening": "Listening... speak now",
        "status_thinking": "Thinking... analyzing query",
        "status_speaking": "Vriksha is speaking...",
        "auto_speak_label": "Auto-Speak Responses",
        "voice_select_label": "Choose Assistant Voice (Different Voice)"
    },
    "hi": {
        "title": "वृक्ष",
        "subtitle": "आवाज-आधारित बहुभाषी प्राकृतिक खेती सलाहकार",
        "tagline": "अंग्रेजी, हिंदी और तमिल में किसानों को त्वरित, जैविक और व्यावहारिक खेती की सलाह देकर सशक्त बनाना।",
        "lang_label": "भाषा चुनें",
        "onboarding_title": "वृक्ष आज आपकी कैसे मदद कर सकता है",
        "card1_title": "🌱 रोग उपचार",
        "card1_desc": "फसल के रोगों की पहचान करें और चरण-दर-चरण जैविक उपचार (जैसे जीवामृत, नीमास्त्र) प्राप्त करें।",
        "card2_title": "🌾 बीज और मिट्टी मार्गदर्शन",
        "card2_desc": "अपनी मिट्टी के प्रकार और बुवाई के मौसम के अनुसार बीज किस्मों की सिफारिशें प्राप्त करें।",
        "card3_title": "💰 वित्तीय और सब्सिडी",
        "card3_desc": "पीएम-किसान, पीकेवीवाई जैविक खेती सब्सिडी और फसल बीमा योजनाओं के बारे में जानें।",
        "quick_prompts": "त्वरित प्रश्न (पूछने के लिए क्लिक करें)",
        "prompt1": "मेरी फसल के पत्ते पीले पड़ रहे हैं और उन पर भूरे रंग के धब्बे हैं",
        "prompt2": "खरीफ मौसम में काली मिट्टी के लिए कौन से बीज सबसे अच्छे हैं?",
        "prompt3": "मैं प्राकृतिक रूप से जीवामृत जैविक खाद कैसे तैयार करूं?",
        "prompt4": "प्राकृतिक खेती के लिए मुझे क्या सरकारी वित्तीय मदद मिल सकती है?",
        "input_label": "अपना खेती का सवाल पूछें (टाइप करें या माइक्रोफोन का उपयोग करें):",
        "input_placeholder": "जैसे, टमाटर में कीड़ों को प्राकृतिक रूप से कैसे रोकें?",
        "btn_ask": "सवाल भेजें",
        "sidebar_history": "सहेजे गए प्रश्न और बुकमार्क",
        "sidebar_history_title": "इतिहास",
        "sidebar_bookmarks_title": "बुकमार्क",
        "no_history": "अभी तक कोई सहेजा गया प्रश्न नहीं है।",
        "no_bookmarks": "अभी तक कोई बुकमार्क नहीं है।",
        "response_title": "वृक्ष की जैविक सलाह",
        "speak_btn": "सलाह सुनें",
        "stop_btn": "आवाज बंद करें",
        "copy_btn": "कॉपी करें",
        "bookmark_btn": "बुकमार्क करें",
        "copied_alert": "क्लिपबोर्ड पर कॉपी किया गया!",
        "bookmarked_alert": "बुकमार्क में जोड़ा गया!",
        "removed_bookmark_alert": "बुकमार्क से हटाया गया!",
        "loading_msg": "वृक्ष आपके प्रश्न का विश्लेषण कर रहे हैं...",
        "empty_state_header": "वृक्ष में आपका स्वागत है!",
        "empty_state_desc": "माइक्रोफोन में बोलकर या बॉक्स में टाइप करके सवाल पूछें। सबसे ऊपर अपनी पसंदीदा भाषा चुनें।",
        "footer": "सतत खेती के प्रति समर्पित। 🌾 💚",
        "setting_title": "आवाज सहायक सेटिंग्स",
        "api_key_placeholder": "",
        "api_key_help": "अपने ब्राउज़र में सहेजे गए आवाज़ मॉडलों में से पसंदीदा सहायक आवाज़ चुनें।",
        "btn_save": "आवाज लागू करें",
        "btn_close": "बंद करें",
        "search_db_placeholder": "रोगों या फसलों की खोज करें...",
        "soil_label": "मिट्टी का प्रकार चुनें",
        "soil_alluvial": "जलोढ़ मिट्टी (दोमट/चिकनी)",
        "soil_black": "काली कपास मिट्टी",
        "soil_red": "लाल रेतीली/दोमट मिट्टी",
        "btn_filter_seeds": "किस्में प्राप्त करें",
        "offline_note": "*(लोकल डेटाबेस मोड। संवादात्मक AI अनलॉक करने के लिए सर्वर .env में Groq कुंजी दर्ज करें)*",
        "status_idle": "बोलने के लिए ऑर्ब को दबाएं या बात करें",
        "status_listening": "सुन रहा हूँ... बोलिए",
        "status_thinking": "सोच रहा हूँ... विश्लेषण जारी है",
        "status_speaking": "वृक्ष सलाह पढ़ रहे हैं...",
        "auto_speak_label": "स्वचालित आवाज उत्तर",
        "voice_select_label": "सहायक आवाज़ चुनें (अलग आवाज़)"
    },
    "ta": {
        "title": "விருக்ஷா",
        "subtitle": "குரல் வழி பன்மொழி இயற்கை விவசாய ஆலோசகர்",
        "tagline": "விவசாயிகளுக்கு ஆங்கிலம், இந்தி மற்றும் தமிழில் உடனடி, கரிம மற்றும் நடைமுறை விவசாய ஆலோசனைகளை வழங்குதல்.",
        "lang_label": "மொழி தேர்வு",
        "onboarding_title": "விருக்ஷா இன்று உங்களுக்கு எவ்வாறு உதவ முடியும்",
        "card1_title": "🌱 நோய் கட்டுப்பாடு",
        "card1_desc": "பயிர் நோய்களைக் கண்டறிந்து, படி படியான இயற்கை வைத்தியம் (ஜீவாமிர்தம், நீமாஸ்திரம் போன்றவை) பெறலாம்.",
        "card2_title": "🌾 விதை & மண் வழிகாட்டி",
        "card2_desc": "உங்கள் மண்ணின் வகை மற்றும் விதைப்பு காலத்திற்கு ஏற்ற சிறந்த விதை ரகங்களைப் பெறுங்கள்.",
        "card3_title": "💰 மானியம் & நிதியுதவி",
        "card3_desc": "பிஎம்-கிசான், இயற்கை விவசாய மானியங்கள் (PKVY) மற்றும் காப்பீட்டுத் திட்டங்களைப் பற்றி அறிந்து கொள்ளுங்கள்.",
        "quick_prompts": "விரைவான கேள்விகள் (கேட்க கிளிக் செய்யவும்)",
        "prompt1": "என் பயிர் இலைகள் மஞ்சள் நிறமாக மாறி பழுப்பு நிற புள்ளிகள் உள்ளன",
        "prompt2": "காரிஃப் பருவத்தில் கரிசல் மண்ணுக்கு எந்த விதைகள் சிறந்தது?",
        "prompt3": "ஜீவாமிர்தம் உயிர் உரத்தை இயற்கையாக தயாரிப்பது எப்படி?",
        "prompt4": "இயற்கை விவசாயத்திற்கு நான் என்ன அரசாங்க நிதி உதவி பெற முடியும்?",
        "input_label": "விவசாய கேள்வியைக் கேளுங்கள் (டைப் செய்யவும் அல்லது மைக்கைப் பயன்படுத்தவும்):",
        "input_placeholder": "உதாரணம்: தக்காளியில் பூச்சிகளை இயற்கையாகக் கட்டுப்படுத்துவது எப்படி?",
        "btn_ask": "கேள்வியைக் கேள்",
        "sidebar_history": "கேள்விகள் & புக்மார்க்குகள்",
        "sidebar_history_title": "வரலாறு",
        "sidebar_bookmarks_title": "புக்மார்க்குகள்",
        "no_history": "வரலாறு எதுவும் இல்லை.",
        "no_bookmarks": "புக்மார்க்குகள் எதுவும் இல்லை.",
        "response_title": "விருக்ஷாவின் இயற்கை ஆலோசனை",
        "speak_btn": "பதிலைக் கேள்",
        "stop_btn": "ஒலியை நிறுத்து",
        "copy_btn": "நகலெடு",
        "bookmark_btn": "புக்மார்க்",
        "copied_alert": "நகலெடுக்கப்பட்டது!",
        "bookmarked_alert": "புக்மார்க்கில் சேர்க்கப்பட்டது!",
        "removed_bookmark_alert": "புக்மார்க்கில் இருந்து நீக்கப்பட்டது!",
        "loading_msg": "விருக்ஷா உங்கள் கேள்வியை ஆராய்கிறது...",
        "empty_state_header": "விருக்ஷாவிற்கு உங்களை வரவேற்கிறோம்!",
        "empty_state_desc": "ஒலிவாங்கியில் பேசுவதன் மூலம் அல்லது பெட்டியில் தட்டச்சு செய்வதன் மூலம் உங்கள் கேள்வியைக் கேளுங்கள். மேலே மொழியைத் தேர்ந்தெடுக்கவும்.",
        "footer": "நிலையான விவசாயத்திற்கான அர்ப்பணிப்புடன் உருவாக்கப்பட்டது. 🌾 💚",
        "setting_title": "குரல் உதவி அமைப்புகள்",
        "api_key_placeholder": "",
        "api_key_help": "உலாவி குரல் மாதிரிகளில் இருந்து உங்களுக்கு தேவையான குரல் உச்சரிப்பை தேர்வு செய்யவும்.",
        "btn_save": "குரலை சேமி",
        "btn_close": "மூடு",
        "search_db_placeholder": "பயிர் அல்லது நோயைத் தேடுக...",
        "soil_label": "மண் வகையைத் தேர்ந்தெடுக்கவும்",
        "soil_alluvial": "வண்டல் மண் (களிமண்)",
        "soil_black": "கரிசல் மண் (பருத்தி மண்)",
        "soil_red": "செம்மண் (மணல் / வண்டல்)",
        "btn_filter_seeds": "விதை ரகங்கள் பெறுக",
        "offline_note": "*(உள்ளூர் தரவுத்தள பயன்முறை. AI உரையாடலைத் தொடங்க சர்வரில் Groq சாவியை உள்ளிடவும்)*",
        "status_idle": "ஒலிவாங்கியைத் தட்டவும் அல்லது பேசவும்",
        "status_listening": "கேட்கிறது... பேசுங்கள்",
        "status_thinking": "ஆராய்கிறது... பதில் தயார் செய்யப்படுகிறது",
        "status_speaking": "விருக்ஷா ஆலோசனை வழங்குகிறது...",
        "auto_speak_label": "தானியங்கி குரல் பதில்",
        "voice_select_label": "உதவி குரல் தேர்வு (மாற்று குரல்)"
    }
};

// ----------------- STATE VARIABLE SETTINGS -----------------
let currentLanguage = localStorage.getItem("vriksha_lang") || "en";
let history = JSON.parse(localStorage.getItem("vriksha_history")) || [];
let bookmarks = JSON.parse(localStorage.getItem("vriksha_bookmarks")) || [];
let autoSpeakEnabled = localStorage.getItem("vriksha_auto_speak") === "true";

// ----------------- DOM ELEMENT REFERENCES -----------------
const dom = {
    // Header & Navigation
    langSelector: document.getElementById("langSelector"),
    btnDrawerOpen: document.getElementById("btnDrawerOpen"),
    btnModalOpen: document.getElementById("btnModalOpen"),
    
    // Core Layout Sections
    tabs: document.querySelectorAll(".tab-btn"),
    tabPanes: document.querySelectorAll(".tab-content"),
    welcomeHero: document.getElementById("welcomeHero"),
    outputSection: document.getElementById("outputSection"),
    loaderOverlay: document.getElementById("loaderOverlay"),
    loaderText: document.getElementById("loaderText"),
    
    // Voice Assistant Orb Visualizer
    visualizerContainer: document.getElementById("visualizerContainer"),
    statusMain: document.getElementById("statusMain"),
    statusSubtitle: document.getElementById("statusSubtitle"),
    orbCore: document.getElementById("orbCore"),
    liveTranscript: document.getElementById("liveTranscript"),
    chkAutoSpeak: document.getElementById("chkAutoSpeak"),
    
    // Text Console
    queryInput: document.getElementById("queryInput"),
    btnAsk: document.getElementById("btnAsk"),
    quickChips: document.querySelectorAll(".quick-chip"),
    
    // Response Controls
    userQueryBubble: document.getElementById("userQueryBubble"),
    responseTitle: document.getElementById("responseTitle"),
    responseContent: document.getElementById("responseContent"),
    btnSpeak: document.getElementById("btnSpeak"),
    btnStop: document.getElementById("btnStop"),
    btnCopy: document.getElementById("btnCopy"),
    btnBookmark: document.getElementById("btnBookmark"),
    
    // Side Draw History
    drawer: document.getElementById("drawer"),
    drawerBackdrop: document.getElementById("drawerBackdrop"),
    btnDrawerClose: document.getElementById("btnDrawerClose"),
    historyList: document.getElementById("historyList"),
    bookmarkList: document.getElementById("bookmarkList"),
    
    // Settings Voice Modal
    modal: document.getElementById("modal"),
    btnModalClose: document.getElementById("btnModalClose"),
    voiceProfileSelect: document.getElementById("voiceProfileSelect"),
    btnSaveSettings: document.getElementById("btnSaveSettings"),
    
    // Dynamic lists renderers
    diseaseSearchInput: document.getElementById("diseaseSearchInput"),
    diseaseListContainer: document.getElementById("diseaseListContainer"),
    soilTypeSelect: document.getElementById("soilTypeSelect"),
    btnFilterSeeds: document.getElementById("btnFilterSeeds"),
    seedAdvisorContainer: document.getElementById("seedAdvisorContainer"),
    subsidiesContainer: document.getElementById("subsidiesContainer"),

    // Translators Labels
    onboardingTitle: document.getElementById("onboardingTitle"),
    card1Title: document.getElementById("card1Title"),
    card1Desc: document.getElementById("card1Desc"),
    card2Title: document.getElementById("card2Title"),
    card2Desc: document.getElementById("card2Desc"),
    card3Title: document.getElementById("card3Title"),
    card3Desc: document.getElementById("card3Desc"),
    quickChipsTitle: document.getElementById("quickChipsTitle"),
    emptyStateHeader: document.getElementById("emptyStateHeader"),
    emptyStateDesc: document.getElementById("emptyStateDesc"),
    footerText: document.getElementById("footerText"),
    
    // Labels replacement settings
    labelSoilType: document.getElementById("labelSoilType"),
    labelDiseaseSearch: document.getElementById("labelDiseaseSearch"),
    labelSubsidiesTitle: document.getElementById("labelSubsidiesTitle"),
    autoSpeakLabel: document.getElementById("autoSpeakLabel"),
    lblVoiceSelect: document.getElementById("lblVoiceSelect"),
    voiceHelp: document.getElementById("voiceHelp")
};

// Set values on load
dom.langSelector.value = currentLanguage;
dom.chkAutoSpeak.checked = autoSpeakEnabled;

// ----------------- NATIVE SOUND CHIME SYNTHESIZER -----------------
function playSound(type) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        if (type === "mic_start") {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = "sine";
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.38);
        } 
        else if (type === "response_ready") {
            const freqs = [523.25, 659.25, 783.99, 1046.50];
            freqs.forEach((freq, index) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, ctx.currentTime + (index * 0.08));
                gain.gain.setValueAtTime(0.06, ctx.currentTime + (index * 0.08));
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (index * 0.08) + 0.5);
                
                osc.start(ctx.currentTime + (index * 0.08));
                osc.stop(ctx.currentTime + (index * 0.08) + 0.6);
            });
        }
        else if (type === "click") {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = "triangle";
            osc.frequency.setValueAtTime(1000, ctx.currentTime);
            gain.gain.setValueAtTime(0.02, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        }
        else if (type === "error") {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.32);
        }
    } catch (e) {
        console.error("Audio Synthesis error: ", e);
    }
}

// ----------------- GREEN-SOCK (GSAP) ANIMATIONS -----------------
function runEntranceAnimations() {
    if (!window.gsap) return;
    
    gsap.set(".app-header, .tab-navigation, .voice-console, .feature-card", { opacity: 0 });
    
    const tl = gsap.timeline();
    tl.to(".app-header", { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
      .to(".tab-navigation", { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .to(".voice-console", { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .to(".feature-card", { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.4)" }, "-=0.2");

    // Infinite breathing scale and random wanderings for SVG liquid blob elements
    gsap.to(".blob-1", { duration: 3.5, scale: 1.08, x: "random(-6, 6)", y: "random(-6, 6)", repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-2", { duration: 4.5, scale: 1.12, x: "random(-8, 8)", y: "random(-8, 8)", repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".blob-3", { duration: 5.5, scale: 1.05, x: "random(-5, 5)", y: "random(-5, 5)", repeat: -1, yoyo: true, ease: "sine.inOut" });
    
    // Slow infinite spin for SVG liquid blobs
    gsap.to(".liquid-orb-svg", { rotation: 360, duration: 25, repeat: -1, ease: "none" });
}

function switchTabAnimated(targetTabId) {
    if (!window.gsap) {
        switchTab(targetTabId);
        return;
    }
    
    playSound("click");
    
    const activePane = document.querySelector(".tab-content.active");
    if (!activePane || activePane.id === `${targetTabId}Tab`) return;
    
    gsap.to(activePane, { opacity: 0, y: 15, duration: 0.2, onComplete: () => {
        switchTab(targetTabId);
        
        const newPane = document.getElementById(`${targetTabId}Tab`);
        gsap.fromTo(newPane, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
        
        if (targetTabId !== "chat") {
            gsap.from(".db-card", { y: 20, opacity: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" });
        }
    }});
}

function switchTab(targetTabId) {
    dom.tabs.forEach(tab => {
        if (tab.dataset.tab === targetTabId) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });

    dom.tabPanes.forEach(pane => {
        if (pane.id === `${targetTabId}Tab`) {
            pane.classList.add("active");
        } else {
            pane.classList.remove("active");
        }
    });
}

// ----------------- STATE VISUALIZER WRAPPER -----------------
function setVisualizerState(state) {
    dom.visualizerContainer.className = `visualizer-container state-${state}`;
    
    const text = TRANSLATIONS[currentLanguage];
    if (state === "idle") {
        dom.statusMain.innerText = text.status_idle;
        dom.statusSubtitle.innerText = "";
        dom.orbCore.querySelector(".material-symbols-rounded").innerText = "mic";
    } else if (state === "listening") {
        dom.statusMain.innerText = text.status_listening;
        dom.statusSubtitle.innerText = "";
        dom.orbCore.querySelector(".material-symbols-rounded").innerText = "graphic_eq";
    } else if (state === "thinking") {
        dom.statusMain.innerText = text.status_thinking;
        dom.statusSubtitle.innerText = "";
        dom.orbCore.querySelector(".material-symbols-rounded").innerText = "hourglass_empty";
    } else if (state === "speaking") {
        dom.statusMain.innerText = text.status_speaking;
        dom.statusSubtitle.innerText = "";
        dom.orbCore.querySelector(".material-symbols-rounded").innerText = "volume_up";
    }
}

// Equalizer canvas animation loop
let eqAnimationId;
function startEqualizerAnimation() {
    const bars = document.querySelectorAll(".eq-bar");
    if (bars.length === 0) return;
    
    function draw() {
        const state = dom.visualizerContainer.className;
        
        bars.forEach(bar => {
            let height = 5;
            if (state.includes("state-speaking")) {
                height = Math.floor(Math.random() * 25) + 6;
            } else if (state.includes("state-listening")) {
                height = Math.floor(Math.random() * 12) + 5;
            }
            bar.style.height = `${height}px`;
        });
        
        eqAnimationId = requestAnimationFrame(draw);
    }
    
    cancelAnimationFrame(eqAnimationId);
    draw();
}

// ----------------- CUSTOM ASSISTANT SPEECH VOICES ("DIFFERENT VOICE") -----------------
let systemVoices = [];
function populateVoiceList() {
    if (typeof speechSynthesis === 'undefined') return;
    systemVoices = speechSynthesis.getVoices();
    
    const select = dom.voiceProfileSelect;
    if (!select) return;
    
    select.innerHTML = "";
    
    const text = TRANSLATIONS[currentLanguage];
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "default";
    defaultOpt.text = text.voice_select_label.replace("Choose Assistant Voice", "Default Voice");
    select.appendChild(defaultOpt);
    
    // Filter voices based on current selected language code prefix
    const langFilter = currentLanguage === "hi" ? "hi" : (currentLanguage === "ta" ? "ta" : "en");
    
    systemVoices.forEach(voice => {
        if (voice.lang.toLowerCase().startsWith(langFilter)) {
            const option = document.createElement("option");
            option.value = voice.name;
            option.text = `${voice.name} (${voice.lang})`;
            
            // Check if this voice was saved
            const savedVoice = localStorage.getItem(`vriksha_voice_${currentLanguage}`);
            if (savedVoice === voice.name) {
                option.selected = true;
            }
            select.appendChild(option);
        }
    });
}

// Trigger voices changed event for browsers (like Chrome) that load voices asynchronously
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

// ----------------- TRANSLATION ENGINE -----------------
function translateUI() {
    const text = TRANSLATIONS[currentLanguage];
    
    document.getElementById("brandTagline").innerText = text.subtitle;
    
    if (dom.onboardingTitle) dom.onboardingTitle.innerText = text.onboarding_title;
    if (dom.card1Title) dom.card1Title.innerText = text.card1_title;
    if (dom.card1Desc) dom.card1Desc.innerText = text.card1_desc;
    if (dom.card2Title) dom.card2Title.innerText = text.card2_title;
    if (dom.card2Desc) dom.card2Desc.innerText = text.card2_desc;
    if (dom.card3Title) dom.card3Title.innerText = text.card3_title;
    if (dom.card3Desc) dom.card3Desc.innerText = text.card3_desc;
    
    dom.queryInput.placeholder = text.input_placeholder;
    dom.btnAsk.innerHTML = `<span class="material-symbols-rounded">send</span> ${text.btn_ask}`;
    
    if (dom.quickChipsTitle) dom.quickChipsTitle.innerText = text.quick_prompts;
    dom.quickChips.forEach((chip, index) => {
        chip.innerText = text[`prompt${index + 1}`];
    });
    
    if (dom.emptyStateHeader) dom.emptyStateHeader.innerText = text.empty_state_header;
    if (dom.emptyStateDesc) dom.emptyStateDesc.innerText = text.empty_state_desc;
    
    dom.btnSpeak.innerHTML = `<span class="material-symbols-rounded">volume_up</span> ${text.speak_btn}`;
    dom.btnStop.innerHTML = `<span class="material-symbols-rounded">volume_off</span> ${text.stop_btn}`;
    dom.btnCopy.innerHTML = `<span class="material-symbols-rounded">content_copy</span> ${text.copy_btn}`;
    dom.btnBookmark.innerHTML = `<span class="material-symbols-rounded">bookmark</span> ${text.bookmark_btn}`;
    
    document.getElementById("modalTitle").innerText = text.setting_title;
    if (dom.lblVoiceSelect) dom.lblVoiceSelect.innerText = text.voice_select_label;
    if (dom.voiceHelp) dom.voiceHelp.innerText = text.api_key_help;
    dom.btnSaveSettings.innerText = text.btn_save;
    
    document.getElementById("drawerTitle").innerText = text.sidebar_history;
    document.getElementById("lblHistorySection").innerText = text.sidebar_history_title;
    document.getElementById("lblBookmarkSection").innerText = text.sidebar_bookmarks_title;
    
    if (dom.labelDiseaseSearch) dom.labelDiseaseSearch.innerText = text.card1_title;
    if (dom.diseaseSearchInput) dom.diseaseSearchInput.placeholder = text.search_db_placeholder;
    
    if (dom.labelSoilType) dom.labelSoilType.innerText = text.soil_label;
    if (dom.btnFilterSeeds) dom.btnFilterSeeds.innerText = text.btn_filter_seeds;
    if (dom.labelSubsidiesTitle) dom.labelSubsidiesTitle.innerText = text.card3_title;
    if (dom.autoSpeakLabel) dom.autoSpeakLabel.innerText = text.auto_speak_label;
    
    if (dom.soilTypeSelect) {
        dom.soilTypeSelect.options[0].text = text.soil_alluvial;
        dom.soilTypeSelect.options[1].text = text.soil_black;
        dom.soilTypeSelect.options[2].text = text.soil_red;
    }
    
    if (dom.footerText) dom.footerText.innerHTML = text.footer;
    
    setVisualizerState("idle");
    populateVoiceList();
    renderDiseaseDatabase();
    renderSeedAdvisor();
    renderSubsidies();
    renderDrawerLists();
}

// ----------------- SIDEBAR DRAWERS & BOOKMARKS -----------------
function toggleDrawer(isOpen) {
    if (isOpen) {
        playSound("click");
        renderDrawerLists();
        dom.drawer.classList.add("open");
        dom.drawerBackdrop.classList.add("active");
        
        if (window.gsap) {
            gsap.from(".history-item", { x: -20, opacity: 0, duration: 0.3, stagger: 0.05 });
        }
    } else {
        dom.drawer.classList.remove("open");
        dom.drawerBackdrop.classList.remove("active");
    }
}

function renderDrawerLists() {
    const text = TRANSLATIONS[currentLanguage];
    
    dom.historyList.innerHTML = "";
    if (history.length === 0) {
        dom.historyList.innerHTML = `<div style="font-size:0.85rem; color:var(--text-muted); padding:5px;">${text.no_history}</div>`;
    } else {
        history.slice().reverse().forEach((item, index) => {
            const btn = document.createElement("button");
            btn.className = "history-item";
            btn.innerText = item.query;
            btn.onclick = () => {
                showOutput(item.query, item.response);
                toggleDrawer(false);
                switchTabAnimated("chat");
            };
            dom.historyList.appendChild(btn);
        });
    }

    dom.bookmarkList.innerHTML = "";
    if (bookmarks.length === 0) {
        dom.bookmarkList.innerHTML = `<div style="font-size:0.85rem; color:var(--text-muted); padding:5px;">${text.no_bookmarks}</div>`;
    } else {
        bookmarks.forEach(item => {
            const btn = document.createElement("button");
            btn.className = "history-item";
            btn.innerText = item.query;
            btn.onclick = () => {
                showOutput(item.query, item.response);
                toggleDrawer(false);
                switchTabAnimated("chat");
            };
            dom.bookmarkList.appendChild(btn);
        });
    }
}

function toggleBookmarkCurrent(query, response) {
    const text = TRANSLATIONS[currentLanguage];
    const existingIndex = bookmarks.findIndex(item => item.query === query);
    
    if (existingIndex > -1) {
        bookmarks.splice(existingIndex, 1);
        playSound("click");
        alert(text.removed_bookmark_alert);
    } else {
        bookmarks.push({ query, response });
        playSound("response_ready");
        alert(text.bookmarked_alert);
    }
    localStorage.setItem("vriksha_bookmarks", JSON.stringify(bookmarks));
    renderDrawerLists();
    updateBookmarkButtonState(query);
}

function updateBookmarkButtonState(query) {
    const isBookmarked = bookmarks.some(item => item.query === query);
    if (isBookmarked) {
        dom.btnBookmark.classList.add("active-speak");
    } else {
        dom.btnBookmark.classList.remove("active-speak");
    }
}

// ----------------- SETTINGS MODALS -----------------
function toggleModal(isOpen) {
    if (isOpen) {
        playSound("click");
        populateVoiceList();
        dom.modal.classList.add("active");
        if (window.gsap) {
            gsap.from(".modal-window", { scale: 0.9, opacity: 0, duration: 0.3, ease: "back.out(1.5)" });
        }
    } else {
        dom.modal.classList.remove("active");
    }
}

// ----------------- TEXT-TO-SPEECH (TTS) -----------------
function speakResponse(text) {
    window.speechSynthesis.cancel();
    
    const cleanText = text
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/###/g, "")
        .replace(/#/g, "")
        .replace(/-/g, " ");

    const langCode = currentLanguage === "hi" ? "hi-IN" : (currentLanguage === "ta" ? "ta-IN" : "en-US");
    const sentences = cleanText.split(/[.।\n]+/);
    
    const selectedVoiceName = localStorage.getItem(`vriksha_voice_${currentLanguage}`);
    let activeUtterances = 0;
    
    sentences.forEach((sentence) => {
        const trimmed = sentence.trim();
        if (trimmed.length > 0) {
            const utterance = new SpeechSynthesisUtterance(trimmed);
            utterance.lang = langCode;
            utterance.rate = 0.95;
            utterance.pitch = 1.05;
            
            // Assign custom selected voice ("Different Voice" request)
            if (selectedVoiceName && selectedVoiceName !== 'default') {
                const voiceObj = systemVoices.find(v => v.name === selectedVoiceName);
                if (voiceObj) {
                    utterance.voice = voiceObj;
                }
            }
            
            utterance.onstart = () => {
                activeUtterances++;
                setVisualizerState("speaking");
                dom.btnSpeak.classList.add("active-speak");
            };
            
            utterance.onend = () => {
                activeUtterances--;
                if (activeUtterances <= 0) {
                    setVisualizerState("idle");
                    dom.btnSpeak.classList.remove("active-speak");
                }
            };
            
            utterance.onerror = () => {
                activeUtterances--;
                if (activeUtterances <= 0) {
                    setVisualizerState("idle");
                    dom.btnSpeak.classList.remove("active-speak");
                }
            };
            
            window.speechSynthesis.speak(utterance);
        }
    });
}

// ----------------- SPEECH-TO-TEXT (STT) -----------------
let speechRecognitionObj;
let isDictating = false;

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        dom.orbCore.style.backgroundColor = "rgba(255,255,255,0.05)";
        dom.orbCore.disabled = true;
        dom.statusMain.innerText = "Speech recognition unsupported by browser";
        return;
    }
    
    speechRecognitionObj = new SpeechRecognition();
    speechRecognitionObj.continuous = false;
    speechRecognitionObj.interimResults = true;
    
    speechRecognitionObj.onstart = () => {
        isDictating = true;
        playSound("mic_start");
        setVisualizerState("listening");
        dom.liveTranscript.innerText = "...";
        dom.liveTranscript.classList.add("active");
    };
    
    speechRecognitionObj.onend = () => {
        isDictating = false;
        setVisualizerState("idle");
    };
    
    speechRecognitionObj.onresult = (event) => {
        const resultIndex = event.resultIndex;
        const transcript = event.results[resultIndex][0].transcript;
        
        dom.liveTranscript.innerText = transcript;
        
        if (event.results[resultIndex].isFinal) {
            dom.queryInput.value = transcript;
            setTimeout(() => {
                dom.liveTranscript.classList.remove("active");
                submitFarmingQuery(transcript);
            }, 500);
        }
    };
    
    speechRecognitionObj.onerror = (event) => {
        console.error("STT Dictation error: ", event.error);
        playSound("error");
        setVisualizerState("idle");
        dom.liveTranscript.classList.remove("active");
        isDictating = false;
    };
}

function toggleDictation() {
    if (!speechRecognitionObj) return;
    
    if (isDictating) {
        speechRecognitionObj.stop();
    } else {
        window.speechSynthesis.cancel();
        const langCode = currentLanguage === "hi" ? "hi-IN" : (currentLanguage === "ta" ? "ta-IN" : "en-US");
        speechRecognitionObj.lang = langCode;
        try {
            speechRecognitionObj.start();
        } catch (e) {
            console.error(e);
        }
    }
}

// ----------------- API GATEWAY CALLS (POST TO PYTHON BACKEND) -----------------
async function submitFarmingQuery(query) {
    if (!query || !query.trim()) return;
    
    window.speechSynthesis.cancel();
    setVisualizerState("thinking");
    
    try {
        // Send request to our private Python backend server API endpoint securely!
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                lang: currentLanguage
            })
        });
        
        if (!res.ok) {
            throw new Error(`Server returned error status: ${res.status}`);
        }
        
        const data = await res.json();
        const responseText = data.response;
        
        // Save to cache history
        history.push({ query, response: responseText, lang: currentLanguage });
        localStorage.setItem("vriksha_history", JSON.stringify(history));
        
        // Show Response
        playSound("response_ready");
        showOutput(query, responseText);
        
        // Auto Speak Check
        if (autoSpeakEnabled) {
            setTimeout(() => {
                speakResponse(responseText);
            }, 800);
        } else {
            setVisualizerState("idle");
        }
        
    } catch (err) {
        console.error("Secure query dispatch failed: ", err);
        playSound("error");
        
        // Local database matching fallback in client script
        const queryLower = query.toLowerCase();
        let fallbackMatch = "";
        
        // Offline disease/symptom keyword lookup
        if (queryLower.includes("yellow") || queryLower.includes("spots") || queryLower.includes("blast") || queryLower.includes("blight") || queryLower.includes("रोग") || queryLower.includes("झुलसा") || queryLower.includes("நோய்")) {
            fallbackMatch = DISEASES.rice_blast.treatment[currentLanguage];
        } else if (queryLower.includes("seed") || queryLower.includes("soil") || queryLower.includes("बीज") || queryLower.includes("விதை")) {
            fallbackMatch = SEED_SELECTION.alluvial.crops.Rice.organic_prep[currentLanguage];
        }
        
        const defaultAdvice = currentLanguage === "hi" 
            ? "**त्वरित समाधान**: सर्वर कनेक्शन में त्रुटि। कृपया जैविक खेती के लिए जीवामृत का उपयोग करें।\n- 10 किलो गोबर, 10 लीटर गोमूत्र, 2 किलो बेसन, 2 किलो गुड़ और 200 लीटर पानी का घोल तैयार करें। इसे 5 दिन छाया में किण्वित करें।"
            : (currentLanguage === "ta" ? "**விவரம்**: சர்வர் இணைப்பு பிழை. தயவுசெய்து ஜீவாமிர்தம் உயிர் உரம் பயன்படுத்தவும்.\n- 10 கிலோ சாணம், 10 லிட்டர் கோமியம், 2 கிலோ கடலை மாவு, 2 கிலோ வெல்லம் மற்றும் 200 லிட்டர் தண்ணீர் சேர்த்து நிழலில் 5 நாட்கள் புளிக்க வைக்கவும்." : "**Quick Answer**: Server communication issue. Please use Jivamrita organic tonic.\n- Mix 10kg dung, 10L urine, 2kg besan, 2kg jaggery in 200L water. Ferment in shade for 5 days.");
        
        const finalText = fallbackMatch ? `**Quick Answer**: ${fallbackMatch}\n\n*(Error contacting secure backend)*` : `${defaultAdvice}\n\n*(Error contacting secure backend)*`;
        
        history.push({ query, response: finalText, lang: currentLanguage });
        localStorage.setItem("vriksha_history", JSON.stringify(history));
        
        showOutput(query, finalText);
        
        if (autoSpeakEnabled) {
            setTimeout(() => {
                speakResponse(finalText);
            }, 800);
        } else {
            setVisualizerState("idle");
        }
    }
}

// ----------------- PROFESSIONAL RESPONSE PARSING & RENDERING -----------------
function parseMarkdownToSections(text) {
    const lines = text.split('\n');
    const sections = [];
    let currentSection = { title: "", content: [] };
    
    for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        // Match header line: **Title** or ### Title
        const headerMatch = trimmed.match(/^\s*\*\*(.*?)\*\*[:\s]*(.*)/) || trimmed.match(/^\s*###\s*(.*)/);
        
        if (headerMatch && (
            headerMatch[1].length < 60 && 
            (
                /answer|recipe|tip|caution|step|prevent|method|ingredient|detail|scheme|variety|solution|முடிவு|தீர்வு|முறை|வழி|தேவை|பரிந்துரை|எச்சரிக்கை|உபாயம்|समाधान|विधि|सावधानी|सामग्री|बचाव/i.test(headerMatch[1]) ||
                trimmed.startsWith("**" + headerMatch[1] + "**:") ||
                trimmed.endsWith(":")
            )
        )) {
            if (currentSection.content.length > 0 || currentSection.title) {
                sections.push(currentSection);
            }
            currentSection = { title: headerMatch[1].replace(/:$/, "").trim(), content: [] };
            if (headerMatch[2] && headerMatch[2].trim()) {
                currentSection.content.push(headerMatch[2].trim());
            }
        } else {
            currentSection.content.push(line);
        }
    }
    if (currentSection.content.length > 0 || currentSection.title) {
        sections.push(currentSection);
    }
    return sections;
}

function formatMarkdownTextInline(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function formatContentList(contentLines) {
    let html = "";
    let inList = null; // 'ol', 'ul', or null
    
    for (let line of contentLines) {
        let trimmed = line.trim();
        if (!trimmed) continue;
        
        const olMatch = trimmed.match(/^\d+[\.\)]\s*(.*)/);
        const ulMatch = trimmed.match(/^[\*\-]\s*(.*)/);
        
        if (olMatch) {
            if (inList === 'ul') {
                html += "</ul>";
                inList = null;
            }
            if (inList !== 'ol') {
                html += "<ol class='professional-ol'>";
                inList = 'ol';
            }
            html += `<li>${formatMarkdownTextInline(olMatch[1])}</li>`;
        } else if (ulMatch) {
            if (inList === 'ol') {
                html += "</ol>";
                inList = null;
            }
            if (inList !== 'ul') {
                html += "<ul class='professional-ul'>";
                inList = 'ul';
            }
            html += `<li>${formatMarkdownTextInline(ulMatch[1])}</li>`;
        } else {
            if (inList === 'ol') {
                html += "</ol>";
                inList = null;
            } else if (inList === 'ul') {
                html += "</ul>";
                inList = null;
            }
            html += `<p class='professional-p'>${formatMarkdownTextInline(trimmed)}</p>`;
        }
    }
    
    if (inList === 'ol') {
        html += "</ol>";
    } else if (inList === 'ul') {
        html += "</ul>";
    }
    
    return html;
}

function formatProfessionalResponse(text) {
    const sections = parseMarkdownToSections(text);
    let html = "<div class='response-sections-container'>";
    
    sections.forEach(sec => {
        const titleLower = sec.title.toLowerCase();
        let cardClass = "general-card";
        let icon = "info";
        
        if (/answer|solution|உபாயம்|விவரம்|समाधान|त्वरित/i.test(titleLower)) {
            cardClass = "quick-answer-card";
            icon = "tips_and_updates";
        } else if (/recipe|method|preparation|विधि|தயாரிப்பு|முறை/i.test(titleLower)) {
            cardClass = "recipe-card";
            icon = "receipt_long";
        } else if (/caution|warning|எச்சரிக்கை|सावधानी/i.test(titleLower)) {
            cardClass = "caution-card";
            icon = "warning";
        } else if (/tip|prevent|ingredient|variety|crop|முன்னெச்சரிக்கை|பொருட்கள்|பயிர்|सामग्री|बचाव/i.test(titleLower)) {
            cardClass = "tips-card";
            icon = "eco";
        }
        
        html += `
            <div class="response-card-block ${cardClass}">
                ${sec.title ? `
                <div class="response-card-header">
                    <span class="material-symbols-rounded response-card-icon">${icon}</span>
                    <h3 class="response-card-title">${sec.title}</h3>
                </div>
                ` : ''}
                <div class="response-card-body-text">
                    ${formatContentList(sec.content)}
                </div>
            </div>
        `;
    });
    
    html += "</div>";
    return html;
}

function showOutput(query, response) {
    dom.welcomeHero.style.display = "none";
    dom.outputSection.classList.add("active");
    
    dom.userQueryBubble.innerHTML = `🗣️ <b>User:</b> ${query}`;
    dom.responseTitle.innerText = TRANSLATIONS[currentLanguage].response_title;
    
    dom.responseContent.innerHTML = formatProfessionalResponse(response);
    
    if (window.gsap) {
        gsap.from(".response-card", { scale: 0.96, opacity: 0, duration: 0.45, ease: "power2.out" });
        dom.outputSection.scrollIntoView({ behavior: "smooth" });
    }
    
    updateBookmarkButtonState(query);
    
    dom.btnSpeak.onclick = () => {
        playSound("click");
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setVisualizerState("idle");
            dom.btnSpeak.classList.remove("active-speak");
        } else {
            speakResponse(response);
        }
    };
    dom.btnStop.onclick = () => {
        playSound("click");
        window.speechSynthesis.cancel();
        setVisualizerState("idle");
    };
    dom.btnCopy.onclick = () => {
        playSound("click");
        navigator.clipboard.writeText(response).then(() => {
            alert(TRANSLATIONS[currentLanguage].copied_alert);
        });
    };
    dom.btnBookmark.onclick = () => {
        toggleBookmarkCurrent(query, response);
    };
}

// ----------------- DATABASES RENDERERS (TABS) -----------------
function renderDiseaseDatabase() {
    if (!dom.diseaseListContainer) return;
    
    dom.diseaseListContainer.innerHTML = "";
    const filterText = dom.diseaseSearchInput ? dom.diseaseSearchInput.value.toLowerCase() : "";
    
    for (const key in DISEASES) {
        const disease = DISEASES[key];
        const name = disease.names[currentLanguage];
        const crop = disease.crop[currentLanguage];
        const symptoms = disease.symptoms[currentLanguage];
        const treatment = disease.treatment[currentLanguage];
        const prevention = disease.prevention[currentLanguage];
        
        if (name.toLowerCase().includes(filterText) || crop.toLowerCase().includes(filterText) || symptoms.toLowerCase().includes(filterText)) {
            const card = document.createElement("div");
            card.className = "db-card";
            card.innerHTML = `
                <div class="db-card-header">${name}</div>
                <div class="db-card-meta">${currentLanguage === 'hi' ? 'फसल' : (currentLanguage === 'ta' ? 'பயிர்' : 'Crop')}: ${crop}</div>
                <div class="db-card-body">
                    <p><strong>${currentLanguage === 'hi' ? 'लक्षण' : (currentLanguage === 'ta' ? 'அறிகுறிகள்' : 'Symptoms')}:</strong> ${symptoms}</p>
                    <p><strong>${currentLanguage === 'hi' ? 'जैविक उपचार' : (currentLanguage === 'ta' ? 'இயற்கை தீர்வு' : 'Organic Remedy')}:</strong> ${treatment.replace(/\n/g, "<br>")}</p>
                    <p><strong>${currentLanguage === 'hi' ? 'बचाव' : (currentLanguage === 'ta' ? 'முன்னெச்சரிக்கை' : 'Prevention')}:</strong> ${prevention}</p>
                </div>
            `;
            dom.diseaseListContainer.appendChild(card);
        }
    }
}

function renderSeedAdvisor() {
    if (!dom.seedAdvisorContainer) return;
    
    dom.seedAdvisorContainer.innerHTML = "";
    const soilKey = dom.soilTypeSelect.value;
    const soilInfo = SEED_SELECTION[soilKey];
    
    for (const crop in soilInfo.crops) {
        const details = soilInfo.crops[crop];
        const card = document.createElement("div");
        card.className = "db-card";
        card.innerHTML = `
            <div class="db-card-header">${crop}</div>
            <div class="db-card-meta">${soilInfo.soil_name[currentLanguage]}</div>
            <div class="db-card-body">
                <p><strong>${currentLanguage === 'hi' ? 'बीज की किस्में' : (currentLanguage === 'ta' ? 'விதை ரகங்கள்' : 'Seed Varieties')}:</strong> ${details.varieties}</p>
                <p><strong>${currentLanguage === 'hi' ? 'बुवाई का मौसम' : (currentLanguage === 'ta' ? 'விதைப்பு பருவம்' : 'Sowing Season')}:</strong> ${details.sowing_season[currentLanguage]}</p>
                <p><strong>${currentLanguage === 'hi' ? 'जैविक बीज उपचार' : (currentLanguage === 'ta' ? 'இயற்கை விதை நேர்த்தி' : 'Organic Seed Prep')}:</strong> ${details.organic_prep[currentLanguage]}</p>
            </div>
        `;
        dom.seedAdvisorContainer.appendChild(card);
    }
}

function renderSubsidies() {
    if (!dom.subsidiesContainer) return;
    
    dom.subsidiesContainer.innerHTML = "";
    FINANCIAL_SCHEMES.forEach(scheme => {
        const card = document.createElement("div");
        card.className = "db-card";
        card.innerHTML = `
            <div class="db-card-header">${scheme.name[currentLanguage]}</div>
            <div class="db-card-body">
                <p><strong>${currentLanguage === 'hi' ? 'विवरण' : (currentLanguage === 'ta' ? 'விவரம்' : 'Details')}:</strong> ${scheme.details[currentLanguage]}</p>
                <p><strong>${currentLanguage === 'hi' ? 'पात्रता' : (currentLanguage === 'ta' ? 'தகுதி' : 'Eligibility')}:</strong> ${scheme.eligibility[currentLanguage]}</p>
            </div>
        `;
        dom.subsidiesContainer.appendChild(card);
    });
}

// ----------------- EVENT LISTENERS SETUP -----------------
function setupEventListeners() {
    dom.langSelector.addEventListener("change", (e) => {
        playSound("click");
        currentLanguage = e.target.value;
        localStorage.setItem("vriksha_lang", currentLanguage);
        translateUI();
    });
    
    dom.btnDrawerOpen.addEventListener("click", () => toggleDrawer(true));
    dom.btnDrawerClose.addEventListener("click", () => toggleDrawer(false));
    dom.drawerBackdrop.addEventListener("click", () => toggleDrawer(false));
    
    dom.btnModalOpen.addEventListener("click", () => toggleModal(true));
    dom.btnModalClose.addEventListener("click", () => toggleModal(false));
    
    dom.btnSaveSettings.addEventListener("click", () => {
        playSound("response_ready");
        
        // Save Voice profile configuration
        const select = dom.voiceProfileSelect;
        if (select) {
            localStorage.setItem(`vriksha_voice_${currentLanguage}`, select.value);
        }
        
        toggleModal(false);
        alert(currentLanguage === "hi" ? "आवाज सेटिंग्स सहेज ली गई हैं!" : (currentLanguage === "ta" ? "குரல் அமைப்புகள் சேமிக்கப்பட்டன!" : "Voice settings applied successfully!"));
    });
    
    dom.chkAutoSpeak.addEventListener("change", (e) => {
        playSound("click");
        autoSpeakEnabled = e.target.checked;
        localStorage.setItem("vriksha_auto_speak", autoSpeakEnabled);
    });
    
    dom.tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            switchTabAnimated(tab.dataset.tab);
        });
    });
    
    dom.btnAsk.addEventListener("click", () => {
        playSound("click");
        submitFarmingQuery(dom.queryInput.value);
    });
    dom.queryInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            playSound("click");
            submitFarmingQuery(dom.queryInput.value);
        }
    });
    
    dom.orbCore.addEventListener("click", toggleDictation);
    
    dom.quickChips.forEach((chip, index) => {
        chip.addEventListener("click", () => {
            playSound("click");
            const promptText = TRANSLATIONS[currentLanguage][`prompt${index + 1}`];
            dom.queryInput.value = promptText;
            submitFarmingQuery(promptText);
        });
    });
    
    dom.diseaseSearchInput.addEventListener("input", renderDiseaseDatabase);
    
    dom.btnFilterSeeds.addEventListener("click", () => {
        playSound("click");
        renderSeedAdvisor();
        if (window.gsap) {
            gsap.from("#seedAdvisorContainer .db-card", { y: 15, opacity: 0, duration: 0.35, stagger: 0.08 });
        }
    });
}

// ----------------- INITIALIZATION -----------------
document.addEventListener("DOMContentLoaded", () => {
    translateUI();
    setupEventListeners();
    initSpeechRecognition();
    startEqualizerAnimation();
    
    setTimeout(runEntranceAnimations, 100);
});
