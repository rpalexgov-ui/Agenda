
import React from 'react';
import type { AgendaEvent } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

interface EventsListProps {
  selectedDate: Date;
  events: AgendaEvent[];
  onEdit: (event: AgendaEvent) => void;
  onDelete: (id: string) => void;
}

export const EventsList: React.FC<EventsListProps> = ({ selectedDate, events, onEdit, onDelete }) => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
        أحداث يوم: {selectedDate.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </h2>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {events.length > 0 ? (
          <ul className="space-y-4">
            {events.map(event => (
              <li key={event.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm transition-transform hover:scale-[1.02]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`w-3 h-3 rounded-full ${event.category.color}`}></span>
                       <h3 className="font-bold text-lg">{event.title}</h3>
                    </div>
                    {event.time && <p className={`text-sm font-semibold ${event.category.textColor}`}>{event.time}</p>}
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => onEdit(event)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(event.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-semibold">لا توجد أحداث مجدولة لهذا اليوم.</p>
            <p className="text-sm">يمكنك إضافة حدث جديد من الزر أعلاه.</p>
          </div>
        )}
      </div>
    </div>
  );
};
