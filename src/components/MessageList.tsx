import { useEffect, useRef } from 'react';
import { User, Bot, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

export function MessageList({ messages, loading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl inline-block mb-6">
            <Bot className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to EngiChat
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Your AI-powered assistant for engineering challenges
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Coding Help</h3>
              <p className="text-sm text-blue-700">
                Get help with debugging, algorithms, and code optimization
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Exam Prep</h3>
              <p className="text-sm text-green-700">
                Study engineering concepts and practice problem-solving
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">Projects</h3>
              <p className="text-sm text-orange-700">
                Guidance on project planning, architecture, and best practices
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
            )}

            <div
              className={`flex-1 max-w-3xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                  : 'bg-white text-gray-900 rounded-2xl rounded-tl-sm shadow-sm'
              } px-6 py-4`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {new Date(message.created_at).toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 justify-start">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white text-gray-900 rounded-2xl rounded-tl-sm shadow-sm px-6 py-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
