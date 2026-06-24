const API_URL = "https://6a29f022f59cb8f65f1dd695.mockapi.io/api/v1/materiais";

// ─── Sprint 2: Validação de Retirada ────────────────────────────────────────

/**
 * Valida se a retirada é permitida.
 * @param {number} estoqueAtual       - Quantidade atual no estoque.
 * @param {number} quantidadeRetirada - Quantidade que se deseja retirar.
 * @returns {boolean} true se válido, false se inválido.
 */
function validarRetirada(estoqueAtual, quantidadeRetirada) {
  if (quantidadeRetirada <= 0) return false;
  if (quantidadeRetirada > estoqueAtual) return false;
  return true;
}

// ─── Exporta para testes Jest ────────────────────────────────────────────────
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = { validarRetirada };
}

// ─── Guarda de ambiente: só executa no browser ───────────────────────────────
if (typeof document !== "undefined") {

  const inputNome       = document.getElementById("input-nome");
  const inputQuantidade = document.getElementById("input-quantidade");
  const btnCadastrar    = document.getElementById("btn-cadastrar");
  const tbody           = document.getElementById("tbody-materiais");
  const msgFeedback     = document.getElementById("msg-feedback");
  const inputBusca      = document.getElementById("input-busca");
  const totalItens      = document.getElementById("total-itens");

  // Cache dos materiais carregados para filtrar localmente
  let todosMateriais = [];

  // ── Utilitários ──────────────────────────────────────────────────────────

  function showMsg(texto, tipo = "ok") {
    msgFeedback.textContent = texto;
    msgFeedback.className = "msg-feedback msg-" + tipo;
    setTimeout(() => {
      msgFeedback.textContent = "";
      msgFeedback.className = "msg-feedback";
    }, 3000);
  }

  // ── Sprint 3: Dashboard ───────────────────────────────────────────────────

  function atualizarDashboard(materiais) {
    totalItens.textContent = materiais.length;
  }

  // ── Renderização ─────────────────────────────────────────────────────────

  function renderTabela(materiais) {
    tbody.innerHTML = "";

    if (!materiais || materiais.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="td-empty">Nenhum material encontrado.</td></tr>`;
      return;
    }

    materiais.forEach((item, index) => {
      const tr = document.createElement("tr");

      // Sprint 3: estoque crítico (menos de 10 unidades)
      if (item.quantidade < 10) {
        tr.classList.add("estoque-critico");
      }

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.nome || "—"}</td>
        <td class="td-qty">
          ${item.quantidade ?? "—"}
          ${item.quantidade < 10 ? '<span class="badge-critico">⚠️ Baixo</span>' : ""}
        </td>
        <td>
          <div class="retirada-wrap">
            <input
              type="number"
              id="input-retirada"
              class="input-retirada"
              placeholder="Qtd"
              min="1"
              max="${item.quantidade}"
              data-item-id="${item.id}"
            />
            <button
              class="btn-baixar"
              data-id="${item.id}"
              data-estoque="${item.quantidade}"
            >Baixar</button>
          </div>
        </td>
        <td>
          <button class="btn-excluir" data-id="${item.id}">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ── Sprint 3: Filtro de Busca ─────────────────────────────────────────────

  function filtrarMateriais() {
    const termo = inputBusca.value.trim().toLowerCase();
    const filtrados = todosMateriais.filter(item =>
      (item.nome || "").toLowerCase().includes(termo)
    );
    renderTabela(filtrados);
    // total-itens sempre mostra o total geral, não o filtrado
    atualizarDashboard(todosMateriais);
  }

  // ── GET ──────────────────────────────────────────────────────────────────

  async function carregarMateriais() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar materiais");
      const dados = await res.json();
      todosMateriais = dados;
      atualizarDashboard(dados);
      filtrarMateriais(); // aplica filtro ativo ao recarregar
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="5" class="td-empty td-erro">⚠️ Sem conexão. Verifique sua internet e tente novamente.</td></tr>`;
    }
  }

  // ── POST ─────────────────────────────────────────────────────────────────

  async function cadastrarMaterial() {
    const nome       = inputNome.value.trim();
    const quantidade = inputQuantidade.value.trim();

    if (!nome || quantidade === "") {
      showMsg("Preencha o nome e a quantidade.", "erro");
      return;
    }

    btnCadastrar.disabled = true;
    btnCadastrar.textContent = "Salvando...";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, quantidade: Number(quantidade) })
      });
      if (!res.ok) throw new Error("Erro ao cadastrar material");
      inputNome.value = "";
      inputQuantidade.value = "";
      showMsg("Material cadastrado com sucesso!", "ok");
      await carregarMateriais();
    } catch (err) {
      console.error(err);
      showMsg("Erro ao cadastrar. Verifique sua conexão e tente novamente.", "erro");
    } finally {
      btnCadastrar.disabled = false;
      btnCadastrar.textContent = "Cadastrar";
    }
  }

  // ── PUT (baixa de estoque) ────────────────────────────────────────────────

  async function baixarMaterial(btn) {
    const id           = btn.dataset.id;
    const estoqueAtual = Number(btn.dataset.estoque);

    const tr             = btn.closest("tr");
    const inputRetirada  = tr.querySelector(".input-retirada");
    const quantidadeRetirada = Number(inputRetirada.value);

    if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
      if (inputRetirada.value === "") {
        showMsg("Informe a quantidade a retirar.", "erro");
      } else if (quantidadeRetirada <= 0) {
        showMsg("A quantidade deve ser maior que zero.", "erro");
      } else {
        showMsg(`Quantidade indisponível. Estoque atual: ${estoqueAtual}.`, "erro");
      }
      return;
    }

    btn.disabled = true;
    btn.textContent = "Baixando...";

    const novaQuantidade = estoqueAtual - quantidadeRetirada;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade: novaQuantidade })
      });
      if (!res.ok) throw new Error("Erro ao realizar baixa");
      showMsg("Retirada realizada com sucesso!", "ok");
      await carregarMateriais();
    } catch (err) {
      console.error(err);
      showMsg("Erro ao realizar a baixa. Verifique sua conexão.", "erro");
      btn.disabled = false;
      btn.textContent = "Baixar";
    }
  }

  // ── DELETE ───────────────────────────────────────────────────────────────

  async function excluirMaterial(btn) {
    const id = btn.dataset.id;

    if (!confirm("Tem certeza que deseja excluir este material?")) return;

    btn.disabled = true;
    btn.textContent = "Excluindo...";

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir material");
      showMsg("Material excluído com sucesso!", "ok");
      await carregarMateriais();
    } catch (err) {
      console.error(err);
      showMsg("Erro ao excluir. Verifique sua conexão.", "erro");
      btn.disabled = false;
      btn.textContent = "Excluir";
    }
  }

  // ── Event Listeners ──────────────────────────────────────────────────────

  btnCadastrar.addEventListener("click", cadastrarMaterial);

  [inputNome, inputQuantidade].forEach(el => {
    el.addEventListener("keydown", e => {
      if (e.key === "Enter") cadastrarMaterial();
    });
  });

  // Sprint 3: filtro em tempo real
  inputBusca.addEventListener("input", filtrarMateriais);

  // Delegação de eventos para botões dinâmicos da tabela
  tbody.addEventListener("click", e => {
    const btnBaixar  = e.target.closest(".btn-baixar");
    const btnExcluir = e.target.closest(".btn-excluir");

    if (btnBaixar)  baixarMaterial(btnBaixar);
    if (btnExcluir) excluirMaterial(btnExcluir);
  });

  // ── Inicialização ────────────────────────────────────────────────────────

  carregarMateriais();

} // fim do guard de browser
