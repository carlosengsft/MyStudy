# StudyFlow — Checklist de Projeto e Memória Técnica

> **Aplicação Web:** StudyFlow  
> **Propósito:** Gestão intuitiva e acolhedora de objetivos de estudo para estudantes iniciantes.  
> **Versão:** 1.0 (MVP Client-side)  
> **Persistência:** LocalStorage (sem backend)  
> **Linguagem / Framework:** React 19 + TypeScript + Tailwind CSS v4  

---

## 1. Mapeamento de Requisitos

### Requisitos Funcionais (RF)
- [x] **RF01 - Cadastro de Objetivo:** Permitir cadastrar meta com título, descrição, prazo (data) e status.
- [x] **RF02 - Listagem de Objetivos:** Exibir os objetivos cadastrados em cartões visuais organizados.
- [x] **RF03 - Edição de Objetivo:** Permitir alterar qualquer campo de um objetivo cadastrado existente.
- [x] **RF04 - Exclusão com Confirmação:** Permitir exclusão apenas após modal/diálogo de confirmação explícito.
- [x] **RF05 - Contadores & Métricas:** Exibir quantidade de objetivos cadastrados (total, concluídos, em andamento, pendentes).
- [x] **RF06 - Persistência Local:** Salvar dados no `localStorage` e garantir integridade após recarregar página (`F5`).

### Requisitos de Interface e Experiência (UI/UX)
- [x] **UI01 - Visual Moderno e Acolhedor:** Paleta equilibrada (60-30-10), tipografia legível (Plus Jakarta Sans + JetBrains Mono tabular), sem clichês de IA.
- [x] **UI02 - Formulário Simples:** Inputs claros com placeholders didáticos, validação em tempo real e atalhos de prazo.
- [x] **UI03 - Cartões Estruturados:** Hierarquia visual clara, sem acúmulo de pílulas estáticas (disciplina zero-pill), metadados limpos com separadores tipográficos (`·`).
- [x] **UI04 - Estados Vazios (*Empty States*):** Mensagens motivadoras e acolhedoras para quem está começando, com botão direto de ação.
- [x] **UI05 - Responsividade Total:** Perfeito em telas pequenas (smartphones), tablets e desktops amplos.
- [x] **UI06 - Idioma:** 100% em Português do Brasil (PT-BR).

### Requisitos Técnicos e Arquitetura
- [x] **TEC01 - TypeScript:** Tipagem estrita em todos os módulos e componentes.
- [x] **TEC02 - Componentização:** Separação modular de responsabilidades em `src/components/`.
- [x] **TEC03 - Tipos Isolados:** Definições de interfaces e tipos em `src/types/objective.ts`.
- [x] **TEC04 - Serviço de Armazenamento:** Camada de abstração do `localStorage` em `src/services/storageService.ts`.
- [x] **TEC05 - Sem Backend:** Execução puramente cliente, garantindo velocidade instantânea e zero dependência externa de banco.

---

## 2. Estrutura de Arquivos

```text
/
├── PROJECT_CHECKLIST.md                # Este documento de alinhamento e memória
├── index.html                          # Entry point com fontes e metatags PT-BR
├── metadata.json                       # Metadados oficiais do AI Studio
├── package.json                        # Dependências instaladas
├── src/
│   ├── types/
│   │   └── objective.ts                # Modelos de dados e tipos TypeScript
│   ├── services/
│   │   └── storageService.ts           # Serviço de persistência no localStorage
│   ├── components/
│   │   ├── Header.tsx                  # Barra superior (Top Bar Contract)
│   │   ├── StatsBar.tsx                # Contador de objetivos e barra de progresso
│   │   ├── FilterBar.tsx               # Filtro por status, busca e ordenação
│   │   ├── ObjectiveCard.tsx           # Cartão do objetivo de estudo
│   │   ├── ObjectiveFormModal.tsx      # Formulário de criação/edição com validações
│   │   ├── DeleteConfirmModal.tsx      # Modal de confirmação para exclusão segura
│   │   └── EmptyState.tsx              # Estados vazios acolhedores
│   ├── App.tsx                         # Orquestrador principal da aplicação
│   ├── main.tsx                        # Montagem React
│   └── index.css                       # Estilização Tailwind e fontes
```

---

## 3. Matriz de Cenários de Teste

| Código | Descrição do Teste | Status de Validação |
|---|---|---|
| **CT01** | Cadastrar um novo objetivo com dados válidos | APROVADO |
| **CT02** | Tentar salvar com campos obrigatórios vazios | APROVADO (validação bloqueia e avisa) |
| **CT03** | Editar título, prazo e descrição de um objetivo | APROVADO (atualiza na hora) |
| **CT04** | Alternar status (Não iniciado -> Em andamento -> Concluído) | APROVADO |
| **CT05** | Tentar excluir e confirmar exclusão | APROVADO (remove após confirmação) |
| **CT06** | Tentar excluir e cancelar no modal | APROVADO (mantém o item intacto) |
| **CT07** | Recarregar a página (F5) para testar persistência | APROVADO (localStorage recuperado) |
| **CT08** | Visualizar tela sem objetivos ou após busca sem resultados | APROVADO (empty state acolhedor) |
| **CT09** | Testar em dispositivo móvel e desktop | APROVADO (layout flexível e responsivo) |

---

*Documento mantido para referência contínua da equipe e evolução do StudyFlow.*
