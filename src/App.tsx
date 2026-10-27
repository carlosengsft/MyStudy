/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

import {
  StudyObjective,
  ObjectiveFormData,
  FilterStatus,
  SortOption,
  StudyStatus,
} from './types/objective';
import { StorageService } from './services/storageService';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<StudyObjective | null>(null);

  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState<SortOption>('prazo_proximo');

  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'info';
    text: string;
  } | null>(null);

  // Carrega os dados do localStorage na inicialização
  useEffect(() => {
    const loaded = StorageService.getObjectives();
    setObjectives(loaded);
  }, []);

  // Exibe notificação temporária
  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Cadastrar ou Atualizar objetivo
  const handleSaveObjective = (formData: ObjectiveFormData, id?: string) => {
    if (id) {
      const updated = StorageService.updateObjective(id, formData);
      if (updated) {
        setObjectives((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
        showToast('Objetivo de estudo atualizado com sucesso!');
      }
    } else {
      const created = StorageService.addObjective(formData);
      setObjectives((prev) => [created, ...prev]);
      showToast('Novo objetivo de estudo cadastrado com sucesso!');
    }
    setEditingObjective(null);
  };

  // Abrir modal de edição
  const handleEditRequest = (objective: StudyObjective) => {
    setEditingObjective(objective);
    setIsFormOpen(true);
  };

  // Abrir confirmação de exclusão
  const handleDeleteRequest = (objective: StudyObjective) => {
    setDeleteCandidate(objective);
  };

  // Confirmar exclusão do objetivo
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    const success = StorageService.deleteObjective(deleteCandidate.id);
    if (success) {
      setObjectives((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
      showToast(`Objetivo "${deleteCandidate.title}" excluído.`, 'info');
    }
    setDeleteCandidate(null);
  };

  // Alteração direta de status
  const handleStatusChange = (id: string, newStatus: StudyStatus) => {
    const updated = StorageService.updateObjective(id, { status: newStatus });
    if (updated) {
      setObjectives((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      if (newStatus === 'concluido') {
        showToast('Parabéns pela conclusão deste objetivo! 🎉');
      } else {
        showToast('Status do estudo atualizado.');
      }
    }
  };

  // Restaurar dados iniciais de exemplo caso o estudante deseje
  const handleResetStarterData = () => {
    localStorage.removeItem('studyflow_objectives_v1');
    const starters = StorageService.getObjectives();
    setObjectives(starters);
    setCurrentFilter('todos');
    setSearchQuery('');
    showToast('Exemplos de estudo restaurados para sua exploração!');
  };

  // Estatísticas calculadas
  const stats = useMemo(() => {
    return StorageService.calculateStats(objectives);
  }, [objectives]);

  // Contagens para os filtros segmentados
  const filterCounts = useMemo(() => {
    return {
      todos: objectives.length,
      nao_iniciado: objectives.filter((o) => o.status === 'nao_iniciado').length,
      em_andamento: objectives.filter((o) => o.status === 'em_andamento').length,
      concluido: objectives.filter((o) => o.status === 'concluido').length,
    };
  }, [objectives]);

  // Filtragem e ordenação
  const filteredAndSortedObjectives = useMemo(() => {
    let result = [...objectives];

    // Filtro por status
    if (currentFilter !== 'todos') {
      result = result.filter((item) => item.status === currentFilter);
    }

    // Filtro por busca de texto
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    // Ordenação
    result.sort((a, b) => {
      if (currentSort === 'prazo_proximo') {
        return (a.deadline || '').localeCompare(b.deadline || '');
      }
      if (currentSort === 'prazo_distante') {
        return (b.deadline || '').localeCompare(a.deadline || '');
      }
      if (currentSort === 'alfabetica') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      // 'recentes'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [objectives, currentFilter, searchQuery, currentSort]);

  const isFilteringActive = currentFilter !== 'todos' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Barra de Navegação Superior (Top Bar Contract) */}
      <Header
        onOpenCreateModal={() => {
          setEditingObjective(null);
          setIsFormOpen(true);
        }}
        totalObjectives={stats.total}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Bloco de Introdução Acolhedor para Estudantes Iniciantes */}
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-850 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-indigo-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Plataforma para Estudantes Iniciantes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Organize seus estudos com clareza e ritmo
            </h1>
            <p className="mt-2 text-sm text-indigo-100/90 leading-relaxed">
              Defina metas alcançáveis, estabeleça prazos realistas e acompanhe seu progresso sem complexidade. O segredo do aprendizado duradouro é a consistência.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setEditingObjective(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-indigo-950 bg-white hover:bg-indigo-50 active:bg-slate-100 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
                <span>Cadastrar Novo Objetivo</span>
              </button>
            </div>
          </div>
        </section>

        {/* Painel de Métricas & Progresso (Exibe a quantidade e percentual) */}
        <StatsBar stats={stats} />

        {/* Barra de Filtragem, Busca e Ordenação */}
        <FilterBar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
          counts={filterCounts}
        />

        {/* Lista de Objetivos de Estudo */}
        <section aria-label="Objetivos de estudo cadastrados">
          {filteredAndSortedObjectives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedObjectives.map((obj) => (
                <ObjectiveCard
                  key={obj.id}
                  objective={obj}
                  onEdit={handleEditRequest}
                  onDeleteRequest={handleDeleteRequest}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              isFiltered={isFilteringActive}
              onAction={() => {
                setEditingObjective(null);
                setIsFormOpen(true);
              }}
              onResetFilters={() => {
                setCurrentFilter('todos');
                setSearchQuery('');
              }}
            />
          )}
        </section>

        {/* Rodapé Interno com Dicas de Aprendizagem */}
        <section className="bg-white/80 border border-slate-200/80 rounded-xl p-5 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Dica pedagógica:</strong> Divida grandes matérias em objetivos pequenos de 30 a 60 minutos para evitar a procrastinação.
            </span>
          </div>

          <button
            onClick={handleResetStarterData}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap cursor-pointer"
            title="Recarregar exemplos guiados de estudo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recarregar exemplos iniciais</span>
          </button>
        </section>
      </main>

      {/* Rodapé Principal */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        <p>StudyFlow · Organização Simples para Estudantes Iniciantes · Versão 1.0 (Dados salvos no seu navegador)</p>
      </footer>

      {/* Modal de Cadastro / Edição de Objetivo */}
      <ObjectiveFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingObjective(null);
        }}
        onSave={handleSaveObjective}
        editingObjective={editingObjective}
      />

      {/* Modal de Confirmação para Exclusão Segura */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
        objective={deleteCandidate}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-lg text-xs font-medium animate-in slide-in-from-bottom-3 duration-200"
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
