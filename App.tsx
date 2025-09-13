
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';
import { EventsList } from './components/EventsList';
import { EventModal } from './components/EventModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AgendaEvent } from './types';

const App: React.FC = () => {
  const [events, setEvents] = useLocalStorage<AgendaEvent[]>('agendaEvents', []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<AgendaEvent | null>(null);

  const selectedDateString = useMemo(() => {
    return selectedDate.toISOString().split('T')[0];
  }, [selectedDate]);

  const dailyEvents = useMemo(() => {
    return events
      .filter(e => e.date === selectedDateString)
      .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
  }, [events, selectedDateString]);

  const handleOpenModal = useCallback(() => {
    setEventToEdit(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEventToEdit(null);
  }, []);

  const handleSaveEvent = useCallback((event: Omit<AgendaEvent, 'id'>) => {
    if (eventToEdit) {
      setEvents(prev => prev.map(e => e.id === eventToEdit.id ? { ...event, id: e.id } : e));
    } else {
      setEvents(prev => [...prev, { ...event, id: Date.now().toString() }]);
    }
    handleCloseModal();
  }, [eventToEdit, setEvents, handleCloseModal]);

  const handleDeleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, [setEvents]);

  const handleEditEvent = useCallback((event: AgendaEvent) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header onAddEvent={handleOpenModal} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <CalendarView
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              events={events}
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <EventsList
              selectedDate={selectedDate}
              events={dailyEvents}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          </div>
        </div>
      </main>
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default App;
