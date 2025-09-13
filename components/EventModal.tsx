
import React, { useState, useEffect, useCallback } from 'react';
import type { AgendaEvent, Category } from '../types';
import { CATEGORIES } from '../constants';
import { parseEventFromText } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<AgendaEvent, 'id'>) => void;
  eventToEdit: AgendaEvent | null;
  selectedDate: Date;
}

const initialState = {
  title: '',
  date: '',
  time: '',
  description: '',
  category: CATEGORIES[0],
};

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, eventToEdit, selectedDate }) => {
  const [eventData, setEventData] = useState(initialState);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setEventData({
        title: eventToEdit.title,
        date: eventToEdit.date,
        time: eventToEdit.time || '',
        description: eventToEdit.description,
        category: eventToEdit.category,
      });
    } else {
      setEventData({
        ...initialState,
        date: selectedDate.toISOString().split('T')[0],
      });
    }
  }, [eventToEdit, selectedDate, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const selectedCategory = CATEGORIES.find(c => c.name === value) || CATEGORIES[0];
      setEventData(prev => ({ ...prev, category: selectedCategory }));
    } else {
      setEventData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAiAnalyze = async () => {
    if (!aiPrompt.trim()) return;
    setIsAnalyzing(true);
    setError('');
    try {
      const parsedData = await parseEventFromText(aiPrompt);
      setEventData(prev => ({
        ...prev,
        title: parsedData.title || prev.title,
        date: parsedData.date || prev.date,
        time: parsedData.time || prev.time,
        description: parsedData.description || prev.description,
      }));
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventData.title || !eventData.date) {
        setError("العنوان والتاريخ حقول إلزامية.");
        return;
    }
    onSave(eventData);
    setAiPrompt('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              {eventToEdit ? 'تعديل الحدث' : 'إضافة حدث جديد'}
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-gray-700">
                <label htmlFor="ai-prompt" className="flex items-center gap-2 text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">
                  <SparklesIcon className="w-5 h-5" />
                  المساعد الذكي (AI)
                </label>
                <div className="flex gap-2">
                  <input
                    id="ai-prompt"
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="مثال: اجتماع مع فريق التسويق غدا الساعة 2 ظهرا"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                  />
                  <button type="button" onClick={handleAiAnalyze} disabled={isAnalyzing} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex-shrink-0">
                    {isAnalyzing ? 'جاري التحليل...' : 'تحليل'}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
                <input type="text" name="title" id="title" value={eventData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التاريخ</label>
                  <input type="date" name="date" id="date" value={eventData.date} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"/>
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوقت (اختياري)</label>
                  <input type="time" name="time" id="time" value={eventData.time} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"/>
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الفئة</label>
                <select name="category" id="category" value={eventData.category.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800">
                  {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف</label>
                <textarea name="description" id="description" value={eventData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"></textarea>
              </div>

            </div>
             {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 px-6 py-3 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
              إلغاء
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
              {eventToEdit ? 'حفظ التعديلات' : 'حفظ الحدث'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
