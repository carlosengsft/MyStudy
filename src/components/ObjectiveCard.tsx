/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  Pencil,
  Trash2,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { StudyObjective, StudyStatus } from '../types/objective';
import { StorageService } from '../services/storageService';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDeleteRequest: (objective: StudyObjective) => void;
  onStatusChange: (id: string, newStatus: StudyStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const deadlineInfo = StorageService.formatDeadline(objective.deadline);

  const getStatusDisplay = (status: StudyStatus) => {
    switch (status) {
      case 'concluido':
        return {
          label: 'Concluído',
          icon: CheckCircle2,
          colorClass: 'text-emerald-700 font-medium',
          bgClass: 'bg-emerald-50/70 border-emerald-200/60',
        };
      case 'em_andamento':
        return {
          label: 'Em andamento',
          icon: Clock,
          colorClass: 'text-blue-700 font-medium',
          bgClass: 'bg-blue-50/70 border-blue-200/60',
        };
      case 'nao_iniciado':
      default:
        return {
          label: 'Não iniciado',
          icon: Circle,
          colorClass: 'text-slate-600 font-medium',
          bgClass: 'bg-slate-50/70 border-slate-200/60',
        };
    }
  };

  const statusConfig = getStatusDisplay(objective.status);
  const StatusIcon = statusConfig.icon;

  const cycleStatus = () => {
    if (objective.status === 'nao_iniciado') {
      onStatusChange(objective.id, 'em_andamento');
    } else if (objective.status === 'em_andamento') {
      onStatusChange(objective.id, 'concluido');
    } else {
      onStatusChange(objective.id, 'nao_iniciado');
    }
  };

  return (
    <article className="group bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between">
      <div>
        {/* Cabeçalho do Cartão: Título e Ações Rápidas */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3
              className={`text-base font-semibold text-slate-900 tracking-tight leading-snug ${
                objective.status === 'concluido' ? 'line-through text-slate-400' : ''
              }`}
            >
              {objective.title}
            </h3>
          </div>

          {/* Botões de Ação com Tooltips acessíveis */}
          <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
            <button
              onClick={() => onEdit(objective)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label="Editar objetivo"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteRequest(objective)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label="Excluir objetivo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Descrição */}
        {objective.description ? (
          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
            {objective.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mt-2">Sem descrição detalhada.</p>
        )}
      </div>

      {/* Rodapé do Cartão: Metadados Limpos e Seletor Rápido de Status */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Metadados tipográficos sem pílulas: Prazo e Urgência */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5 font-sans">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{deadlineInfo.formatted}</span>
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span
            className={`font-sans ${
              objective.status !== 'concluido' && deadlineInfo.isOverdue
                ? 'text-red-600 font-semibold flex items-center gap-1'
                : deadlineInfo.isToday
                ? 'text-amber-600 font-semibold'
                : 'text-slate-500'
            }`}
          >
            {objective.status !== 'concluido' && deadlineInfo.isOverdue && (
              <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
            )}
            {deadlineInfo.relativeText}
          </span>
        </div>

        {/* Controle Rápido de Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={cycleStatus}
            title="Clique para alternar o status do estudo"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border rounded-lg transition-colors cursor-pointer ${statusConfig.bgClass} ${statusConfig.colorClass}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusConfig.label}</span>
          </button>

          {/* Atalho rápido de conclusão com um clique */}
          {objective.status !== 'concluido' && (
            <button
              onClick={() => onStatusChange(objective.id, 'concluido')}
              className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="Marcar como concluído diretamente"
              aria-label="Concluir objetivo"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
