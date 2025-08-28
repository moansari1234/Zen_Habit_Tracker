
import type { Habit, HabitLog } from '../types';

export const exportDataToCSV = (data: { habits: Habit[]; logs: HabitLog[] }) => {
    const { habits, logs } = data;

    const habitMap = new Map(habits.map(h => [h.id, h.name]));

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Habit Name,Value,Target,Category\r\n";

    const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedLogs.forEach(log => {
        const habit = habits.find(h => h.id === log.habitId);
        if (habit) {
            const row = [
                log.date,
                `"${habit.name.replace(/"/g, '""')}"`,
                log.value,
                habit.target,
                `"${habit.category.replace(/"/g, '""')}"`
            ].join(",");
            csvContent += row + "\r\n";
        }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zenith_habit_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
