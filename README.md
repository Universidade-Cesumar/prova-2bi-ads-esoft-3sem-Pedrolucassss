[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/B74p-HKt)

# 🔗 Projeto no Ar
**[👉 Clique aqui para acessar o sistema](https://SEU-USUARIO.github.io/SEU-REPOSITORIO)**

---

# Almoxarifado de Enfermagem — Controle de Estoque

Sistema web para gerenciamento de materiais do almoxarifado de enfermagem, desenvolvido como avaliação final.

---

## 🚀 Como Executar

Abra o arquivo `index.html` diretamente no navegador ou sirva a pasta com qualquer servidor HTTP estático.

Para rodar os testes:
```bash
npm install
npm run test:sprint1
npm run test:sprint2
npm run test:sprint3
```

---

## 📦 Sprints

### ✅ Sprint 1 — CRUD Básico
- Listagem de materiais via GET na MockAPI
- Cadastro de novo material via POST
- Renderização dinâmica na tabela

### ✅ Sprint 2 — Regras de Negócio e Saídas
- Função `validarRetirada(estoqueAtual, quantidadeRetirada)` — bloqueia negativos e valores maiores que o saldo
- Baixa de estoque via PUT com validação
- Exclusão de material via DELETE
- Delegação de eventos para botões dinâmicos

### ✅ Sprint 3 — Finalização do Produto
- **Barra de pesquisa** (`id="input-busca"`) — filtra materiais em tempo real por nome
- **Total de itens** (`id="total-itens"`) — exibe o número total de materiais cadastrados
- **Alerta de estoque crítico** — linhas com menos de 10 unidades recebem `class="estoque-critico"` e badge visual ⚠️
- **Tratamento de erros** — todos os `fetch` possuem `try/catch` com mensagens amigáveis para falhas de conexão
- **Deploy** — projeto publicado via GitHub Pages

---

## 🗂️ Estrutura de Arquivos

```
├── index.html     → Estrutura HTML da aplicação
├── main.js        → Lógica JavaScript (GET, POST, PUT, DELETE + validação + busca)
├── style.css      → Estilos visuais
├── package.json   → Configuração Jest para testes
└── README.md      → Documentação do projeto
```

---

## 🔗 API

MockAPI utilizada: `https://6a29f022f59cb8f65f1dd695.mockapi.io/api/v1/materiais`

| Operação  | Método | Endpoint         |
|-----------|--------|------------------|
| Listar    | GET    | `/materiais`     |
| Cadastrar | POST   | `/materiais`     |
| Atualizar | PUT    | `/materiais/:id` |
| Excluir   | DELETE | `/materiais/:id` |
