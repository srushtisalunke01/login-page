import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, Mic, MicOff } from 'lucide-react';
import { useNexusStore } from '../../store/nexusStore';
import { sounds } from '../../utils/sounds';
import { PRODUCTS } from '../products/productsData';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  compareResult?: any[];
  recsResult?: any[];
}

const PRESET_PROMPTS = [
  { label: 'Recommend Smart Watches', query: 'Recommend a premium smart watch.' },
  { label: 'Compare Phones', query: 'Compare iPhones vs Android Phones.' },
  { label: 'Track Order', query: 'Track my active orders.' },
  { label: 'Clearence Coupons', query: 'What active coupons are available?' }
];

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const { soundEnabled, orders } = useNexusStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'SYSTEM ONLINE. Neural AI Assistant initialized. Ask me to compare products, recommend collections, search items, or track your shipments.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Speech Recognition Hook Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition API not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const playToggleSound = () => {
    if (soundEnabled) {
      sounds.playClick();
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { sender: 'user', text, timestamp };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    if (soundEnabled) {
      sounds.playClick();
    }

    setTimeout(() => {
      let aiText = "SYSTEM COGNITIVE FEED: Query processed. No matching categories found. Try asking for 'compare phones' or 'recommend smart watches'.";
      let compareResult: any[] | undefined = undefined;
      let recsResult: any[] | undefined = undefined;

      const query = text.toLowerCase();

      // 1. Order Tracking Handler
      if (query.includes('track') || query.includes('order') || query.includes('shipment')) {
        if (orders.length === 0) {
          aiText = "SYSTEM LEDGER CHECK: You currently have no active orders queued. Browse our collection and check out securely!";
        } else {
          aiText = `SYSTEM LOGISTICS UPDATE:\nWe found ${orders.length} active shipments in your queue:\n` + 
            orders.map(o => `• Node ${o.id}: ${o.name} is currently [${o.status.toUpperCase()}]. Date docked: ${o.date}.`).join('\n');
        }
      } 
      // 2. Coupon Queries
      else if (query.includes('coupon') || query.includes('discount') || query.includes('offer') || query.includes('savings')) {
        aiText = "ACTIVE SYSTEM COUPONS CALIBRATED:\n• FESTIVAL-30: 30% discount on all purchases.\n• GOLD-VIP: 25% exclusive reduction.\n• NEXUS-STUDENT: 15% discount for academic members.\n• WELCOME-NEXUS: 10% first-time customer voucher.";
      }
      // 3. Side-by-side Product Comparison
      else if (query.includes('compare') || query.includes('versus') || query.includes('vs')) {
        // Dynamic search for items
        if (query.includes('phone') || query.includes('iphone') || query.includes('android')) {
          aiText = "COMPARISON LEDGER: Comparing top electronic mobile nodes side-by-side:";
          compareResult = PRODUCTS.filter(p => p.subcategory === 'iPhones' || p.subcategory === 'Android Phones').slice(0, 2);
        } else if (query.includes('watch') || query.includes('smartwatch')) {
          aiText = "COMPARISON LEDGER: Comparing premium temporal smartwatch nodes side-by-side:";
          compareResult = PRODUCTS.filter(p => p.subcategory === 'Smart Watches').slice(0, 2);
        } else {
          aiText = "COMPARISON LEDGER: Comparing featured catalog nodes side-by-side:";
          compareResult = PRODUCTS.slice(0, 2);
        }
      }
      // 4. Recommendation Queries
      else if (query.includes('recommend') || query.includes('best') || query.includes('suggest') || query.includes('deals')) {
        if (query.includes('watch') || query.includes('smartwatch')) {
          aiText = "AI RECOMMENDATIONS:\nHere are top rated smart watches selected for your VIP status:";
          recsResult = PRODUCTS.filter(p => p.subcategory === 'Smart Watches').slice(0, 3);
        } else if (query.includes('laptop') || query.includes('macbook')) {
          aiText = "AI RECOMMENDATIONS:\nWe recommend these high-capacity laptops for engineering and design layouts:";
          recsResult = PRODUCTS.filter(p => p.subcategory === 'Laptops' || p.subcategory === 'MacBooks').slice(0, 3);
        } else if (query.includes('shoe') || query.includes('sneaker') || query.includes('nike')) {
          aiText = "AI RECOMMENDATIONS:\nInspect these top-tier athletic sneakers and running shoes:";
          recsResult = PRODUCTS.filter(p => p.subcategory === 'Shoes' || p.subcategory === 'Sneakers').slice(0, 3);
        } else {
          aiText = "AI RECOMMENDATIONS:\nHere are trending clearance items matching popular searches:";
          recsResult = PRODUCTS.slice(5, 8);
        }
      }
      // 5. Basic greetings
      else if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('assistant')) {
        aiText = "Greetings Operator. I am ready. Ask me to compare products, recommend gear, track shippings, or list promo discount codes.";
      }

      const aiMsg: Message = {
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        compareResult,
        recsResult
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      if (soundEnabled) {
        sounds.playSuccess();
      }
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans select-none">
      
      {/* Floating Toggle Bubble */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          playToggleSound();
        }}
        className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-slate-800 hover:text-[#d4af37] hover:border-[#d4af37]/40 cursor-pointer shadow-md transition-all duration-300 active:scale-95 animate-bounce"
        style={{ animationDuration: '4s' }}
      >
        {isOpen ? <X className="w-5 h-5 text-nexus-magenta" /> : <MessageSquare className="w-5 h-5 text-[#d4af37]" />}
      </button>

      {/* Upgraded Chatbox Pane */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="absolute bottom-16 right-0 w-80 md:w-[420px] h-[520px] bg-white rounded-2xl border border-slate-200 flex flex-col justify-between overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center relative">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#d4af37]" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-[11px] font-orbitron font-black tracking-widest text-slate-800 uppercase flex items-center gap-1.5">
                    NEXUS AI ASSISTANT
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  </h3>
                  <span className="text-[7px] text-slate-400 font-mono tracking-wider">NEURAL COGNITIVE CORE</span>
                </div>
              </div>
              <button 
                onClick={() => { setIsOpen(false); playToggleSound(); }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Listing */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs scrollbar-thin">
              {messages.map((msg, index) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div key={index} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-1`}>
                    
                    <div className={`p-3 rounded-xl max-w-[90%] leading-relaxed border ${
                      isAi 
                        ? 'bg-slate-50 border-slate-100 text-slate-800 rounded-tl-none' 
                        : 'bg-[#d4af37] border-transparent text-white font-medium rounded-tr-none shadow-sm'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      
                      {/* Compare matrix result in chat */}
                      {isAi && msg.compareResult && (
                        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200/60 pt-3">
                          {msg.compareResult.map((p) => (
                            <div key={p.id} className="bg-white border border-slate-100 p-2.5 rounded-xl text-[10px]">
                              <div className="w-14 h-14 mx-auto rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="text-center mt-2">
                                <h5 className="font-bold text-slate-800 truncate uppercase">{p.name}</h5>
                                <span className="text-[#d4af37] font-bold block mt-0.5">${p.discountPrice}</span>
                                <div className="text-[8px] text-slate-400 font-mono mt-1 uppercase">Rating: {p.rating}★</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommendation results in chat */}
                      {isAi && msg.recsResult && (
                        <div className="mt-3 space-y-2 border-t border-slate-200/60 pt-3">
                          {msg.recsResult.map((p) => (
                            <div key={p.id} className="bg-white border border-slate-100 p-2 rounded-xl flex items-center gap-3">
                              <div className="w-10 h-10 rounded overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-slate-800 truncate text-[10px] uppercase">{p.name}</h5>
                                <span className="text-[#d4af37] text-[10px] font-bold">${p.discountPrice}</span>
                              </div>
                              <div className="text-[#d4af37] font-bold text-[9px] flex items-center gap-0.5">
                                <span>{p.rating}★</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                    <span className="text-[8px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl rounded-tl-none">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Inputs Panel */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-3 relative z-10">
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[8px] text-slate-400 tracking-widest font-orbitron font-bold uppercase">Preset Queries:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_PROMPTS.map((pr, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(pr.query)}
                        className="px-2.5 py-1.5 text-[9px] font-orbitron font-black tracking-widest bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer transition-colors"
                      >
                        {pr.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input Box Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask neural AI..."
                  className="flex-1 bg-white border border-slate-200 focus:border-[#d4af37] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-sans"
                />
                
                {/* Simulated/Real Speech Recognition button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer ${
                    isListening 
                      ? 'bg-rose-50 border-rose-300 text-rose-500 animate-pulse' 
                      : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-[#d4af37] flex items-center justify-center cursor-pointer transition-all duration-300 shrink-0 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
