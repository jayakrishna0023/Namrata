// server.js - Secure Node.js Server & API Gateway (Zero NPM Dependencies)

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// ----------------- PRIVATE CONFIG (LOAD ENV FROM .ENV) -----------------
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                // Ignore comments and empty lines
                if (!line.trim() || line.trim().startsWith('#')) return;
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    // Join back value parts in case value contains '='
                    const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
                    process.env[key] = val;
                }
            });
        }
    } catch (e) {
        console.error("Server: Failed to read .env configuration file:", e);
    }
}
loadEnv();

// ----------------- LOCAL AGRICULTURAL DATABASE -----------------
const DISEASES = {
    "rice_blast": {
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

const NATURAL_PRACTICES = {
    "jivamrita": {
        "name": { "en": "Jivamrita (Bio-fertilizer)", "hi": "जीवामृत", "ta": "ஜீவாமிர்தம்" },
        "ingredients": {
            "en": "10 kg fresh cow dung, 5-10 liters cow urine, 2 kg jaggery, 2 kg pulse flour (besan), 1 handful soil from local farm boundary, 200 liters water.",
            "hi": "10 किलोग्राम ताज़ा गाय का गोबर, 5-10 लीटर गोमूत्र, 2 किलोग्राम गुड़, 2 किलोग्राम बेसन (दाल का आटा), खेत की मेड़ की एक मुट्ठी मिट्टी, 200 लीटर पानी।",
            "ta": "10 கிலோ பசு சாணம், 5-10 லிட்டர் கோமியம், 2 கிலோ வெல்லம், 2 கிலோ கடலை மாவு, வயல் வரப்பில் உள்ள ஒரு பிடி மண், 200 லிட்டர் தண்ணீர்."
        },
        "preparation": {
            "en": "1. Mix cow dung and urine with 200 liters of water in a large plastic barrel.\n2. Add crushed jaggery, pulse flour, and the handful of soil. Mix thoroughly.\n3. Cover with a jute bag and ferment in shade for 2 to 7 days.\n4. Stir the mixture clockwise twice a day. Apply to soil within 7 days of preparation.",
            "hi": "1. एक बड़े प्लास्टिक बैरल में गाय के गोबर और गोमूत्र को 200 लीटर पानी के साथ मिलाएं।\n2. इसमें कुचला हुआ गुड़, बेसन और मुट्ठी भर मिट्टी डालकर अच्छी तरह मिलाएं।\n3. जूट के बोरे से ढककर 2 से 7 दिनों के लिए छाया में किण्वन (ferment) होने दें।\n4. दिन में दो बार लकड़ी की डंडी से घड़ी की सुई की दिशा में हिलाएं। इसे तैयार होने के 7 दिनों के भीतर मिट्टी में डालें।\n5. इसे सिंचाई के पानी के साथ या सीधे मिट्टी में छिड़कें।",
            "ta": "1. ஒரு பெரிய பேரலில் பசு சாணம் மற்றும் கோமியத்தை 200 லிட்டர் தண்ணீருடன் கலக்கவும்.\n2. அதில் வெல்லம், கடலை மாவு மற்றும் ஒரு பிடி மண் சேர்த்து நன்றாகக் கலக்கவும்.\n3. சணல் சாக்கு கொண்டு மூடி நிழலில் 2 முதல் 7 நாட்கள் வரை புளிக்க வைக்கவும்.\n4. தினமும் இருமுறை கடிகாரச் சுற்றில் கலக்கி வரவும். தயாரித்த 7 நாட்களுக்குள் மண்ணில் இட வேண்டும்."
        }
    },
    "bijamrita": {
        "name": { "en": "Bijamrita (Seed treatment)", "hi": "बीजामृत", "ta": "பீஜாமிர்தம்" },
        "ingredients": {
            "en": "5 kg fresh cow dung, 5 liters cow urine, 50g lime (chuna), 1 handful soil, 20 liters water.",
            "hi": "5 किलोग्राम ताज़ा गाय का गोबर, 5 लीटर गोमूत्र, 50 ग्राम चूना, 1 मुट्ठी मिट्टी, 20 लीटर पानी।",
            "ta": "5 கிலோ பசு சாணம், 5 லிட்டர் கோமியம், 50 கிராம் சுண்ணாம்பு, ஒரு பிடி மண், 20 லிட்டர் தண்ணீர்."
        },
        "preparation": {
            "en": "1. Tie cow dung in a cloth and suspend it in 20 liters of water for 12 hours. Squeeze the dung extract into the water.\n2. Add cow urine, lime, and local soil. Stir well.\n3. Let it sit overnight. Use it next day to coat seeds or dip roots of seedlings before planting.",
            "hi": "1. 5 किलो गोबर को कपड़े में बांधकर 20 लीटर पानी में 12 घंटे के लिए लटका दें। गोबर के रस को पानी में निचोड़ लें।\n2. इसमें गोमूत्र, चूना और मिट्टी डालें। अच्छी तरह हिलाएं।\n3. इसे रात भर छोड़ दें। अगले दिन बीजों पर इसकी परत चढ़ाने या रोपाई से पहले पौधों की जड़ों को डुबोने के लिए उपयोग करें।",
            "ta": "1. ஒரு துணியில் பசு சாணத்தைக் கட்டி 20 லிட்டர் தண்ணீரில் 12 மணி நேரம் ஊறவைக்கவும். சாணச் சாற்றை நீரில் பிழியவும்.\n2. அதனுடன் கோமியம், சுண்ணாம்பு மற்றும் மண் சேர்த்து நன்றாகக் கலக்கவும்.\n3. இரவு முழுவதும் அப்படியே வைத்திருந்து, மறுநாள் விதை நேர்த்தி செய்ய அல்லது நாற்றுகளின் வேர்களை நனைத்து நடவு செய்யப் பயன்படுத்தவும்."
        }
    }
};

const SYSTEM_PROMPTS = {
    "en": "You are \"Namrata\", a friendly and highly knowledgeable natural farming consultant. Recommend ONLY organic agricultural solutions. Suggest Jivamrita, Bijamrita, Neemastra. No chemical fertilizers. Provide a Quick Answer, Step-by-Step recipe, and a Caution note. Answer in English.",
    "hi": "आप \"नम्रता\" (Namrata) हैं, जो एक मित्रवत और प्राकृतिक खेती के अनुभवी सलाहकार हैं। केवल जैविक कृषि समाधानों की सिफारिश करें (जैसे जीवामृत, बीजामृत, नीमास्त्र)। यूरिया या डीएपी जैसे रासायनिक खादों का नाम न लें। एक त्वरित उपाय, चरण-दर-चरण विधि और एक सावधानी नोट दें। हिंदी में उत्तर दें।",
    "ta": "நீங்கள் \"நம்ரதா\" (Namrata), ஒரு இயற்கை விவசாய ஆலோசகர். கரிம விவசாய தீர்வுகளை மட்டுமே பரிந்துரைக்கவும் (ஜீவாமிர்தம், பீஜாமிர்தம் போன்றவை). ரசாயன உரங்களை தவிர்க்கவும். விரைவு தீர்வு, படி படியான தயாரிப்பு முறை மற்றும் எச்சரிக்கை குறிப்பு வழங்கவும். தமிழில் பதிலளிக்கவும்."
};

// ----------------- INTENT CLASSIFICATION & RAG SEARCH -----------------
function classifyIntent(query) {
    const queryLower = query.toLowerCase();
    
    const diseaseKeywords = [
        "leaf", "yellow", "spots", "fungus", "pest", "disease", "insect", "rot", "blight", "blast", "worm", "caterpillar",
        "पत्ता", "पीला", "धब्बा", "कीड़ा", "रोग", "झुलसा", "फंगस", "सुंडी", "कीट",
        "இலை", "மஞ்சள்", "புள்ளி", "பூஞ்சை", "பூச்சி", "நோய்", "அழுகல்", "புழு"
    ];
    if (diseaseKeywords.some(kw => queryLower.includes(kw))) return "disease";
    
    const seedKeywords = [
        "seed", "soil", "sow", "variety", "cultivate", "crop best", "which crop", "clay", "sand", "loam", "alluvial",
        "बीज", "मिट्टी", "बुवाई", "किस्म", "जमीन", "बोएं", "दोमट", "काली", "लाल",
        "விதை", "மண்", "பயிர்", "வகை", "கரிசல்", "செம்மண்", "வண்டல்"
    ];
    if (seedKeywords.some(kw => queryLower.includes(kw))) return "seed";
    
    const financeKeywords = [
        "money", "subsidy", "finance", "scheme", "loan", "insurance", "pension", "pm-kisan", "pkvy", "pmfby", "subsidies",
        "पैसा", "सब्सिडी", "ऋण", "योजना", "लोन", "बीमा", "किस्त", "सरकारी",
        "பணம்", "மானியம்", "திட்டம்", "கடன்", "காப்பீடு", "நிதி"
    ];
    if (financeKeywords.some(kw => queryLower.includes(kw))) return "finance";
    
    return "general";
}

function searchLocalKB(query, intent, lang) {
    const queryLower = query.toLowerCase();
    let matchedData = null;
    let contextStr = "";
    
    if (intent === "disease") {
        for (const key in DISEASES) {
            const details = DISEASES[key];
            const diseaseName = details.names[lang].toLowerCase();
            const cropName = details.crop[lang].toLowerCase();
            if (queryLower.includes(key) || diseaseName.split(" ").some(w => queryLower.includes(w)) || cropName.split(" ").some(w => queryLower.includes(w))) {
                matchedData = {
                    title: details.names[lang],
                    crop: details.crop[lang],
                    symptoms: details.symptoms[lang],
                    treatment: details.treatment[lang],
                    prevention: details.prevention[lang],
                    type: "disease"
                };
                break;
            }
        }
        
        if (!matchedData) {
            for (const key in NATURAL_PRACTICES) {
                const details = NATURAL_PRACTICES[key];
                const practiceName = details.name[lang].toLowerCase();
                if (queryLower.includes(key) || practiceName.split(" ").some(w => queryLower.includes(w))) {
                    matchedData = {
                        title: details.name[lang],
                        ingredients: details.ingredients[lang],
                        preparation: details.preparation[lang],
                        type: "practice"
                    };
                    break;
                }
            }
        }
    } else if (intent === "seed") {
        let soilKey = "alluvial";
        if (queryLower.includes("black") || queryLower.includes("काली") || queryLower.includes("கரிசல்")) {
            soilKey = "black";
        } else if (queryLower.includes("red") || queryLower.includes("लाल") || queryLower.includes("செம்மண்")) {
            soilKey = "red";
        }
        
        const soilInfo = SEED_SELECTION[soilKey];
        const cropsList = [];
        for (const crop in soilInfo.crops) {
            const cropDetails = soilInfo.crops[crop];
            cropsList.push(`- **${crop}**: Varieties: ${cropDetails.varieties}, Season: ${cropDetails.sowing_season[lang]}. Seed treatment: ${cropDetails.organic_prep[lang]}`);
        }
        matchedData = {
            title: soilInfo.soil_name[lang],
            recommendations: cropsList.join("\n"),
            type: "seed"
        };
    } else if (intent === "finance") {
        const schemesMatched = [];
        FINANCIAL_SCHEMES.forEach(scheme => {
            const schemeName = scheme.name[lang].toLowerCase();
            if (schemeName.split(" ").some(w => queryLower.includes(w)) || queryLower.includes("subsidy") || queryLower.includes("सब्सिडी") || queryLower.includes("மானியம்")) {
                schemesMatched.push(`### ${scheme.name[lang]}\n- **Details**: {scheme.details[lang]}\n- **Eligibility**: {scheme.eligibility[lang]}`);
            }
        });
        
        if (schemesMatched.length > 0) {
            matchedData = {
                title: lang === "en" ? "Government Schemes" : (lang === "hi" ? "सरकारी योजनाएं" : "அரசு திட்டங்கள்"),
                details: schemesMatched.join("\n\n"),
                type: "finance"
            };
        }
    }
    
    if (matchedData) {
        if (matchedData.type === "disease") {
            contextStr = `Grounding Info: Disease matched: ${matchedData.title} on Crop: ${matchedData.crop}.\nSymptoms: ${matchedData.symptoms}.\nOrganic Treatment: ${matchedData.treatment}.\nPrevention: ${matchedData.prevention}`;
        } else if (matchedData.type === "practice") {
            contextStr = `Grounding Info: Practice: ${matchedData.title}.\nIngredients: ${matchedData.ingredients}.\nPreparation: ${matchedData.preparation}`;
        } else if (matchedData.type === "seed") {
            contextStr = `Grounding Info: Soil: ${matchedData.title}.\nCrops:\n${matchedData.recommendations}`;
        } else if (matchedData.type === "finance") {
            contextStr = `Grounding Info: Subsidies:\n${matchedData.details}`;
        }
    }
    
    return { contextStr, matchedData };
}

function formatFallbackResponse(query, intent, lang, matchedData) {
    const offlineNote = lang === "hi"
        ? "\n\n*(नोट: AI से कनेक्शन में समस्या। लोकल डेटाबेस परिणाम दिखाए जा रहे हैं)*"
        : (lang === "ta" ? "\n\n*(குறிப்பு: AI இணைப்பு பிழை. உள்ளூர் தரவுத்தளத்தில் இருந்து பதில்கள்)*" : "\n\n*(Note: Running in offline local database mode)*");
    
    if (!matchedData) {
        if (lang === "hi") {
            return `**त्वरित समाधान**: नमस्ते किसान भाई, आपके प्रश्न के लिए हमें डेटाबेस में सटीक रोग या बीज नहीं मिला, लेकिन हम आपको जीवामृत से सामान्य स्वास्थ्य संवर्धन की सलाह देते हैं।
            
**चरण-दर-चरण जैविक विधि**:
- 10 लीटर गोमूत्र, 10 किलो गाय का गोबर, 2 किलो गुड़, और 2 किलो बेसन को 200 लीटर पानी में मिलाएं।
- इसे 5-7 दिनों के लिए छायादार स्थान पर किण्वित (ferment) करें।
- इसे सिंचाई के पानी के साथ या सीधे मिट्टी में छिड़कें। यह मिट्टी की उर्वरता और फसलों की रोग प्रतिरोधक क्षमता को बढ़ाता है।

**भविष्य के लिए बचाव**:
- बुवाई से पहले हमेशा बीजामृत से बीजों का जैविक उपचार करें।
- नियमित रूप से नीम के तेल या नीमास्त्र का छिड़काव करें।` + offlineNote;
        } else if (lang === "ta") {
            return `**விரைவு தீர்வு**: வணக்கம் விவசாயி தோழரே, உங்கள் கேள்விக்கு எங்களது தரவுத்தளத்தில் குறிப்பிட்ட தீர்வு கிடைக்கவில்லை. எனினும், பயிர் வளர்ச்சிக்கு ஜீவாமிர்தம் பயன்படுத்த பரிந்துரைக்கிறோம்.
            
**படி படியான இயற்கை தீர்வு**:
- 10 கிலோ பசு சாணம், 5-10 லிட்டர் கோமியம், 2 கிலோ வெல்லம், 2 கிலோ கடலை மாவு ஆகியவற்றை 200 லிட்டர் தண்ணீரில் கலக்கவும்.
- இதனை நிழலில் 5-7 நாட்கள் புளிக்க வைக்கவும்.
- இந்த கரைசலை பாசன நீருடன் கலந்து அல்லது பயிர்களின் வேர்ப்பகுதியில் தெளிக்கவும்.

**முன்னெச்சரிக்கை நடவடிக்கைகள்**:
- விதை நேர்த்திக்கு பீஜாமிர்தம் பயன்படுத்தவும்.
- பூச்சி தாக்குதலைத் தடுக்க 10 நாட்களுக்கு ஒருமுறை வேப்ப எண்ணெய் தெளிக்கவும்.` + offlineNote;
        } else {
            return `**Quick Answer**: Hello! While we don't have a specific record matching your exact query in our database, applying general organic soil tonics like Jivamrita will boost crop immunity.
            
**Step-by-Step Organic Solution**:
- Mix 10kg fresh cow dung, 5-10L cow urine, 2kg jaggery, and 2kg pulse flour in 200L of water.
- Ferment in shade for 5-7 days under a jute sack, stirring clockwise twice a day.
- Apply this mixture to the soil during watering. It acts as a powerful bio-fertilizer.

**Prevention Steps**:
- Always treat seeds with Bijamrita before planting.
- Rotate crops and avoid planting the same family consecutively.` + offlineNote;
        }
    }
    
    if (matchedData.type === "disease") {
        if (lang === "hi") {
            return `**त्वरित समाधान**: आपकी फसल में **${matchedData.title}** के लक्षण दिखाई दे रहे हैं। यह ${matchedData.crop} की फसल को प्रभावित करता है।
            
**चरण-दर-चरण जैविक विधि**:
${matchedData.treatment}

**भविष्य के लिए बचाव**:
${matchedData.prevention}` + offlineNote;
        } else if (lang === "ta") {
            return `**விரைவு தீர்வு**: உங்கள் பயிரில் **${matchedData.title}** நோய் அறிகுறிகள் தெரிகின்றன. இது ${matchedData.crop} பயிரைத் தாக்குகிறது.
            
**படி படியான இயற்கை தீர்வு**:
${matchedData.treatment}

**முன்னெச்சரிக்கை நடவடிக்கைகள்**:
${matchedData.prevention}` + offlineNote;
        } else {
            return `**Quick Answer**: Your crop shows signs of **${matchedData.title}** on ${matchedData.crop}. This is a fungal/pest issue that can be treated organically.
            
**Step-by-Step Organic Solution**:
${matchedData.treatment}

**Prevention Steps**:
${matchedData.prevention}` + offlineNote;
        }
    } else if (matchedData.type === "practice") {
        if (lang === "hi") {
            return `**त्वरित समाधान**: **${matchedData.title}** की तैयारी और उपयोग की जानकारी निम्नलिखित है:
            
**आवश्यक सामग्री**:
${matchedData.ingredients}

**बनाने की चरण-दर-चरण विधि**:
${matchedData.preparation}` + offlineNote;
        } else if (lang === "ta") {
            return `**விவரம்**: **${matchedData.title}** தயாரிப்பு மற்றும் பயன்பாட்டு முறைகள் கீழே கொடுக்கப்பட்டுள்ளன:
            
**தேவையான பொருட்கள்**:
${matchedData.ingredients}

**படி படியான தயாரிப்பு முறை**:
${matchedData.preparation}` + offlineNote;
        } else {
            return `**Quick Answer**: Here is how you can prepare and use **${matchedData.title}**:
            
**Required Ingredients**:
${matchedData.ingredients}

**Step-by-Step Preparation**:
${matchedData.preparation}` + offlineNote;
        }
    } else if (matchedData.type === "seed") {
        if (lang === "hi") {
            return `**त्वरित समाधान**: **${matchedData.title}** के लिए जैविक बीज चयन और उपचार की जानकारी नीचे दी गई है।
            
**अनुशंसित फसलें और बीज किस्में**:
${matchedData.recommendations}` + offlineNote;
        } else if (lang === "ta") {
            return `**விவரம்**: **${matchedData.title}** மண்ணுக்கு உகந்த இயற்கை விதை தேர்வு மற்றும் நேர்த்தி முறைகள் கீழே உள்ளன.
            
**பரிந்துரைக்கப்படும் பயிர்கள் & ரகங்கள்**:
${matchedData.recommendations}` + offlineNote;
        } else {
            return `**Quick Answer**: Based on your soil (**${matchedData.title}**), here are the organic seed selection and sowing recommendations.
            
**Recommended Crops & Seeds**:
${matchedData.recommendations}` + offlineNote;
        }
    } else if (matchedData.type === "finance") {
        if (lang === "hi") {
            return `**त्वरित समाधान**: सरकारी योजनाओं और सहायता की जानकारी नीचे दी गई है:
            
${matchedData.details}` + offlineNote;
        } else if (lang === "ta") {
            return `**விவரம்**: விவசாய திட்டங்கள் மற்றும் அரசு மானியங்கள் குறித்த விவரங்கள் கீழே உள்ளன:
            
${matchedData.details}` + offlineNote;
        } else {
            return `**Quick Answer**: Here are the details of active government financial schemes and subsidies for natural farming.
            
${matchedData.details}` + offlineNote;
        }
    }
    return "No details found.";
}

// ----------------- SECURE GROQ CHAT COMPLETIONS CLIENT -----------------
function callGroqCompletions(query, systemPrompt, apiKey) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: query }
            ],
            temperature: 0.35,
            max_tokens: 800
        });

        const req = https.request({
            hostname: "api.groq.com",
            path: "/openai/v1/chat/completions",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "Content-Length": Buffer.byteLength(payload)
            }
        }, (res) => {
            let body = "";
            res.on("data", chunk => body += chunk);
            res.on("end", () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const json = JSON.parse(body);
                        resolve(json.choices[0].message.content);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(`Groq returned status ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on("error", (e) => reject(e));
        req.write(payload);
        req.end();
    });
}

// ----------------- HTTP REQUEST ROUTING -----------------
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // 1. Expose secure POST endpoint /api/chat
    if (req.method === 'POST' && req.url === '/api/chat') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const parsed = JSON.parse(body);
                const query = parsed.query || '';
                const lang = parsed.lang || 'en';
                
                const intent = classifyIntent(query);
                const { contextStr, matchedData } = searchLocalKB(query, intent, lang);
                
                const apiKey = process.env.GROQ_API_KEY;
                let responseText = "";
                
                if (apiKey && apiKey.trim()) {
                    try {
                        let systemPrompt = SYSTEM_PROMPTS[lang];
                        if (contextStr) {
                            systemPrompt += `\n\nUse the following verified agricultural database guidelines as grounding context:\n${contextStr}`;
                        }
                        
                        responseText = await callGroqCompletions(query, systemPrompt, apiKey);
                    } catch (groqErr) {
                        console.error("Server: Groq API request timeout or error, executing local database search:", groqErr);
                        responseText = formatFallbackResponse(query, intent, lang, matchedData);
                        responseText += "\n\n*(Note: Secure server connection timeout. Showing local database matching instead)*";
                    }
                } else {
                    responseText = formatFallbackResponse(query, intent, lang, matchedData);
                    responseText += "\n\n*(Note: Running in offline local database mode. Set GROQ_API_KEY in the server .env to activate conversational AI)*";
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ response: responseText }));
                
            } catch (err) {
                console.error("Server: Request handling error:", err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("Internal Server Error");
            }
        });
        return;
    }
    
    // 2. Serve Static Assets from React build folder (dist/)
    let filePath = req.url;
    if (filePath === '/' || filePath === '/index.html') {
        filePath = '/index.html';
    }
    
    const absolutePath = path.join(__dirname, 'dist', filePath);
    const extname = String(path.extname(absolutePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    fs.readFile(absolutePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                // SPA Router fallback: serve index.html for unrecognized routes
                fs.readFile(path.join(__dirname, 'dist', 'index.html'), (errIndex, contentIndex) => {
                    if (errIndex) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end("404 Not Found");
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(contentIndex, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});
module.exports = {
    classifyIntent,
    searchLocalKB,
    callGroqCompletions,
    formatFallbackResponse,
    SYSTEM_PROMPTS
};

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`=== Secure Natural Farming Consultant Backend Server (Node.js) ===`);
        console.log(`Server is running securely at http://localhost:${PORT}`);
        console.log(`Groq API Key status: ${process.env.GROQ_API_KEY ? 'Active (Loaded from .env)' : 'Inactive (No key found in .env)'}`);
        console.log(`Double-click index.html or visit http://localhost:${PORT} in your browser.`);
        console.log(`==================================================================`);
    });
}
