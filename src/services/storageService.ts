/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ObjectiveFormData, StudyObjective, StudyStats } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';

function getFutureDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

const INITIAL_STARTER_OBJECTIVES: StudyObjective[] = [
  {
    id: 'starter-1',
    title: 'Dominar fundamentos de Lógica e Variáveis',
    description: 'Compreender tipos primitivos, estruturas condicionais e operadores lógicos com exercícios práticos.',
    deadline: getFutureDateString(3),
    status: 'em_andamento',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'starter-2',
    title: 'Leitura do Guia de Boas Práticas de Estudo',
    description: 'Aplicar a técnica Pomodoro (25 min de foco) e criar resumo dos conceitos principais em caderno.',
    deadline: getFutureDateString(1),
    status: 'nao_iniciado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'starter-3',
    title: 'Configurar espaço e rotina de aprendizado',
    description: 'Separar local silencioso, instalar as ferramentas essenciais e definir 1 hora diária de estudo.',
    deadline: getFutureDateString(-1),
    status: 'concluido',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const StorageService = {
  getObjectives(): StudyObjective[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveObjectives(INITIAL_STARTER_OBJECTIVES);
        return INITIAL_STARTER_OBJECTIVES;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.warn('Erro ao carregar objetivos do localStorage:', error);
      return [];
    }
  },

  saveObjectives(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Falha ao salvar no localStorage:', error);
    }
  },

  addObjective(data: ObjectiveFormData): StudyObjective {
    const objectives = this.getObjectives();
    const newObjective: StudyObjective = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `obj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [newObjective, ...objectives];
    this.saveObjectives(updatedList);
    return newObjective;
  },

  updateObjective(id: string, updates: Partial<ObjectiveFormData>): StudyObjective | null {
    const objectives = this.getObjectives();
    const index = objectives.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const existing = objectives[index];
    const updated: StudyObjective = {
      ...existing,
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : existing.title,
      description: updates.description !== undefined ? updates.description.trim() : existing.description,
      updatedAt: new Date().toISOString(),
    };

    objectives[index] = updated;
    this.saveObjectives(objectives);
    return updated;
  },

  deleteObjective(id: string): boolean {
    const objectives = this.getObjectives();
    const filtered = objectives.filter((item) => item.id !== id);
    if (filtered.length === objectives.length) return false;

    this.saveObjectives(filtered);
    return true;
  },

  calculateStats(objectives: StudyObjective[]): StudyStats {
    const total = objectives.length;
    let concluidos = 0;
    let emAndamento = 0;
    let naoIniciados = 0;
    let atrasados = 0;

    const todayStr = new Date().toISOString().split('T')[0];

    for (const obj of objectives) {
      if (obj.status === 'concluido') {
        concluidos++;
      } else {
        if (obj.status === 'em_andamento') {
          emAndamento++;
        } else {
          naoIniciados++;
        }

        if (obj.deadline && obj.deadline < todayStr) {
          atrasados++;
        }
      }
    }

    const percentualConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

    return {
      total,
      concluidos,
      emAndamento,
      naoIniciados,
      atrasados,
      percentualConcluido,
    };
  },

  formatDeadline(deadlineStr: string): {
    formatted: string;
    relativeText: string;
    isOverdue: boolean;
    isToday: boolean;
  } {
    if (!deadlineStr) {
      return {
        formatted: 'Sem prazo',
        relativeText: 'Data indefinida',
        isOverdue: false,
        isToday: false,
      };
    }

    const [year, month, day] = deadlineStr.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);

    const formatted = deadlineDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(year, month - 1, day);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { formatted, relativeText: 'Vence hoje', isOverdue: false, isToday: true };
    } else if (diffDays === 1) {
      return { formatted, relativeText: 'Vence amanhã', isOverdue: false, isToday: false };
    } else if (diffDays > 1) {
      return { formatted, relativeText: `Em ${diffDays} dias`, isOverdue: false, isToday: false };
    } else {
      const pastDays = Math.abs(diffDays);
      return {
        formatted,
        relativeText: pastDays === 1 ? 'Venceu ontem' : `Atrasado há ${pastDays} dias`,
        isOverdue: true,
        isToday: false,
      };
    }
  },
};
