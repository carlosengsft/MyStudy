/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';
import { StudyStats } from '../types/objective';

interface StatsBarProps {
  stats: StudyStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const getMotivationalMessage = () => {
    if (stats.total === 0) {
      return 'Bem-vindo ao StudyFlow! Crie seu primeiro objetivo para começar sua trilha.';
    }
    if (stats.percentualConcluido === 100) {
      return 'Parabéns! Todos os seus objetivos atuais foram concluídos com sucesso.';
    }
    if (stats.percentualConcluido >= 50) {
      return 'Excelente ritmo! Mais da metade da sua meta de estudos já foi conquistada.';
    }
    if (stats.emAndamento > 0) {
      return 'Você está em movimento. Mantenha a constância e o foco nas metas de hoje.';
    }
    return 'Organize seu tempo e inicie seu primeiro tópico de estudos da lista.';
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
            Painel de Progresso
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Barra de Progresso Geral */}
        <div className="flex items-center gap-3 w-full md:w-64">
          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${stats.percentualConcluido}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-800 font-mono tabular-nums whitespace-nowrap shrink-0">
            {stats.percentualConcluido}%
          </span>
        </div>
      </div>

      {/* Grid de Métricas de Estudo (Números tabulares limpos, sem pílulas) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {stats.total}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Total cadastrados
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
              {stats.concluidos}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Concluídos
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-700 font-mono tabular-nums">
              {stats.emAndamento}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Em andamento
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${stats.atrasados > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-2xl font-bold font-mono tabular-nums ${stats.atrasados > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
              {stats.naoIniciados}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              {stats.atrasados > 0 ? `Não iniciados (${stats.atrasados} atrasados)` : 'Não iniciados'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
