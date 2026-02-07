import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  word: string;
  translation: string;
  examples: string[];
  rect: DOMRect | null;
  visible: boolean;
}

export const LiquidTooltip: React.FC<Props> = ({ word, translation, examples, rect, visible }) => {
  if (!rect || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="fixed z-[9999] p-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10 text-white max-w-xs overflow-hidden"
        style={{
          top: rect.top + window.scrollY - 100,
          left: rect.left + window.scrollX,
        }}
      >
        {/* Liquid Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            {word}
          </h3>
          <p className="mt-1 text-sm text-gray-200 font-medium">{translation}</p>
          
          <div className="mt-3 space-y-2">
            {examples.slice(0, 2).map((ex, i) => (
              <p key={i} className="text-xs italic text-gray-400 border-l-2 border-blue-400/50 pl-2">
                "{ex}"
              </p>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <button className="text-[10px] px-2 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              Listen 🔊
            </button>
            <button className="text-[10px] px-2 py-1 bg-blue-500/30 rounded-full hover:bg-blue-500/50 transition-colors">
              Save 💾
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
