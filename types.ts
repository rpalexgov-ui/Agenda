
export interface Category {
  name: string;
  color: string; // Tailwind bg color class e.g., 'bg-blue-500'
  textColor: string; // Tailwind text color class e.g., 'text-blue-500'
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string; // 'YYYY-MM-DD'
  time?: string; // 'HH:MM'
  description: string;
  category: Category;
}
