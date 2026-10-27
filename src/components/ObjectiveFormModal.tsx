/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { ObjectiveFormData, StudyObjective, StudyStatus } from '../types/objective';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ObjectiveFormData, id?: string) => void;
  editingObjective?: StudyObjective | null;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingObjective,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<StudyStatus>('nao_iniciado');

  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  useEffect(() => {
    if (editingObjective) {
      setTitle(editingObjective.title);
      setDescription(editingObjective.description);
      setDeadline(editingObjective.deadline);
      setStatus(editingObjective.status);
    } else {
      // Padrão para novo objetivo: data sugerida em 3 dias
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      setTitle('');
      setDescription('');
      setDeadline(defaultDate.toISOString().split('T')[0]);
      setStatus('nao_iniciado');
    }
    setErrors({});
  }, [editingObjective, isOpen]);

  if (!isOpen) return null;

  const handleShortcutDeadline = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDeadline(d.toISOString().split('T')[0]);
    if (errors.deadline) {
      setErrors((prev) => ({ ...prev, deadline: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo de estudo.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve conter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Selecione uma data limite para este estudo.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        deadline,
        status,
      },
      editingObjective?.id
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-slate-900">
                {editingObjective ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-slate-500">
                {editingObjective
                  ? 'Atualize o conteúdo, prazo ou status do aprendizado.'
                  : 'Defina uma meta clara para orientar sua rotina.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Título */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="title" className="text-xs font-semibold text-slate-800">
                Título do Objetivo <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {title.length}/100
              </span>
            </div>
            <input
              id="title"
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Dominar Loops e Condicionais no Python"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                  : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-800 mb-1.5">
              Descrição ou Escopo de Estudo
              <span className="text-slate-400 font-normal ml-1">(opcional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Assistir aulas 4 e 5, ler resumo no PDF e resolver a lista com 10 questões práticas."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
            />
          </div>

          {/* Prazo */}
          <div>
            <label htmlFor="deadline" className="block text-xs font-semibold text-slate-800 mb-1.5">
              Prazo de Conclusão <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.deadline
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600'
                }`}
              />
            </div>
            {errors.deadline && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.deadline}</span>
              </p>
            )}

            {/* Atalhos de prazo para rapidez */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Atalhos:
              </span>
              <button
                type="button"
                onClick={() => handleShortcutDeadline(0)}
                className="px-2 py-0.8 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => handleShortcutDeadline(1)}
                className="px-2 py-0.8 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Amanhã
              </button>
              <button
                type="button"
                onClick={() => handleShortcutDeadline(7)}
                className="px-2 py-0.8 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Em 7 dias
              </button>
              <button
                type="button"
                onClick={() => handleShortcutDeadline(15)}
                className="px-2 py-0.8 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Em 15 dias
              </button>
            </div>
          </div>

          {/* Status Inicial */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Status do Estudo
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                  status === 'nao_iniciado'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 shadow-2xs font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="nao_iniciado"
                  checked={status === 'nao_iniciado'}
                  onChange={() => setStatus('nao_iniciado')}
                  className="sr-only"
                />
                <span>Não iniciado</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                  status === 'em_andamento'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-800 shadow-2xs font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="em_andamento"
                  checked={status === 'em_andamento'}
                  onChange={() => setStatus('em_andamento')}
                  className="sr-only"
                />
                <span>Em andamento</span>
              </label>

              <label
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                  status === 'concluido'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-800 shadow-2xs font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="concluido"
                  checked={status === 'concluido'}
                  onChange={() => setStatus('concluido')}
                  className="sr-only"
                />
                <span>Concluído</span>
              </label>
            </div>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {editingObjective ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
