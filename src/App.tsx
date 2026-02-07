import { useEffect, useState, useRef } from 'react';
import { Send, Eye, Languages, BookOpen, Settings } from 'lucide-react';
import { Gateway } from './services/Gateway';
import { clsx } from 'clsx';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

const DEFAULT_TOKEN = "b5b2560e5484e01615681d30470fac5d82d792d849d230ce";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<'disconnected' | 'connected'>('disconnected');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [tempToken, setTempToken] = useState("");

  useEffect(() => {
    // Init Gateway
    chrome.storage.local.get(['token'], (result: { token?: string }) => {
      const token = result.token || DEFAULT_TOKEN;
      setTempToken(token);
      Gateway.init(token);
    });

    const unsub = Gateway.subscribe((event) => {
      if (event.type === 'status') {
        setStatus(event.status);
      }
      if (event.type === 'message') {
        addMessage(event.payload.text, 'agent');
      }
    });

    return () => unsub();
  }, []);

  const addMessage = (text: string, sender: 'user' | 'agent') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: Date.now()
    }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage(input, 'user');
    Gateway.sendChat(input);
    setInput("");
  };

  const handleVision = async () => {
    // Capture Visible Tab
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.windowId) {
        // const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'jpeg', quality: 60 });
        addMessage("📸 Capturing vision context...", 'user');
        // Gateway.sendVision(dataUrl); // Waiting for Protocol V3 update
        Gateway.sendChat(`[VISION_CONTEXT] User is looking at: ${tab.url}. (Image data omitted for V1 demo)`);
      }
    } catch (e) {
      console.error(e);
      addMessage("❌ Vision capture failed.", 'agent');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveSettings = () => {
    chrome.storage.local.set({ token: tempToken }, () => {
      Gateway.init(tempToken);
      setShowSettings(false);
      addMessage("Token updated. Reconnecting...", 'agent');
    });
  };

  if (showSettings) {
    return (
      <div className="flex flex-col h-screen w-full bg-[url('/bg-noise.png')] bg-cover p-4 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Neural Settings</h2>
        <div className="space-y-2">
          <label className="text-xs text-gray-400">Access Token</label>
          <input 
            value={tempToken}
            onChange={(e) => setTempToken(e.target.value)}
            className="glass-input w-full font-mono text-xs"
            placeholder="Paste your OpenClaw token here"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white flex-1">Cancel</button>
          <button onClick={saveSettings} className="glass-btn flex-1 bg-blue-600">Save & Connect</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[url('/bg-noise.png')] bg-cover">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 liquid-glass border-b border-white/5 z-10">
        <div className="flex items-center gap-2">
          <div className={clsx("w-2.5 h-2.5 rounded-full shadow-[0_0_10px]", status === 'connected' ? "bg-emerald-400 shadow-emerald-500/50" : "bg-red-400 shadow-red-500/50")} />
          <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            MAVIS NEURAL LINK
          </h1>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Settings size={18} className="text-gray-400" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 blur-xl absolute" />
            <img src="/icons/icon128.png" className="w-16 h-16 mb-4 relative z-10 opacity-80" />
            <p>Neural Link Ready.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={clsx(
            "flex w-full",
            msg.sender === 'user' ? "justify-end" : "justify-start"
          )}>
            <div className={clsx(
              "max-w-[85%] p-3 rounded-2xl text-sm shadow-lg backdrop-blur-md border border-white/5",
              msg.sender === 'user' 
                ? "bg-blue-600/80 text-white rounded-br-none" 
                : "bg-slate-800/60 text-gray-100 rounded-bl-none"
            )}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Action Bar */}
      <div className="px-4 py-2 flex gap-2 justify-center">
        <button onClick={handleVision} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/5 transition-colors group">
          <div className="p-2 rounded-full bg-purple-500/20 group-hover:bg-purple-500/40 text-purple-300 transition-all">
            <Eye size={20} />
          </div>
          <span className="text-[10px] text-gray-400">Vision</span>
        </button>
        <button onClick={() => Gateway.sendChat("Dịch đoạn văn đang chọn sang tiếng Việt giúp tôi.")} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/5 transition-colors group">
          <div className="p-2 rounded-full bg-orange-500/20 group-hover:bg-orange-500/40 text-orange-300 transition-all">
            <Languages size={20} />
          </div>
          <span className="text-[10px] text-gray-400">Translate</span>
        </button>
        <button onClick={() => Gateway.sendChat("Tạo bài quiz tiếng Anh từ trang này.")} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/5 transition-colors group">
          <div className="p-2 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/40 text-emerald-300 transition-all">
            <BookOpen size={20} />
          </div>
          <span className="text-[10px] text-gray-400">Learn</span>
        </button>
      </div>

      {/* Input Area */}
      <footer className="p-4 liquid-glass border-t border-white/5">
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Send a neural command..."
            className="glass-input flex-1"
          />
          <button onClick={handleSend} className="glass-btn px-3">
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
