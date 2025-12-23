
import React from 'react';
import { X } from 'lucide-react';
import { Encarte } from '../types';

interface EducationCardProps {
  encarte: Encarte;
  onDismiss: (id: string) => void;
}

export const EducationCard: React.FC<EducationCardProps> = ({ encarte, onDismiss }) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl mb-8 relative animate-in fade-in slide-in-from-top-4 duration-500">
      <button 
        onClick={() => onDismiss(encarte.id)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
      <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 text-gray-400">Encarte Educativo</h4>
      <h3 className="text-lg font-semibold mb-3 leading-tight">{encarte.title}</h3>
      <p className="text-sm text-gray-300 leading-relaxed italic">"{encarte.content}"</p>
    </div>
  );
};
