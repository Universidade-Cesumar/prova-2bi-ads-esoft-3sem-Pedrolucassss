const API_URL = "https://6a29f022f59cb8f65f1dd695.mockapi.io/api/v1/materiais";

function validarRetirada(estoqueAtual, quantidadeRetirada) {
  if (quantidadeRetirada <= 0) return false;
  if (quantidadeRetirada > estoqueAtual) return false;
  return true;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = { validarRetirada };
}

if (typeof document !== "undefined") {

  const inputNome       = document.getElementById("input-nome");
  const inputQuantidade = document.getElementById("input-quantidade");
  const btnCadastrar    = document.getElementById("btn-cadastrar");
  const tbody           = document.getElementById("tbody-materiais");
  const msgFeedback     = document.getElementById("msg-feedback");

  function showMsg(texto, tipo = "ok") {
    msgFeedback.textContent = texto;
    msgFeedback.className = "msg-feedback msg-" + tipo;
    setTimeout(() => {
      msgFeedback.textContent = "";
      msgFeedback.className = "msg-feedback";
    }, 3000);
  }

  function renderTabela(materiais) {
    tbody.innerHTML = "";

    if (!materiais || materiais.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="td-empty">Nenhum material cadastrado ainda.</td></tr>`;
      return;
    }

    materiais.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.nome || "—"}</td>
        <td class="td-qty">${item.quantidade ?? "—"}</td>
        <td>
          <div class="retirada-wrap">
            <input
              type="number"
              class="input-retirada"
              id="input-retirada"
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

  async function carregarMateriais() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      const dados = await res.json();
      renderTabela(dados);
    } catch {
      tbody.innerHTML = `<tr><td colspan="5" class="td-empty td-erro">Não foi possível carregar os materiais.</td></tr>`;
    }
  }

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
      if (!res.ok) throw new Error();
      inputNome.value = "";
      inputQuantidade.value = "";
      showMsg("Material cadastrado com sucesso!", "ok");
      await carregarMateriais();
    } catch {
      showMsg("Erro ao cadastrar. Tente novamente.", "erro");
    } finally {
      btnCadastrar.disabled = false;
      btnCadastrar.textContent = "Cadastrar";
    }
  }

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
      if (!res.ok) throw new Error();
      showMsg("Retirada realizada com sucesso!", "ok");
      await carregarMateriais();
    } catch {
      showMsg("Erro ao realizar a baixa. Tente novamente.", "erro");
      btn.disabled = false;
      btn.textContent = "Baixar";
    }
  }

  async function excluirMaterial(btn) {
    const id = btn.dataset.id;

    if (!confirm("Tem certeza que deseja excluir este material?")) return;

    btn.disabled = true;
    btn.textContent = "Excluindo...";

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showMsg("Material excluído com sucesso!", "ok");
      await carregarMateriais();
    } catch {
      showMsg("Erro ao excluir. Tente novamente.", "erro");
      btn.disabled = false;
      btn.textContent = "Excluir";
    }
  }

  btnCadastrar.addEventListener("click", cadastrarMaterial);

  [inputNome, inputQuantidade].forEach(el => {
    el.addEventListener("keydown", e => {
      if (e.key === "Enter") cadastrarMaterial();
    });
  });

  tbody.addEventListener("click", e => {
    const btnBaixar  = e.target.closest(".btn-baixar");
    const btnExcluir = e.target.closest(".btn-excluir");

    if (btnBaixar)  baixarMaterial(btnBaixar);
    if (btnExcluir) excluirMaterial(btnExcluir);
  });

  carregarMateriais();

}