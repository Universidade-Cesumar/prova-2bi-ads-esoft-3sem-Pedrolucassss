const API_URL = "https://6a29f022f59cb8f65f1dd695.mockapi.io/api/v1/materiais";

function validarRetirada(estoqueAtual, quantidadeRetirada) {
  if (quantidadeRetirada <= 0) return false;
  if (quantidadeRetirada > estoqueAtual) return false;
  return true;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = { validarRetirada };
}
