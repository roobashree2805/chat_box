import { Plus, MessageSquare, Trash2, Code, BookOpen, FolderKanban, Zap } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: (category?: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const categoryIcons = {
  coding_help: Code,
  exam_prep: BookOpen,
  project_guidance: FolderKanban,
  general: Zap,
};

const categoryColors = {
  coding_help: 'text-blue-500',
  exam_prep: 'text-green-500',
  project_guidance: 'text-orange-500',
  general: 'text-gray-500',
};

export function Sidebar({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
}: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => onNewConversation('general')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 font-medium transition"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => onNewConversation('coding_help')}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            Coding
          </button>
          <button
            onClick={() => onNewConversation('exam_prep')}
            className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Exam
          </button>
          <button
            onClick={() => onNewConversation('project_guidance')}
            className="px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm font-medium transition flex items-center gap-2 col-span-2"
          >
            <FolderKanban className="w-4 h-4" />
            Project
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Conversations
        </h3>

        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => {
              const Icon = categoryIcons[conversation.category as keyof typeof categoryIcons] || Zap;
              const colorClass = categoryColors[conversation.category as keyof typeof categoryColors] || 'text-gray-500';
              const isActive = currentConversation?.id === conversation.id;

              return (
                <div
                  key={conversation.id}
                  className={`group relative rounded-lg transition ${
                    isActive
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <button
                    onClick={() => onSelectConversation(conversation)}
                    className="w-full text-left p-3 pr-10"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colorClass}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(conversation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
