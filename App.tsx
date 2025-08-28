
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { useHabits } from './hooks/useHabits';
import { HabitList } from './components/HabitList';
import { CalendarView } from './components/CalendarView';
import { Header } from './components/Header';
import { Modal } from './components/Modal';
import { HabitForm } from './components/HabitForm';
import { ProfilePage } from './components/ProfilePage';
import { BottomNav } from './components/BottomNav';
import { exportDataToCSV } from './utils/csvExporter';
import type { Habit } from './types';

function AppContent() {
    const { addHabit, updateHabit, getAllData } = useHabits();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | undefined>(undefined);

    const handleOpenModal = (habit?: Habit) => {
        setHabitToEdit(habit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setHabitToEdit(undefined);
    };

    const handleSaveHabit = (habitData: Omit<Habit, 'id' | 'createdAt'> | Habit) => {
        if ('id' in habitData) {
            updateHabit(habitData);
        } else {
            addHabit(habitData);
        }
        handleCloseModal();
    };

    const handleExportData = () => {
        const data = getAllData();
        exportDataToCSV(data);
    };

    return (
        <HashRouter>
            <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
                <Header onAddHabit={() => handleOpenModal()} onExportData={handleExportData} />
                <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
                    <Routes>
                        <Route path="/" element={<HabitList onEditHabit={handleOpenModal} openNewHabitModal={() => handleOpenModal()} />} />
                        <Route path="/calendar" element={<CalendarView />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </main>
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={habitToEdit ? "Edit Habit" : "Create New Habit"}>
                    <HabitForm onSave={handleSaveHabit} onClose={handleCloseModal} habitToEdit={habitToEdit} />
                </Modal>
                <BottomNav />
            </div>
        </HashRouter>
    );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
