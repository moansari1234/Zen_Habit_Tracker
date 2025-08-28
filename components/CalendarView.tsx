
import React, { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { getDaysInMonth, toYYYYMMDD, getMonthName } from '../utils/dateUtils';
import type { HabitLog, Habit } from '../types';

export const CalendarView: React.FC = () => {
  const { habits, logs } = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const logsByDate: Record<string, HabitLog[]> = logs.reduce((acc, log) => {
    (acc[log.date] = acc[log.date] || []).push(log);
    return acc;
  }, {} as Record<string, HabitLog[]>);

  const isCompleted = (log: HabitLog, habit: Habit) => {
    return (habit.type === 'boolean' && log.value === 1) || (habit.type === 'quantifiable' && log.value >= habit.target);
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  const completionPercentageForDay = (dateStr: string) => {
      const logsForDay = logsByDate[dateStr] || [];
      if(habits.length === 0) return 0;
      
      const completedCount = logsForDay.reduce((count, log) => {
          const habit = habits.find(h => h.id === log.habitId);
          if(habit && isCompleted(log, habit)) {
              return count + 1;
          }
          return count;
      }, 0);
      
      return (completedCount / habits.length) * 100;
  }
  
  return (
    <div className="p-2 sm:p-4 bg-[var(--bg-secondary)] rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-[var(--bg-tertiary)]">&lt;</button>
        <h2 className="text-lg sm:text-xl font-bold">{getMonthName(month)} {year}</h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-[var(--bg-tertiary)]">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map(day => (
          <div key={day} className="text-center font-semibold text-[var(--text-secondary)] text-xs sm:text-sm">{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {daysInMonth.map(day => {
          const dateStr = toYYYYMMDD(day);
          const completion = completionPercentageForDay(dateStr);
          const isToday = dateStr === toYYYYMMDD(new Date());

          return (
            <div key={dateStr} className={`relative h-16 sm:h-20 rounded-md p-1 border ${isToday ? 'border-[var(--accent-primary)]' : 'border-[var(--border-primary)]'}`}>
              <div className="text-xs font-medium text-[var(--text-secondary)]">{day.getDate()}</div>
              {completion > 0 && 
                <div 
                    className="absolute inset-0 bg-[var(--accent-positive)] opacity-20 rounded-md"
                    style={{ opacity: completion/100 * 0.5 }}
                />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
};
