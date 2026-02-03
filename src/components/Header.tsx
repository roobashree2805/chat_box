import { Menu, Brain, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentConversation: { title: string; category: string } | null;
  onToggleSidebar: () => void;
}

const categoryLabels = {
  coding_help: 'Coding Help',
  exam_prep: 'Exam Preparation',
  project_guidance: 'Project Guidance',
  general: 'General Chat',
};

export function Header({ currentConversation, onToggleSidebar }: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {currentConversation?.title || 'EngiChat'}
              </h1>
              {currentConversation && (
                <p className="text-xs text-gray-500">
                  {categoryLabels[currentConversation.category as keyof typeof categoryLabels] || 'General'}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
