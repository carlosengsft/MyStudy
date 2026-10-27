/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, SearchX, Plus, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onAction: () => void;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onAction,
  onResetFilters,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-10 text-center max-w-xl mx-auto my-6">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
          <SearchX className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mt-4">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
          Não localizamos nenhuma meta correspondente aos filtros ou ao termo de busca atual.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="mt-5 inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Limpar filtros de busca</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto my-6 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center shadow-xs">
        <Compass className="w-7 h-7 stroke-[1.8]" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mt-4 tracking-tight">
        Seu fluxo de estudos começa aqui!
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
        Você ainda não possui nenhum objetivo cadastrado. Pequenas metas diárias constroem grandes conquistas: defina o que deseja aprender agora.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onAction}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Primeiro Objetivo</span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="p-3 bg-slate-50/70 rounded-xl">
          <span className="text-[11px] font-semibold text-indigo-700 block">1. Defina o tema</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Escolha uma matéria ou conceito específico.</span>
        </div>
        <div className="p-3 bg-slate-50/70 rounded-xl">
          <span className="text-[11px] font-semibold text-indigo-700 block">2. Estabeleça o prazo</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Dê uma data limite realista para praticar.</span>
        </div>
        <div className="p-3 bg-slate-50/70 rounded-xl">
          <span className="text-[11px] font-semibold text-indigo-700 block">3. Acompanhe o status</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Marque como concluído e celebre o avanço!</span>
        </div>
      </div>
    </div>
  );
};
