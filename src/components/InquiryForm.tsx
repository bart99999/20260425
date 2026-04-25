import React, { useState } from 'react';
import { Loader2, Save, Sparkles } from 'lucide-react';
import { analyzeInquiry } from '../lib/gemini';
import type { AnalysisResult } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import Badge from './Badge';

const InquiryForm: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!customerName.trim() || !inquiry.trim()) {
      alert('고객 이름과 문의 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeInquiry(inquiry);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    setSaveLoading(true);
    try {
      const { error: saveError } = await supabase.from('inquiries').insert([
        {
          customer_name: customerName,
          inquiry,
          category: result.category,
          urgency: result.urgency,
          summary: result.summary,
          department: result.department,
          script: result.script,
        },
      ]);

      if (saveError) throw saveError;

      alert('성공적으로 저장되었습니다.');
      // 초기화
      setCustomerName('');
      setInquiry('');
      setResult(null);
    } catch (err) {
      alert(`저장 중 오류 발생: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const getUrgencyVariant = (urgency: string) => {
    switch (urgency) {
      case '높음': return 'urgency-high';
      case '보통': return 'urgency-medium';
      case '낮음': return 'urgency-low';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="text-amber-500" size={20} />
          문의 자동 분류
        </h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">고객 이름</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
            placeholder="이름을 입력하세요"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all min-h-[150px]"
            placeholder="고객의 문의 내용을 상세히 입력하세요"
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-[#FFCC00] hover:bg-[#E6B800] text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
          분류하기
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm break-all">
          <p className="font-bold mb-1">에러 발생:</p>
          {error}
          <button 
            onClick={handleAnalyze}
            className="mt-2 block text-xs underline font-semibold"
          >
            재시도
          </button>
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-amber-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start mb-4">
            <div className="space-x-2">
              <Badge>{result.category}</Badge>
              <Badge variant={getUrgencyVariant(result.urgency)}>{result.urgency}</Badge>
            </div>
            <span className="text-sm font-bold text-amber-600">{result.department}</span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">문의 요약</h3>
              <p className="text-lg font-medium text-gray-800">{result.summary}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">권장 응대 스크립트</h3>
              <div className="bg-amber-50 p-4 rounded-xl text-gray-700 italic leading-relaxed border-l-4 border-amber-400">
                "{result.script}"
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saveLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {saveLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              DB에 저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryForm;
