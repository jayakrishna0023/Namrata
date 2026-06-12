import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Send, Volume2, VolumeX, Copy, Bookmark, Settings, 
  FolderOpen, X, AlertTriangle, BookOpen, 
  Leaf, Info, Coins, Sprout, Search, CheckCircle
} from 'lucide-react';
import gsap from 'gsap';
import { DISEASES, SEED_SELECTION, FINANCIAL_SCHEMES, TRANSLATIONS } from './data/farmingData';

interface ChatItem {
  query: string;
  response: string;
  lang: 'en' | 'hi' | 'ta';
  topic?: string;
}

export default function App() {
  // Navigation & Views
  const [view, setView] = useState<'landing' | 'assistant'>('landing');
  const [tab, setTab] = useState<'chat' | 'diseases' | 'seeds' | 'subsidies'>('chat');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'ta'>(
    (localStorage.getItem('vriksha_lang') as 'en' | 'hi' | 'ta') || 'en'
  );
  
  // Chat context topic
  const [chatTopic, setChatTopic] = useState<'general' | 'disease' | 'seed' | 'finance'>('general');

  // Video Background Looping Custom State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);

  // Assistant states
  const [history, setHistory] = useState<ChatItem[]>(
    JSON.parse(localStorage.getItem('vriksha_history') || '[]')
  );
  const [bookmarks, setBookmarks] = useState<ChatItem[]>(
    JSON.parse(localStorage.getItem('vriksha_bookmarks') || '[]')
  );
  const [autoSpeak, setAutoSpeak] = useState<boolean>(
    localStorage.getItem('vriksha_auto_speak') === 'true'
  );
  const [visualizerState, setVisualizerState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [queryInput, setQueryInput] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('...');
  const [isTranscriptActive, setIsTranscriptActive] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [currentUserQuery, setCurrentUserQuery] = useState<string>('');
  
  // Settings & Sidebar Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(
    localStorage.getItem(`vriksha_voice_${currentLanguage}`) || 'default'
  );

  // Tab View specific states
  const [diseaseSearch, setDiseaseSearch] = useState('');
  const [selectedSoil, setSelectedSoil] = useState<'alluvial' | 'black' | 'red'>('alluvial');

  // Speech Recognition object
  const recognitionRef = useRef<any>(null);
  const [isDictating, setIsDictating] = useState(false);

  // Speech synthesis speaking state tracker
  const activeUtterancesRef = useRef<number>(0);

  // Equalizer animation ref
  const eqAnimationId = useRef<number>(0);
  const [eqHeights, setEqHeights] = useState<number[]>([5, 5, 5, 5, 5]);

  // Load translations shortcut
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];

  // Handle Video Background loop and custom opacity fades
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;

    const checkTime = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (duration > 0) {
        // Fade in over 0.5s at the start
        if (currentTime < 0.5) {
          setVideoOpacity(currentTime / 0.5);
        }
        // Fade out over 0.5s before the end
        else if (currentTime > duration - 0.5) {
          setVideoOpacity((duration - currentTime) / 0.5);
        }
        // Solid in the middle
        else {
          setVideoOpacity(1);
        }
      }
      animationFrameId = requestAnimationFrame(checkTime);
    };

    const handlePlay = () => {
      animationFrameId = requestAnimationFrame(checkTime);
    };

    const handlePause = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const handleEnded = () => {
      cancelAnimationFrame(animationFrameId);
      setVideoOpacity(0);
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(err => console.log("Video replay error:", err));
        }
      }, 100);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Initial play attempts
    video.play().catch(err => console.log("Autoplay blocked/waiting for user interaction:", err));

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (video) {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, [view]); // Run when view changes (so video mounts/unmounts correctly)

  // Load voices & initialize STT on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadVoices = () => {
        if (typeof speechSynthesis !== 'undefined') {
          const voices = speechSynthesis.getVoices();
          setSystemVoices(voices);
        }
      };
      loadVoices();
      if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Initialize Speech Recognition
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const rec = new SpeechRecognitionClass();
        rec.continuous = false;
        rec.interimResults = true;

        rec.onstart = () => {
          setIsDictating(true);
          playSound("mic_start");
          setVisualizerState("listening");
          setLiveTranscript("...");
          setIsTranscriptActive(true);
        };

        rec.onend = () => {
          setIsDictating(false);
          setVisualizerState("idle");
        };

        rec.onresult = (event: any) => {
          const resultIndex = event.resultIndex;
          const transcript = event.results[resultIndex][0].transcript;
          setLiveTranscript(transcript);

          if (event.results[resultIndex].isFinal) {
            setQueryInput(transcript);
            setTimeout(() => {
              setIsTranscriptActive(false);
              submitFarmingQuery(transcript);
            }, 500);
          }
        };

        rec.onerror = (event: any) => {
          console.error("STT Dictation error: ", event.error);
          playSound("error");
          setVisualizerState("idle");
          setIsTranscriptActive(false);
          setIsDictating(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Equalizer visualizer wave animation loops
  useEffect(() => {
    const draw = () => {
      if (visualizerState === "speaking" || visualizerState === "listening") {
        setEqHeights(prev => prev.map(() => {
          const maxVal = visualizerState === "speaking" ? 30 : 17;
          const minVal = visualizerState === "speaking" ? 6 : 5;
          return Math.floor(Math.random() * maxVal) + minVal;
        }));
      } else {
        setEqHeights([5, 5, 5, 5, 5]);
      }
      eqAnimationId.current = requestAnimationFrame(draw);
    };

    if (visualizerState === "speaking" || visualizerState === "listening") {
      eqAnimationId.current = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(eqAnimationId.current);
      setEqHeights([5, 5, 5, 5, 5]);
    }

    return () => cancelAnimationFrame(eqAnimationId.current);
  }, [visualizerState]);

  // Entrance animations for Landing page on mount
  useEffect(() => {
    if (view === 'landing') {
      gsap.from('.landing-animate', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  }, [view]);

  // Native Sound Oscillator Synthesizer
  const playSound = (type: string) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
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
      } else if (type === "response_ready") {
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
      } else if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.38);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Text To Speech (TTS)
  const speakResponse = (text: string) => {
    if (typeof speechSynthesis === 'undefined') return;
    speechSynthesis.cancel();

    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/###/g, "")
      .replace(/#/g, "")
      .replace(/-/g, " ");

    const langCode = currentLanguage === "hi" ? "hi-IN" : (currentLanguage === "ta" ? "ta-IN" : "en-US");
    const sentences = cleanText.split(/[.।\n]+/);
    
    activeUtterancesRef.current = 0;
    
    sentences.forEach((sentence) => {
      const trimmed = sentence.trim();
      if (trimmed.length > 0) {
        const utterance = new SpeechSynthesisUtterance(trimmed);
        utterance.lang = langCode;
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        
        const selectedVoiceName = localStorage.getItem(`vriksha_voice_${currentLanguage}`);
        
        if (selectedVoiceName && selectedVoiceName !== 'default') {
          const voiceObj = systemVoices.find(v => v.name === selectedVoiceName);
          if (voiceObj) {
            utterance.voice = voiceObj;
          }
        }
        
        utterance.onstart = () => {
          activeUtterancesRef.current++;
          setVisualizerState("speaking");
        };
        
        utterance.onend = () => {
          activeUtterancesRef.current--;
          if (activeUtterancesRef.current <= 0) {
            setVisualizerState("idle");
          }
        };
        
        utterance.onerror = () => {
          activeUtterancesRef.current--;
          if (activeUtterancesRef.current <= 0) {
            setVisualizerState("idle");
          }
        };
        
        speechSynthesis.speak(utterance);
      }
    });
  };

  // Toggle speech input recording
  const toggleDictation = () => {
    if (!recognitionRef.current) return;
    
    if (isDictating) {
      recognitionRef.current.stop();
    } else {
      if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.cancel();
      }
      const langCode = currentLanguage === "hi" ? "hi-IN" : (currentLanguage === "ta" ? "ta-IN" : "en-US");
      recognitionRef.current.lang = langCode;
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Chat Query Server/Client Dispatches
  const submitFarmingQuery = async (query: string, customTopic?: 'general' | 'disease' | 'seed' | 'finance') => {
    if (!query || !query.trim()) return;

    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    setVisualizerState("thinking");
    setCurrentUserQuery(query);
    setQueryInput('');

    const activeTopic = customTopic || chatTopic;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: query,
          lang: currentLanguage,
          topic: activeTopic
        })
      });

      if (!res.ok) {
        throw new Error(`Server status err: ${res.status}`);
      }

      const data = await res.json();
      const responseText = data.response;

      // Update local storage history
      const newHistory = [...history, { query, response: responseText, lang: currentLanguage, topic: activeTopic }];
      setHistory(newHistory);
      localStorage.setItem("vriksha_history", JSON.stringify(newHistory));

      playSound("response_ready");
      setCurrentResponse(responseText);

      if (autoSpeak) {
        setTimeout(() => {
          speakResponse(responseText);
        }, 800);
      } else {
        setVisualizerState("idle");
      }

    } catch (err) {
      console.error(err);
      playSound("error");

      // Custom offline response mappings
      const queryLower = query.toLowerCase();
      let offlineText = "";

      if (activeTopic === 'disease' || queryLower.includes("yellow") || queryLower.includes("spots") || queryLower.includes("blast") || queryLower.includes("blight") || queryLower.includes("रोग") || queryLower.includes("झुलसा") || queryLower.includes("நோய்")) {
        offlineText = `**Quick Answer:** General organic treatment for diseases consists of Milk-Water spray or Neemastra application.
        
**Step-by-Step Recipe:**
1. Mix 1 part raw milk with 9 parts water.
2. Spray every 10 days on affected crop leaves.

**Caution Note:** Avoid synthetic fungicides and DAP chemical application.`;
      } else if (activeTopic === 'seed' || queryLower.includes("seed") || queryLower.includes("soil") || queryLower.includes("बीज") || queryLower.includes("விதை")) {
        offlineText = `**Quick Answer:** For alluvial loamy soil crops like Rice or Wheat, apply seed treatment before planting.
        
**Step-by-Step Recipe:**
1. Soak seed in Bijamrita solution for 24 hours.
2. Dry in shade before sowing.

**Caution Note:** Avoid sowing untreated commercial hybrids without bio-fertilizers.`;
      } else {
        offlineText = `**Quick Answer:** Connection to conversational server failed. Showing general natural farming guidance.
        
**Step-by-Step Recipe:**
1. Prepare Jivamrita bio-fertilizer.
2. Blend 10kg dung, 10L urine, 2kg jaggery, and 2kg pulse flour in 200L water. Ferment for 5 days.

**Caution Note:** Always prioritize organic soil nourishment.`;
      }

      const newHistory = [...history, { query, response: offlineText, lang: currentLanguage, topic: activeTopic }];
      setHistory(newHistory);
      localStorage.setItem("vriksha_history", JSON.stringify(newHistory));

      setCurrentResponse(offlineText);

      if (autoSpeak) {
        setTimeout(() => {
          speakResponse(offlineText);
        }, 800);
      } else {
        setVisualizerState("idle");
      }
    }
  };

  // Switch tabs cleanly with optional staggered reveals
  const switchTabAnimated = (newTab: 'chat' | 'diseases' | 'seeds' | 'subsidies') => {
    playSound("click");
    setTab(newTab);
    
    // Set chat topic context based on tab selection
    if (newTab === 'diseases') setChatTopic('disease');
    else if (newTab === 'seeds') setChatTopic('seed');
    else if (newTab === 'subsidies') setChatTopic('finance');
    else setChatTopic('general');

    setTimeout(() => {
      gsap.from(".db-card", {
        y: 15,
        opacity: 0,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power1.out'
      });
    }, 50);
  };

  // Specialized Chat Triggers from Database Lists
  const consultAssistantAboutTopic = (queryText: string, topicType: 'general' | 'disease' | 'seed' | 'finance') => {
    playSound("response_ready");
    setTab('chat');
    setChatTopic(topicType);
    submitFarmingQuery(queryText, topicType);
  };

  // Bookmark toggling
  const toggleBookmark = (query: string, response: string) => {
    const existingIndex = bookmarks.findIndex(item => item.query === query);
    const newBookmarks = [...bookmarks];
    if (existingIndex > -1) {
      newBookmarks.splice(existingIndex, 1);
      playSound("click");
    } else {
      newBookmarks.push({ query, response, lang: currentLanguage });
      playSound("response_ready");
    }
    setBookmarks(newBookmarks);
    localStorage.setItem("vriksha_bookmarks", JSON.stringify(newBookmarks));
  };

  const isBookmarked = (query: string) => bookmarks.some(item => item.query === query);

  // HTML response parser
  // Normalize markdown text into professional responsive card components
  const parseMarkdownToSections = (text: string) => {
    const lines = text.split('\n');
    const sections: { title: string; content: string[] }[] = [];
    let currentSection = { title: "", content: [] as string[] };
    
    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
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
  };

  const formatMarkdownTextInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  const formatContentList = (contentLines: string[]) => {
    let htmlElements: React.ReactNode[] = [];
    let currentListItems: string[] = [];
    let currentListType: 'ol' | 'ul' | null = null;
    
    contentLines.forEach((line, idx) => {
      const trimmed = line.trim();
      const olMatch = trimmed.match(/^\d+[\.\)]\s*(.*)/);
      const ulMatch = trimmed.match(/^[\*\-]\s*(.*)/);

      if (olMatch) {
        if (currentListType === 'ul') {
          htmlElements.push(
            <ul key={`ul-${idx}`} className="list-disc pl-6 mb-4 space-y-2 text-slate-800">
              {currentListItems.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: formatMarkdownTextInline(item) }} />)}
            </ul>
          );
          currentListItems = [];
        }
        currentListType = 'ol';
        currentListItems.push(olMatch[1]);
      } else if (ulMatch) {
        if (currentListType === 'ol') {
          htmlElements.push(
            <ol key={`ol-${idx}`} className="list-decimal pl-6 mb-4 space-y-2 text-slate-800">
              {currentListItems.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: formatMarkdownTextInline(item) }} />)}
            </ol>
          );
          currentListItems = [];
        }
        currentListType = 'ul';
        currentListItems.push(ulMatch[1]);
      } else {
        if (currentListType) {
          if (currentListType === 'ol') {
            htmlElements.push(
              <ol key={`ol-end-${idx}`} className="list-decimal pl-6 mb-4 space-y-2 text-slate-800">
                {currentListItems.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: formatMarkdownTextInline(item) }} />)}
              </ol>
            );
          } else {
            htmlElements.push(
              <ul key={`ul-end-${idx}`} className="list-disc pl-6 mb-4 space-y-2 text-slate-800">
                {currentListItems.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: formatMarkdownTextInline(item) }} />)}
              </ul>
            );
          }
          currentListType = null;
          currentListItems = [];
        }
        htmlElements.push(
          <p key={`p-${idx}`} className="mb-3 text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMarkdownTextInline(trimmed) }} />
        );
      }
    });

    if (currentListType) {
      if (currentListType === 'ol') {
        htmlElements.push(
          <ol key={`ol-final`} className="list-decimal pl-6 mb-4 space-y-2 text-slate-800">
            {currentListItems.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: formatMarkdownTextInline(item) }} />)}
          </ol>
        );
      } else {
        htmlElements.push(
          <ul key={`ul-final`} className="list-disc pl-6 mb-4 space-y-2 text-slate-800">
            {currentListItems.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: formatMarkdownTextInline(item) }} />)}
          </ul>
        );
      }
    }

    return htmlElements;
  };

  const renderResponseCards = (text: string) => {
    const sections = parseMarkdownToSections(text);
    return (
      <div className="flex flex-col gap-6 mt-4 text-left">
        {sections.map((sec, idx) => {
          const titleLower = sec.title.toLowerCase();
          let cardClass = "border-l-4 border-l-slate-400 bg-slate-50 border border-black/5";
          let icon = <Info className="w-5 h-5 text-slate-500" />;
          let titleColor = "text-slate-800 font-bold";

          if (/answer|solution|உபாயம்|விவரம்|समाधान|त्वरित/i.test(titleLower)) {
            cardClass = "border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-500/10";
            icon = <CheckCircle className="w-5 h-5 text-emerald-600" />;
            titleColor = "text-emerald-700 font-bold";
          } else if (/recipe|method|preparation|विधि|தயாரிப்பு|முறை/i.test(titleLower)) {
            cardClass = "border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-transparent border border-sky-500/10";
            icon = <BookOpen className="w-5 h-5 text-sky-600" />;
            titleColor = "text-sky-700 font-bold";
          } else if (/caution|warning|எச்சரிக்கை|சாவி|ஆபத்து|சாவி/i.test(titleLower) || titleLower.includes("caution")) {
            cardClass = "border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-50 to-transparent border border-rose-500/10";
            icon = <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />;
            titleColor = "text-rose-700 font-bold";
          } else if (/tip|prevent|ingredient|variety|crop|முன்னெச்சரிக்கை|பொருட்கள்|பயிர்|सामग्री|बचाव/i.test(titleLower)) {
            cardClass = "border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-transparent border border-amber-500/10";
            icon = <Leaf className="w-5 h-5 text-amber-600" />;
            titleColor = "text-amber-700 font-bold";
          }

          return (
            <div key={idx} className={`p-6 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.01] ${cardClass}`}>
              {sec.title && (
                <div className="flex items-center gap-3 pb-3 mb-3 border-b border-black/5">
                  {icon}
                  <h3 className={`text-base font-bold tracking-wide ${titleColor}`}>{sec.title}</h3>
                </div>
              )}
              <div className="text-sm font-normal">
                {formatContentList(sec.content)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Settings language change trigger
  const handleLangChange = (lang: 'en' | 'hi' | 'ta') => {
    playSound("click");
    setCurrentLanguage(lang);
    localStorage.setItem("vriksha_lang", lang);
    setSelectedVoice('default');
  };

  const handleVoiceSave = () => {
    playSound("response_ready");
    localStorage.setItem(`vriksha_voice_${currentLanguage}`, selectedVoice);
    setSettingsOpen(false);
  };

  // Filter local diseases array
  const filteredDiseases = Object.values(DISEASES).filter(d => 
    d.names[currentLanguage].toLowerCase().includes(diseaseSearch.toLowerCase()) ||
    d.crop[currentLanguage].toLowerCase().includes(diseaseSearch.toLowerCase()) ||
    d.symptoms[currentLanguage].toLowerCase().includes(diseaseSearch.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white font-sans text-black">
      
      {/* 1. Cinematic Background Video Layer (z-0) */}
      {view === 'landing' && (
        <>
          <video
            ref={videoRef}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
            muted
            playsInline
            className="absolute left-0 right-0 w-full h-[calc(100vh-300px)] object-cover pointer-events-none z-0"
            style={{ top: '300px', opacity: videoOpacity, transition: 'opacity 0.1s linear' }}
          />
          {/* Video Gradient Overlay */}
          <div 
            className="absolute left-0 right-0 bottom-0 h-[calc(100vh-300px)] bg-gradient-to-b from-white via-transparent to-white pointer-events-none z-1"
            style={{ top: '300px' }}
          />
        </>
      )}

      {/* 2. Glassmorphic App Core Container (z-10) */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col min-h-screen">
        
        {/* Navigation Bar */}
        <header className="flex justify-between items-center px-8 py-6 w-full">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-serif tracking-tight text-black cursor-pointer flex items-baseline" onClick={() => setView('landing')}>
              Namrata<span className="font-sans text-[10px] text-emerald-600 font-bold tracking-wider uppercase ml-2">Connecting Dreams</span>
            </span>
            {view === 'assistant' && (
              <span className="hidden sm:inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Namrata 🌱
              </span>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => { playSound("click"); setView('landing'); }} 
              className={`text-sm font-medium transition-colors ${view === 'landing' ? 'text-black' : 'text-[#6F6F6F] hover:text-black'}`}
            >
              Home
            </button>
            <button onClick={() => { setView('assistant'); switchTabAnimated('chat'); }} className="text-sm font-medium text-[#6F6F6F] hover:text-black transition-colors">Advisor</button>
            <button onClick={() => { setView('assistant'); switchTabAnimated('diseases'); }} className="text-sm font-medium text-[#6F6F6F] hover:text-black transition-colors">Diseases</button>
            <button onClick={() => { setView('assistant'); switchTabAnimated('seeds'); }} className="text-sm font-medium text-[#6F6F6F] hover:text-black transition-colors">Seeds</button>
            <button onClick={() => { setView('assistant'); switchTabAnimated('subsidies'); }} className="text-sm font-medium text-[#6F6F6F] hover:text-black transition-colors">Schemes</button>
          </nav>

          <div className="flex items-center gap-3">
            {view === 'assistant' && (
              <>
                <select 
                  value={currentLanguage} 
                  onChange={(e) => handleLangChange(e.target.value as 'en' | 'hi' | 'ta')}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-black/5 border border-black/10 text-black outline-none cursor-pointer hover:bg-black/10 transition-colors"
                  aria-label="Select Language"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="hi">🇮🇳 हिंदी (Hindi)</option>
                  <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
                </select>

                <button 
                  onClick={() => { playSound("click"); setDrawerOpen(true); }}
                  className="p-2 rounded-full border border-black/10 hover:bg-black/5 transition-colors text-[#6F6F6F] hover:text-black"
                  title="Saved Queries"
                  aria-label="Open History Drawer"
                >
                  <FolderOpen className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { playSound("click"); setSettingsOpen(true); }}
                  className="p-2 rounded-full border border-black/10 hover:bg-black/5 transition-colors text-[#6F6F6F] hover:text-black"
                  title="Voice Settings"
                  aria-label="Open Settings Modal"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            )}

            <button 
              onClick={() => { playSound("response_ready"); setView(view === 'landing' ? 'assistant' : 'landing'); }}
              className="rounded-full px-6 py-2.5 text-sm font-medium bg-black text-white hover:scale-103 transition-transform duration-250 cursor-pointer shadow-md animate-fade-rise"
            >
              {view === 'landing' ? 'Begin Journey' : 'Back Home'}
            </button>
          </div>
        </header>

        {/* VIEW 1: CINEMATIC LANDING HERO */}
        {view === 'landing' && (
          <main className="flex-1 flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: 'calc(8rem - 75px)' }}>
            <h1 className="landing-animate text-5xl sm:text-7xl md:text-8xl max-w-7xl font-sans font-extrabold leading-[1.05] tracking-tight text-black">
              Nurturing the <span className="italic text-emerald-600">earth,</span> <br />connecting <span className="italic text-slate-500">dreams.</span>
            </h1>
            
            <p className="landing-animate text-base sm:text-lg text-[#6F6F6F] max-w-2xl mt-8 leading-relaxed">
              Namrata is a voice-guided intelligent assistant for organic and natural farming. We connect ancient ecological wisdom with conversational AI to empower growers, restore crop health, and nurture the living soil.
            </p>

            <button 
              onClick={() => { playSound("response_ready"); setView('assistant'); }}
              className="landing-animate rounded-full px-14 py-5 text-base font-semibold bg-black text-white hover:bg-emerald-700 hover:scale-103 transition-all duration-250 mt-12 cursor-pointer shadow-lg"
            >
              Begin Journey
            </button>
          </main>
        )}

        {/* VIEW 2: VOICE ASSISTANT STUDIO */}
        {view === 'assistant' && (
          <main className="flex-1 flex flex-col px-6 py-4 max-w-5xl mx-auto w-full gap-6">
            
            {/* Segmented Navigation Tab Header */}
            <nav className="flex w-full bg-black/5 p-1 rounded-full border border-black/10 mb-4" aria-label="Main Navigation Tabs">
              <button 
                onClick={() => switchTabAnimated('chat')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold transition-all ${tab === 'chat' ? 'bg-black text-white shadow-sm' : 'text-[#6F6F6F] hover:text-black'}`}
              >
                <Mic className="w-3.5 h-3.5" />
                Chat Advisor
              </button>
              <button 
                onClick={() => switchTabAnimated('diseases')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold transition-all ${tab === 'diseases' ? 'bg-black text-white shadow-sm' : 'text-[#6F6F6F] hover:text-black'}`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Disease Finder
              </button>
              <button 
                onClick={() => switchTabAnimated('seeds')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold transition-all ${tab === 'seeds' ? 'bg-black text-white shadow-sm' : 'text-[#6F6F6F] hover:text-black'}`}
              >
                <Sprout className="w-3.5 h-3.5" />
                Seed Advisor
              </button>
              <button 
                onClick={() => switchTabAnimated('subsidies')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold transition-all ${tab === 'subsidies' ? 'bg-black text-white shadow-sm' : 'text-[#6F6F6F] hover:text-black'}`}
              >
                <Coins className="w-3.5 h-3.5" />
                Subsidies & Schemes
              </button>
            </nav>

            {/* TAB PANES */}
            
            {/* TAB 1: CHAT ADVISOR */}
            {tab === 'chat' && (
              <div className="flex flex-col gap-6 flex-1">
                
                {/* Onboarding Welcome Panel */}
                {!currentUserQuery && (
                  <div className="bg-black/5 border border-black/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center backdrop-blur-md max-w-3xl mx-auto w-full my-auto">
                    <span className="text-4xl mb-4">👩‍🌾</span>
                    <h2 className="text-2xl font-serif text-black mb-2">{t.empty_state_header}</h2>
                    <p className="text-[#6F6F6F] text-sm max-w-lg mb-8">{t.empty_state_desc}</p>
                    
                    <div className="w-full border-t border-black/10 pt-6">
                      <h3 className="text-[#6F6F6F] text-xs font-bold uppercase tracking-wider mb-4">{t.onboarding_title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div 
                          onClick={() => switchTabAnimated('diseases')}
                          className="p-5 bg-white border border-black/10 rounded-2xl text-left cursor-pointer hover:border-black hover:scale-[1.02] transition-all"
                        >
                          <Leaf className="w-5 h-5 text-[#6F6F6F] mb-3" />
                          <h4 className="font-semibold text-sm mb-1">Disease Remedies</h4>
                          <p className="text-xs text-[#6F6F6F] leading-relaxed">Identify crop diseases and get organic treatments.</p>
                        </div>
                        <div 
                          onClick={() => switchTabAnimated('seeds')}
                          className="p-5 bg-white border border-black/10 rounded-2xl text-left cursor-pointer hover:border-black hover:scale-[1.02] transition-all"
                        >
                          <Sprout className="w-5 h-5 text-[#6F6F6F] mb-3" />
                          <h4 className="font-semibold text-sm mb-1">Seed Advisor</h4>
                          <p className="text-xs text-[#6F6F6F] leading-relaxed">Get organic seed recommendation per soil type.</p>
                        </div>
                        <div 
                          onClick={() => switchTabAnimated('subsidies')}
                          className="p-5 bg-white border border-black/10 rounded-2xl text-left cursor-pointer hover:border-black hover:scale-[1.02] transition-all"
                        >
                          <Coins className="w-5 h-5 text-[#6F6F6F] mb-3" />
                          <h4 className="font-semibold text-sm mb-1">Subsidies Guide</h4>
                          <p className="text-xs text-[#6F6F6F] leading-relaxed">Explore active farming plans and subsidies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Query Output Response Board */}
                {currentUserQuery && (
                  <div className="bg-white text-black border border-black/10 rounded-3xl p-8 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between">
                    
                    {/* Animated aura inside white card */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="bg-black/5 border border-black/10 px-4 py-2.5 rounded-2xl text-xs text-black/75 max-w-max mb-6 flex items-center gap-2 font-medium">
                        <span>🗣️</span>
                        <span>{currentUserQuery}</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-black/10 pb-4 mb-4">
                        <h2 className="text-xl font-serif text-black tracking-wide">{t.response_title}</h2>
                        {chatTopic !== 'general' && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                            {chatTopic} topic context
                          </span>
                        )}
                      </div>

                      {/* Render structured responses */}
                      <div className="max-h-[calc(100vh-420px)] overflow-y-auto pr-2">
                        {renderResponseCards(currentResponse)}
                      </div>
                    </div>

                    <div className="relative z-10 flex gap-3 mt-6 border-t border-black/10 pt-5 flex-wrap">
                      <button 
                        onClick={() => { playSound("click"); speakResponse(currentResponse); }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all ${visualizerState === 'speaking' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-700' : 'bg-black/5 border-black/10 text-black hover:bg-black/10 hover:border-black/20'}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {visualizerState === 'speaking' ? 'Assistant Speaking' : t.speak_btn}
                      </button>
                      <button 
                        onClick={() => { playSound("click"); if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel(); setVisualizerState("idle"); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-black/5 border border-black/10 text-black hover:bg-black/10 hover:border-black/20 transition-all"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                        {t.stop_btn}
                      </button>
                      <button 
                        onClick={() => { playSound("click"); navigator.clipboard.writeText(currentResponse); alert(t.copied_alert); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-black/5 border border-black/10 text-black hover:bg-black/10 hover:border-black/20 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {t.copy_btn}
                      </button>
                      <button 
                        onClick={() => toggleBookmark(currentUserQuery, currentResponse)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all ${isBookmarked(currentUserQuery) ? 'bg-amber-500/20 border-amber-400 text-amber-700' : 'bg-black/5 border-black/10 text-black hover:bg-black/10 hover:border-black/20'}`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        {t.bookmark_btn}
                      </button>
                    </div>
                  </div>
                )}

                {/* Voice Console (Orb & Input Row) */}
                <div className="bg-black/5 border border-black/10 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center gap-6 mt-auto">
                  
                  {/* Visualizer Orb */}
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {/* Pulsing visualizer background */}
                    <div className={`absolute w-36 h-36 rounded-full bg-emerald-500/10 filter blur-[8px] transition-all duration-500 ${visualizerState === 'listening' ? 'scale-115 bg-rose-500/15' : visualizerState === 'thinking' ? 'animate-pulse' : 'scale-100'}`} />
                    
                    {/* SVG Blobs (controlled via classes and animation loops) */}
                    <svg className="absolute w-40 h-40 pointer-events-none z-10" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" className={`fill-emerald-500/10 stroke-emerald-500/20 stroke-1 transition-all duration-700 ${visualizerState === 'listening' ? 'stroke-rose-500/40 fill-rose-500/5 scale-105' : visualizerState === 'thinking' ? 'scale-90 stroke-emerald-400' : 'scale-100 animate-pulse'}`} />
                      <circle cx="50" cy="50" r="32" className={`fill-emerald-400/15 stroke-emerald-400/30 stroke-1 transition-all duration-700 ${visualizerState === 'listening' ? 'stroke-rose-400/40 fill-rose-400/5 scale-102' : visualizerState === 'thinking' ? 'scale-95' : 'scale-100'}`} />
                    </svg>

                    {/* Thinking Loader dashed spinner */}
                    {visualizerState === 'thinking' && (
                      <div className="absolute w-[100px] h-[100px] rounded-full border-2 border-dashed border-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />
                    )}

                    {/* Central mic core button */}
                    <button 
                      onClick={toggleDictation}
                      className={`absolute w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-20 ${visualizerState === 'listening' ? 'bg-gradient-to-br from-rose-500 to-rose-700 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-br from-black to-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.25)] hover:scale-105'}`}
                      aria-label="Microphone Voice Input"
                    >
                      <Mic className={`w-7 h-7 ${visualizerState === 'listening' ? 'text-white' : 'text-emerald-400'}`} />
                    </button>

                    {/* Equalizer Waves */}
                    <div className={`absolute bottom-0 flex gap-1 h-6 items-end transition-opacity duration-300 ${visualizerState === 'speaking' || visualizerState === 'listening' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      {eqHeights.map((h, i) => (
                        <div 
                          key={i} 
                          className={`w-1 rounded-full transition-all duration-75 ${visualizerState === 'listening' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Status labels */}
                  <div className="text-center">
                    <p className="text-sm font-semibold text-black">
                      {visualizerState === 'listening' ? t.status_listening : visualizerState === 'thinking' ? t.status_thinking : visualizerState === 'speaking' ? t.status_speaking : t.status_idle}
                    </p>
                    {chatTopic !== 'general' && (
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">Chatting about: {chatTopic}</p>
                    )}
                  </div>

                  {/* Live speech transcribing subtitles bubble */}
                  {isTranscriptActive && (
                    <div className="px-6 py-2.5 rounded-2xl bg-black/5 border border-black/10 text-xs text-rose-500 font-medium max-w-sm text-center animate-pulse">
                      {liveTranscript}
                    </div>
                  )}

                  {/* Autoplay toggles & Text inputs */}
                  <div className="w-full flex flex-col gap-4 border-t border-black/10 pt-6">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-xs font-semibold text-[#6F6F6F]">{t.auto_speak_label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={autoSpeak} 
                          onChange={(e) => { playSound("click"); setAutoSpeak(e.target.checked); localStorage.setItem("vriksha_auto_speak", String(e.target.checked)); }} 
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && submitFarmingQuery(queryInput)}
                        className="flex-1 bg-white border border-black/10 rounded-full px-5 py-3 text-sm text-black placeholder-black/30 outline-none focus:border-black transition-colors"
                        placeholder={t.input_placeholder}
                        aria-label="Text Query"
                      />
                      <button 
                        onClick={() => submitFarmingQuery(queryInput)}
                        className="p-3 rounded-full bg-black text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        aria-label="Send query"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: DISEASE FINDER */}
            {tab === 'diseases' && (
              <div className="flex flex-col gap-6">
                <div className="bg-black/5 border border-black/10 rounded-3xl p-6 backdrop-blur-md">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-black/30" />
                    <input 
                      type="text" 
                      value={diseaseSearch}
                      onChange={(e) => setDiseaseSearch(e.target.value)}
                      className="w-full bg-white border border-black/10 rounded-full pl-11 pr-5 py-3 text-sm text-black placeholder-black/30 outline-none focus:border-black transition-colors"
                      placeholder={t.search_db_placeholder}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDiseases.map((d) => (
                    <div key={d.id} className="db-card bg-black/5 border border-black/10 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-md">
                      <div>
                        <div className="flex justify-between items-start mb-3 border-b border-black/5 pb-2">
                          <h3 className="text-lg font-serif font-bold text-black">{d.names[currentLanguage]}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6F6F] bg-black/5 px-2 py-0.5 rounded">
                            {d.crop[currentLanguage]}
                          </span>
                        </div>
                        <p className="text-xs text-[#6F6F6F] leading-relaxed mb-3">
                          <strong>{currentLanguage === 'hi' ? 'लक्षण' : (currentLanguage === 'ta' ? 'அறிகுறிகள்' : 'Symptoms')}:</strong> {d.symptoms[currentLanguage]}
                        </p>
                        <p className="text-xs text-[#6F6F6F] leading-relaxed mb-3">
                          <strong>{currentLanguage === 'hi' ? 'जैविक उपचार' : (currentLanguage === 'ta' ? 'இயற்கை தீர்வு' : 'Remedy')}:</strong> {d.treatment[currentLanguage]}
                        </p>
                        <p className="text-xs text-[#6F6F6F] leading-relaxed">
                          <strong>{currentLanguage === 'hi' ? 'बचाव' : (currentLanguage === 'ta' ? 'முன்னெச்சரிக்கை' : 'Prevention')}:</strong> {d.prevention[currentLanguage]}
                        </p>
                      </div>

                      {/* CONVERSATIONAL BUTTON TRIGGER */}
                      <button 
                        onClick={() => consultAssistantAboutTopic(
                          currentLanguage === 'hi' ? `${d.names.hi} धान का रोग का उपचार क्या है?` : (currentLanguage === 'ta' ? `${d.names.ta} நோய் தீர்வு முறைகள் என்ன?` : `How do I treat ${d.names.en} organically?`),
                          'disease'
                        )}
                        className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold bg-black text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        Consult Namrata about this Disease
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SEED ADVISOR */}
            {tab === 'seeds' && (
              <div className="flex flex-col gap-6">
                
                <div className="bg-black/5 border border-black/10 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
                  <span className="text-sm font-semibold text-[#6F6F6F]">{t.soil_label}:</span>
                  <div className="flex flex-wrap gap-2">
                    {(['alluvial', 'black', 'red'] as const).map((soil) => (
                      <button 
                        key={soil}
                        onClick={() => { playSound("click"); setSelectedSoil(soil); }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedSoil === soil ? 'bg-black text-white border-black' : 'bg-white text-[#6F6F6F] border-black/10 hover:border-black'}`}
                      >
                        {SEED_SELECTION[soil].soil_name[currentLanguage]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(SEED_SELECTION[selectedSoil].crops).map(([cropName, details]) => (
                    <div key={cropName} className="db-card bg-black/5 border border-black/10 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-md">
                      <div>
                        <div className="flex justify-between items-start mb-3 border-b border-black/5 pb-2">
                          <h3 className="text-lg font-serif font-bold text-black">{cropName}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F6F6F] bg-black/5 px-2 py-0.5 rounded">
                            {SEED_SELECTION[selectedSoil].soil_name[currentLanguage]}
                          </span>
                        </div>
                        <p className="text-xs text-[#6F6F6F] leading-relaxed mb-3">
                          <strong>{currentLanguage === 'hi' ? 'बीज की किस्में' : (currentLanguage === 'ta' ? 'விதை ரகங்கள்' : 'Varieties')}:</strong> {details.varieties}
                        </p>
                        <p className="text-xs text-[#6F6F6F] leading-relaxed mb-3">
                          <strong>{currentLanguage === 'hi' ? 'बुवाई का मौसम' : (currentLanguage === 'ta' ? 'விதைப்பு பருவம்' : 'Season')}:</strong> {details.sowing_season[currentLanguage]}
                        </p>
                        <p className="text-xs text-[#6F6F6F] leading-relaxed">
                          <strong>{currentLanguage === 'hi' ? 'जैविक बीज उपचार' : (currentLanguage === 'ta' ? 'விதை நேர்த்தி' : 'Seed Prep')}:</strong> {details.organic_prep[currentLanguage]}
                        </p>
                      </div>

                      {/* CONVERSATIONAL BUTTON TRIGGER */}
                      <button 
                        onClick={() => consultAssistantAboutTopic(
                          currentLanguage === 'hi' ? `${SEED_SELECTION[selectedSoil].soil_name.hi} के लिए ${cropName} जैविक बीज चयन सलाह` : (currentLanguage === 'ta' ? `${SEED_SELECTION[selectedSoil].soil_name.ta} மண்ணில் ${cropName} விதை தேர்வு முறை` : `What crop varieties and prep are recommended for ${cropName} in ${SEED_SELECTION[selectedSoil].soil_name.en}?`),
                          'seed'
                        )}
                        className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold bg-black text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        Consult Namrata about Seeds
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 4: SUBSIDIES & SCHEMES */}
            {tab === 'subsidies' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FINANCIAL_SCHEMES.map((scheme, idx) => (
                  <div key={idx} className="db-card bg-black/5 border border-black/10 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-md">
                    <div>
                      <div className="mb-3 border-b border-black/5 pb-2">
                        <h3 className="text-lg font-serif font-bold text-black">{scheme.name[currentLanguage]}</h3>
                      </div>
                      <p className="text-xs text-[#6F6F6F] leading-relaxed mb-3">
                        <strong>{currentLanguage === 'hi' ? 'विवरण' : (currentLanguage === 'ta' ? 'விவரம்' : 'Details')}:</strong> {scheme.details[currentLanguage]}
                      </p>
                      <p className="text-xs text-[#6F6F6F] leading-relaxed">
                        <strong>{currentLanguage === 'hi' ? 'पात्रता' : (currentLanguage === 'ta' ? 'தகுதி' : 'Eligibility')}:</strong> {scheme.eligibility[currentLanguage]}
                      </p>
                    </div>

                    {/* CONVERSATIONAL BUTTON TRIGGER */}
                    <button 
                      onClick={() => consultAssistantAboutTopic(
                        currentLanguage === 'hi' ? `मुझे ${scheme.name.hi} सरकारी योजना के बारे में जानकारी चाहिए` : (currentLanguage === 'ta' ? `${scheme.name.ta} திட்ட விவரங்கள் என்ன?` : `Explain details and eligibility for ${scheme.name.en}`),
                        'finance'
                      )}
                      className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold bg-black text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      Consult Namrata about this Scheme
                    </button>
                  </div>
                ))}
              </div>
            )}

          </main>
        )}

        {/* Footer */}
        <footer className="w-full text-center py-6 text-xs text-[#6F6F6F] border-t border-black/5 mt-auto">
          {t.footer}
        </footer>

      </div>

      {/* 3. Slide-out History and Bookmarks Drawer */}
      <div 
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
      />
      <div className={`fixed top-0 right-0 h-full w-[320px] bg-white border-l border-black/10 z-50 transition-transform duration-350 p-6 flex flex-col gap-6 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center border-b border-black/10 pb-4">
          <h2 className="text-base font-serif font-bold text-black">{t.sidebar_history}</h2>
          <button 
            onClick={() => setDrawerOpen(false)} 
            className="p-1.5 rounded-full hover:bg-black/5 text-[#6F6F6F] hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#6F6F6F] mb-3">{t.sidebar_history_title}</h3>
            {history.length === 0 ? (
              <p className="text-xs text-[#6F6F6F] italic px-2">{t.no_history}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {history.slice().reverse().map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setCurrentUserQuery(item.query);
                      setCurrentResponse(item.response);
                      setCurrentLanguage(item.lang);
                      setChatTopic((item.topic as any) || 'general');
                      setTab('chat');
                      setDrawerOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl border border-black/5 text-xs text-[#6F6F6F] hover:text-black hover:border-black hover:bg-black/5 transition-all truncate"
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#6F6F6F] mb-3">{t.sidebar_bookmarks_title}</h3>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-[#6F6F6F] italic px-2">{t.no_bookmarks}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {bookmarks.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setCurrentUserQuery(item.query);
                      setCurrentResponse(item.response);
                      setCurrentLanguage(item.lang);
                      setTab('chat');
                      setDrawerOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl border border-black/5 text-xs text-[#6F6F6F] hover:text-black hover:border-black hover:bg-black/5 transition-all truncate"
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Voice Assistant Selector Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-black/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-black/10 pb-3">
              <h2 className="text-base font-serif font-bold text-black">{t.setting_title}</h2>
              <button 
                onClick={() => setSettingsOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#6F6F6F] hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="voice-select" className="text-xs font-semibold text-[#6F6F6F]">
                {t.voice_select_label}
              </label>
              <select 
                id="voice-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-black/10 text-xs text-black outline-none bg-white focus:border-black cursor-pointer"
              >
                <option value="default">Default System Accent</option>
                {systemVoices
                  .filter(voice => {
                    const filter = currentLanguage === 'hi' ? 'hi' : (currentLanguage === 'ta' ? 'ta' : 'en');
                    return voice.lang.toLowerCase().startsWith(filter);
                  })
                  .map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
              </select>
              <p className="text-[10px] text-[#6F6F6F] leading-relaxed mt-1">
                {t.api_key_help}
              </p>
            </div>

            <button 
              onClick={handleVoiceSave}
              className="w-full py-3 rounded-full text-xs font-bold bg-black text-white hover:bg-slate-800 transition-colors mt-2 cursor-pointer shadow-md"
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
