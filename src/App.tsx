import { useState } from 'react';
import { ClipboardList, MessageSquarePlus } from 'lucide-react';
import InquiryForm from './components/InquiryForm';
import InquiryList from './components/InquiryList';

function App() {
  const [activeTab, setActiveTab] = useState<'input' | 'list'>('input');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-[#FFCC00] shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 text-[#FFCC00] p-1.5 rounded-lg font-black text-xl italic">
              KB
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">
              고객 문의 자동 분류 시스템
            </h1>
          </div>
          <div className="text-[10px] font-bold text-gray-800 bg-white/30 px-2 py-1 rounded uppercase">
            Powered by Gemini 3 Flash
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-4 ${
              activeTab === 'input'
                ? 'border-[#FFCC00] text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <MessageSquarePlus size={18} />
            문의 입력
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-4 ${
              activeTab === 'list'
                ? 'border-[#FFCC00] text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <ClipboardList size={18} />
            문의 내역
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'input' ? <InquiryForm /> : <InquiryList />}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-xs">
        &copy; 2026 KB Financial Group. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
