import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Sidebar } from './Sidebar';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Header } from './Header';

interface Conversation {
  id: string;
  title: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function ChatInterface() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setConversations(data);
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0]);
      }
    }
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const createNewConversation = async (category: string = 'general') => {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user!.id,
        title: 'New Conversation',
        category,
      })
      .select()
      .single();

    if (!error && data) {
      setConversations([data, ...conversations]);
      setCurrentConversation(data);
      setMessages([]);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentConversation) {
      await createNewConversation();
      return;
    }

    setLoading(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: currentConversation.id,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);

    const { error: messageError } = await supabase.from('messages').insert({
      conversation_id: currentConversation.id,
      role: 'user',
      content,
    });

    if (messageError) {
      console.error('Error saving message:', messageError);
      setLoading(false);
      return;
    }

    if (messages.length === 0) {
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', currentConversation.id);

      setCurrentConversation({ ...currentConversation, title });
      loadConversations();
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            conversation_id: currentConversation.id,
          }),
        }
      );

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: currentConversation.id,
        role: 'assistant',
        content: data.response,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await supabase.from('messages').insert({
        conversation_id: currentConversation.id,
        role: 'assistant',
        content: data.response,
      });

      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentConversation.id);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: currentConversation.id,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please make sure the chat edge function is deployed and configured properly.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    await supabase.from('conversations').delete().eq('id', conversationId);

    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    setConversations(updatedConversations);

    if (currentConversation?.id === conversationId) {
      setCurrentConversation(updatedConversations[0] || null);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={setCurrentConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        <Header
          currentConversation={currentConversation}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <MessageList messages={messages} loading={loading} />

        <MessageInput
          onSend={sendMessage}
          disabled={loading}
          onNewChat={() => createNewConversation()}
        />
      </div>
    </div>
  );
}
