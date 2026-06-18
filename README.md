[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/B74p-HKt)

# Almoxarifado de Enfermagem - Controle de Estoque

Sistema de gerenciamento para controle interno de insumos e materiais de enfermagem. Desenvolvido para facilitar o fluxo de entrada, saída e descarte de materiais de forma segura e responsiva.

# Funcionalidades da Sprint 2

- **Validação de Baixa Segura:** Implementação de regras de negócio rígidas que impedem a retirada de quantidades negativas, nulas ou superiores ao volume disponível em estoque.
- **Módulo de Retirada (PUT):** Atualização dinâmica do banco de dados ao realizar retiradas parciais de materiais.
- **Módulo de Exclusão (DELETE):** Remoção completa de itens obsoletos ou cadastrados erroneamente com confirmação de segurança.

#  Contrato de Endpoints Utilizados (MockAPI)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/materiais` | Retorna a lista de todos os materiais cadastrados |
| **POST** | `/materiais` | Cadastra um novo material |
| **PUT** | `/materiais/:id` | Atualiza a quantidade após uma retirada |
| **DELETE** | `/materiais/:id` | Remove permanentemente o material do sistema |