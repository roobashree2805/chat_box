import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  onNewChat: () => void;
}

export function MessageInput({ onSend, disabled, onNewChat }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickPrompts = [
    'Help me debug this code',
    'Explain this concept',
    'Review my project approach',
    'Practice problems for exam',
  ];

  return (
    <div className="bg-white border-t border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        {message.length === 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setMessage(prompt)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about engineering, coding, or your projects..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-2xl border border-gray-300 px-6 py-4 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              minHeight: '56px',
              maxHeight: '200px',
              height: 'auto',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          />

          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={disabled || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-3">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
