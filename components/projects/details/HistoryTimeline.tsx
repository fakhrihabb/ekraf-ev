
"use client";

import { useEffect, useState } from "react";
import { ProjectHistory, ProjectNote } from "@/app/lib/types";
import { Clock, MessageSquare, Send, Calendar, History, FileText } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface HistoryTimelineProps {
  projectId: string;
}

export const HistoryTimeline = ({ projectId }: HistoryTimelineProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'notes'>('history');
  const [history, setHistory] = useState<ProjectHistory[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [projectId, activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'history') {
        const res = await fetch(`/api/projects/${projectId}/history`);
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } else {
        const res = await fetch(`/api/projects/${projectId}/notes`);
        const data = await res.json();
        setNotes(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_text: newNote })
      });
      
      if (res.ok) {
        setNewNote("");
        fetchData(); // Refresh list
      }
    } catch (err) {
      console.error("Failed to add note", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: localeId });
    } catch (e) {
      return dateString;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'create_project': return <Clock className="w-4 h-4 text-green-500" />;
      case 'add_location': return <History className="w-4 h-4 text-blue-500" />;
      case 'generate_report': return <FileText className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Header Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'history' 
              ? 'text-[#134474] border-b-2 border-[#134474] bg-blue-50/50' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <History className="w-4 h-4" /> Riwayat Aktivitas
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'notes' 
              ? 'text-[#134474] border-b-2 border-[#134474] bg-blue-50/50' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Catatan Tim
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-gray-200">
        {isLoading ? (
           <div className="flex items-center justify-center h-40">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#134474]"></div>
           </div>
        ) : activeTab === 'history' ? (
          <div className="p-6 space-y-6">
            {history.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">Belum ada riwayat aktivitas.</p>
            ) : (
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                {history.map((item) => (
                  <div key={item.id} className="relative pl-8">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                       {/* Dot */}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-400 flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3" /> {formatDate(item.created_at)}
                      </span>
                      <p className="text-gray-800 font-medium text-sm">{item.description}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 mt-1 inline-block">
                        {item.action_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full bg-gray-50/50">
            {/* Notes List */}
            <div className="flex-1 p-6 space-y-4">
               {notes.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 text-sm">Belum ada catatan tim.</p>
                    <p className="text-gray-400 text-xs mt-1">Gunakan catatan untuk merekam keputusan rapat atau to-do.</p>
                  </div>
               ) : (
                 notes.map((note) => (
                   <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                     <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{note.note_text}</p>
                     <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                        <span className="text-xs text-brand-primary font-semibold">User</span>
                        <span className="text-xs text-gray-400">{formatDate(note.created_at)}</span>
                     </div>
                   </div>
                 ))
               )}
            </div>
            
            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleAddNote} className="relative">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Tulis catatan baru..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-light/50 focus:border-brand-light outline-none transition-all text-sm text-gray-800 placeholder:text-gray-400"
                />
                <button 
                  type="submit"
                  disabled={!newNote.trim() || isSubmitting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#134474] text-white rounded-lg hover:bg-[#0D263F] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
