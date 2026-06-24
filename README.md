[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/B74p-HKt)

# Almoxarifado de Enfermagem — Controle de Estoque

Sistema web para controle e gerenciamento de materiais do almoxarifado de enfermagem. Permite cadastrar, listar, retirar e excluir materiais com integração a uma API REST.

**Acesse o projeto:** [(https://universidade-cesumar.github.io/prova-2bi-ads-esoft-3sem-Pedrolucassss/)]

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Jest (testes automatizados)
- MockAPI (API REST simulada)

---

## Funcionalidades

- Cadastro de materiais com nome e quantidade
- Listagem em tempo real dos materiais em estoque
- Retirada de materiais com validacao de quantidade
- Exclusao de materiais
- Barra de pesquisa com filtro em tempo real
- Indicador visual de estoque critico (menos de 10 unidades)
- Tratamento de erros de conexao em todas as requisicoes

---

## Como Executar

Abra o arquivo `index.html` diretamente no navegador.

Para rodar os testes:

```bash
npm install
npm run test:sprint1
npm run test:sprint2
npm run test:sprint3
```

---

## Estrutura do Projeto

```
├── index.html       — Estrutura da interface
├── main.js          — Logica da aplicacao
├── style.css        — Estilos visuais
├── package.json     — Configuracao dos testes
├── __tests__/       — Testes automatizados por sprint
└── README.md        — Documentacao do projeto
```

---

## API

Base URL: `https://6a29f022f59cb8f65f1dd695.mockapi.io/api/v1/materiais`

| Metodo | Endpoint         | Descricao           |
|--------|------------------|---------------------|
| GET    | /materiais       | Lista todos         |
| POST   | /materiais       | Cadastra novo       |
| PUT    | /materiais/:id   | Atualiza quantidade |
| DELETE | /materiais/:id   | Remove material     |

---

## Sprints

**Sprint 1** — Estrutura base, listagem e cadastro de materiais.

**Sprint 2** — Retirada de estoque com validacao de regras de negocio e exclusao de materiais.

**Sprint 3** — Barra de pesquisa, dashboard com total de itens, alertas de estoque critico e tratamento de erros.
