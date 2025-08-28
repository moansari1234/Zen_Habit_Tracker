import React, { useState, useEffect } from 'react';
import type { Habit, HabitType, SubHabit } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface HabitFormProps {
    onSave: (habit: Omit<Habit, 'id' | 'createdAt'> | Habit) => void;
    onClose: () => void;
    habitToEdit?: Habit;
}

export const HabitForm: React.FC<HabitFormProps> = ({ onSave, onClose, habitToEdit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState<HabitType>('boolean');
    const [target, setTarget] = useState(1);
    const [subHabits, setSubHabits] = useState<SubHabit[]>([]);

    useEffect(() => {
        if (habitToEdit) {
            setName(habitToEdit.name);
            setDescription(habitToEdit.description);
            setCategory(habitToEdit.category);
            setType(habitToEdit.type);
            setTarget(habitToEdit.target);
            setSubHabits(habitToEdit.subHabits || []);
        }
    }, [habitToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const habitData = {
            name,
            description,
            category,
            type,
            target: type === 'boolean' ? 1 : target,
            subHabits,
        };
        
        if (habitToEdit) {
            onSave({ ...habitToEdit, ...habitData });
        } else {
            onSave(habitData);
        }
        
        onClose();
    };

    const handleAddSubHabit = () => {
        setSubHabits([...subHabits, { id: crypto.randomUUID(), name: '', type: 'boolean', target: 1 }]);
    };

    const handleSubHabitChange = (index: number, field: keyof SubHabit, value: string | number) => {
        const newSubHabits = [...subHabits];
        (newSubHabits[index] as any)[field] = value;
        if(field === 'type' && value === 'boolean') newSubHabits[index].target = 1;
        setSubHabits(newSubHabits);
    };
    
    const handleRemoveSubHabit = (index: number) => {
        setSubHabits(subHabits.filter((_, i) => i !== index));
    };


    const formFieldClass = "w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition";
    const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-1";
    const hasSubHabits = subHabits.length > 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <label htmlFor="name" className={labelClass}>Habit Name</label>
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className={formFieldClass} />
            </div>
            <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className={formFieldClass} />
            </div>
            <div>
                <label htmlFor="category" className={labelClass}>Category</label>
                <input id="category" type="text" value={category} onChange={e => setCategory(e.target.value)} className={formFieldClass} placeholder="e.g. Fitness, Work, Health"/>
            </div>
            <div className={`p-3 border border-dashed border-[var(--border-primary)] rounded-lg ${hasSubHabits ? 'opacity-50' : ''}`}>
                 <p className={`${labelClass} mb-2`}>Parent Habit Type</p>
                 {hasSubHabits && <p className="text-xs text-[var(--text-secondary)] mb-2">Parent type is disabled when sub-habits exist. Progress will be tracked by sub-habits.</p>}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="type" className={labelClass}>Type</label>
                        <select id="type" value={type} onChange={e => setType(e.target.value as HabitType)} className={formFieldClass} disabled={hasSubHabits}>
                            <option value="boolean">Daily Checkbox</option>
                            <option value="quantifiable">Quantifiable</option>
                        </select>
                    </div>
                    {type === 'quantifiable' && (
                        <div>
                            <label htmlFor="target" className={labelClass}>Target Value</label>
                            <input id="target" type="number" min="1" value={target} onChange={e => setTarget(Number(e.target.value))} required className={formFieldClass} disabled={hasSubHabits}/>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="space-y-3">
                 <label className={labelClass}>Sub-habits</label>
                 {subHabits.map((sub, index) => (
                    <div key={sub.id} className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Sub-habit {index + 1}</p>
                            <button type="button" onClick={() => handleRemoveSubHabit(index)} className="text-[var(--accent-negative)]"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                        <input type="text" placeholder="Sub-habit name" value={sub.name} onChange={e => handleSubHabitChange(index, 'name', e.target.value)} required className={formFieldClass} />
                        <div className="grid grid-cols-2 gap-2">
                           <select value={sub.type} onChange={e => handleSubHabitChange(index, 'type', e.target.value)} className={formFieldClass}>
                                <option value="boolean">Checkbox</option>
                                <option value="quantifiable">Quantifiable</option>
                            </select>
                            {sub.type === 'quantifiable' && 
                                <input type="number" min="1" value={sub.target} onChange={e => handleSubHabitChange(index, 'target', Number(e.target.value))} required className={formFieldClass} />
                            }
                        </div>
                    </div>
                 ))}
                 <button type="button" onClick={handleAddSubHabit} className="w-full flex items-center justify-center space-x-2 p-2 text-sm border border-dashed border-[var(--border-primary)] rounded-md hover:bg-[var(--bg-secondary)] transition">
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Sub-habit</span>
                 </button>
            </div>


            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-[var(--bg-tertiary)] rounded-md hover:opacity-80 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:opacity-80 transition">{habitToEdit ? 'Save Changes' : 'Create Habit'}</button>
            </div>
        </form>
    );
};
