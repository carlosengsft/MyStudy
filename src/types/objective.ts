/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudyStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: StudyStatus;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: StudyStatus;
};

export type FilterStatus = 'todos' | StudyStatus;

export type SortOption = 'prazo_proximo' | 'prazo_distante' | 'recentes' | 'alfabetica';

export interface StudyStats {
  total: number;
  concluidos: number;
  emAndamento: number;
  naoIniciados: number;
  atrasados: number;
  percentualConcluido: number;
}
