
import React, { useMemo } from 'react';
import type { AgendaEvent } from '../types';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface CalendarViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: AgendaEvent[];
}

const WEEKDAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  events,
}) => {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startingDay = firstDayOfMonth.getDay();

  const eventsByDate = useMemo(() => {
    const map = new Map<string, AgendaEvent[]>();
    events.forEach(event => {
      const eventsOnDate = map.get(event.date) || [];
      map.set(event.date, [...eventsOnDate, event]);
    });
    return map;
  }, [events]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200 dark:border-gray-700"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();
      const dayEvents = eventsByDate.get(dateString) || [];

      days.push(
        <div
          key={day}
          className={`p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors duration-200 ${
            isSelected ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <div
            className={`flex justify-center items-center w-8 h-8 rounded-full text-sm ${
              isToday ? 'bg-blue-600 text-white' : ''
            } ${isSelected ? 'font-bold' : ''}`}
          >
            {day}
          </div>
          <div className="flex justify-center items-center mt-1 space-x-1 space-x-reverse h-2">
            {dayEvents.slice(0, 3).map((event, i) => (
              <div key={`${event.id}-${i}`} className={`w-2 h-2 rounded-full ${event.category.color}`}></div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  }, [startingDay, daysInMonth, currentDate, selectedDate, eventsByDate, setSelectedDate]);


  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-center">
          {currentDate.toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600 dark:text-gray-400">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-2 border-b-2 border-gray-200 dark:border-gray-700">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 h-[28rem]">{calendarDays}</div>
    </div>
  );
};
