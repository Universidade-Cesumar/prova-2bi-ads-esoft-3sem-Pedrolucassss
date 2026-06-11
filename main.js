const API_URL = "https://6a29f022f59cb8f65f1dd695.mockapi.io/api/v1/materiais";

const inputNome       = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar    = document.getElementById("btn-cadastrar");
const tbody           = document.getElementById("tbody-materiais");
const msgFeedback     = document.getElementById("msg-feedback");

function showMsg(texto, tipo = "ok") {
  msgFeedback.textContent = texto;
  msgFeedback.className = "msg-feedback msg-" + tipo;
  setTimeout(() => { msgFeedback.textContent = ""; msgFeedback.className = "msg-feedback"; }, 3000);
}

function renderTabela(materiais) {
  tbody.innerHTML = "";
  if (!materiais || materiais.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="td-empty">Nenhum material cadastrado ainda.</td></tr>';
    return;
  }
  materiais.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nome || "—"}</td>
      <td class="td-qty">${item.quantidade ?? "—"}</td>
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
    tbody.innerHTML = '<tr><td colspan="3" class="td-empty td-erro">Não foi possível carregar os materiais.</td></tr>';
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

btnCadastrar.addEventListener("click", cadastrarMaterial);
[inputNome, inputQuantidade].forEach(el => {
  el.addEventListener("keydown", e => { if (e.key === "Enter") cadastrarMaterial(); });
});

carregarMateriais();
