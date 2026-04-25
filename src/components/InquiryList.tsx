import React, { useEffect, useState } from 'react';
import { Download, RefreshCcw, Search, Trash2, ChevronLeft, ChevronRight, X, User, Clock, MessageSquare, Info, ShieldCheck, FileText, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Inquiry } from '../lib/supabase';
import Badge from './Badge';

const InquiryList: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Detail Modal State
  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInquiries(data || []);
      setSelectedIds([]);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(inquiries.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const downloadCSV = () => {
    if (inquiries.length === 0) return;

    const headers = ['시간', '고객명', '요약', '카테고리', '긴급도', '담당부서'];
    const csvContent = [
      headers.join(','),
      ...inquiries.map(item => [
        item.created_at ? new Date(item.created_at).toLocaleString() : '',
        item.customer_name,
        `"${item.summary.replace(/"/g, '""')}"`,
        item.category,
        item.urgency,
        item.department
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `KB_Inquiry_History_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectPage = () => {
    const currentPageIds = currentItems.map(i => i.id as number).filter(Boolean);
    const isAllSelected = currentPageIds.every(id => selectedIds.includes(id));

    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`선택한 ${selectedIds.length}개의 문의 내역을 삭제하시겠습니까?`)) return;

    setDeleteLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('inquiries')
        .delete()
        .in('id', selectedIds);

      if (deleteError) throw deleteError;
      
      alert('성공적으로 삭제되었습니다.');
      await fetchInquiries();
    } catch (err) {
      alert(`삭제 중 오류 발생: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeleteLoading(false);
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

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchInquiries} className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Search size={20} className="text-gray-400" />
            문의 내역 조회
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>총 {inquiries.length}건</span>
            {selectedIds.length > 0 && (
              <>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-amber-600 font-bold">{selectedIds.length}건 선택됨</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {/* CSV Download First */}
          <button
            onClick={downloadCSV}
            disabled={inquiries.length === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            CSV 다운로드
          </button>

          {/* Delete Selected Second (Always visible, conditionally enabled) */}
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0 || deleteLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              selectedIds.length > 0 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            <Trash2 size={16} />
            {selectedIds.length > 0 ? `${selectedIds.length}개 삭제` : '선택 삭제'}
          </button>

          {/* Refresh Last */}
          <button
            onClick={fetchInquiries}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 border border-gray-100 bg-white"
            title="새로고침"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="w-full">
          <table className="w-full text-left text-sm border-collapse table-fixed">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                    checked={currentItems.length > 0 && currentItems.every(i => selectedIds.includes(i.id as number))}
                    onChange={handleSelectPage}
                  />
                </th>
                <th className="px-2 py-4 w-[110px] font-bold text-gray-600 uppercase tracking-tight">시간</th>
                <th className="px-4 py-4 w-[80px] font-bold text-gray-600 uppercase tracking-tight">이름</th>
                <th className="px-4 py-4 font-bold text-gray-600 uppercase tracking-tight">문의 요약</th>
                <th className="px-4 py-4 w-[100px] font-bold text-gray-600 uppercase tracking-tight">카테고리</th>
                <th className="px-4 py-4 w-[80px] font-bold text-gray-600 uppercase tracking-tight text-center">긴급도</th>
                <th className="px-4 py-4 w-[110px] font-bold text-gray-600 uppercase tracking-tight text-right">담당부서</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-4 h-12 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    조회된 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setViewInquiry(item)}
                    className={`hover:bg-amber-50/30 cursor-pointer transition-colors ${selectedIds.includes(item.id as number) ? 'bg-amber-50/50' : ''}`}
                  >
                    <td 
                      className="px-4 py-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectOne({ stopPropagation: () => {} } as any, item.id as number);
                      }}
                    >
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                        checked={selectedIds.includes(item.id as number)}
                        onChange={(e) => handleSelectOne(e as any, item.id as number)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-2 py-4 text-gray-500 truncate">
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium text-xs truncate">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</span>
                        <span className="text-[10px] opacity-60 truncate">{item.created_at ? new Date(item.created_at).toLocaleTimeString() : ''}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-800 truncate">{item.customer_name}</td>
                    <td className="px-4 py-4 text-gray-600 truncate" title={item.summary}>
                      {item.summary}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="secondary">{item.category}</Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge variant={getUrgencyVariant(item.urgency)}>{item.urgency}</Badge>
                    </td>
                    <td className="px-4 py-4 text-amber-700 font-bold tracking-tight text-right truncate">
                      {item.department}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {inquiries.length}건 중 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, inquiries.length)}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); paginate(Math.max(1, currentPage - 1)); }}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={(e) => { e.stopPropagation(); paginate(number); }}
                  className={`min-w-[28px] h-7 text-[11px] font-bold rounded-lg transition-all ${
                    currentPage === number
                      ? 'bg-amber-400 text-gray-900 shadow-sm'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={(e) => { e.stopPropagation(); paginate(Math.min(totalPages, currentPage + 1)); }}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#FFCC00] px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2 font-black text-gray-900">
                <FileText size={20} />
                <span>문의 상세 정보</span>
              </div>
              <button 
                onClick={() => setViewInquiry(null)}
                className="p-2 hover:bg-black/10 rounded-full transition-colors text-gray-900"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                    <User size={12} /> 고객명
                  </div>
                  <p className="text-xl font-bold text-gray-900">{viewInquiry.customer_name}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                    <Clock size={12} /> 접수 시간
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {viewInquiry.created_at ? new Date(viewInquiry.created_at).toLocaleString() : '-'}
                  </p>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge>{viewInquiry.category}</Badge>
                  <Badge variant={getUrgencyVariant(viewInquiry.urgency)}>{viewInquiry.urgency}</Badge>
                  <span className="ml-auto text-sm font-black text-amber-600 flex items-center gap-1">
                    <ShieldCheck size={16} /> {viewInquiry.department}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                    <Info size={12} /> AI 한줄 요약
                  </div>
                  <p className="text-lg font-bold text-gray-800 leading-snug">
                    {viewInquiry.summary}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                  <MessageSquare size={12} /> 원본 문의 내용
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                  {viewInquiry.inquiry}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-500" /> AI 권장 응대 스크립트
                </div>
                <div className="bg-amber-50/50 p-5 rounded-2xl text-sm text-gray-800 leading-relaxed italic border-l-4 border-amber-400">
                  "{viewInquiry.script}"
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setViewInquiry(null)}
                className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryList;
