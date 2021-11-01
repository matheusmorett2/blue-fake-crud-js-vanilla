const API_URL = "http://localhost:3000/categorias";
const inputField = document.getElementById("nome");
const pesquisarField = document.getElementById("pesquisar");
const tituloFormulario = document.getElementById("tituloFormulario");
const botaoEnviar = document.getElementById("botaoEnviar");
let estaEditando = false;
let idDaCategoriaQueEstouEditando;

const getCategorias = async (pesquisa) => {
  const response = await fetch(
    pesquisa ? `${API_URL}?nome=${pesquisa}` : API_URL
  );

  if (response.status === 404 && pesquisa) {
    return;
  }

  if (response.status === 404 && !pesquisa) {
    alert("Nenhuma categoria encontrada");
    return;
  }

  const categorias = await response.json();

  const ulCategorias = document.getElementById("categorias");

  let htmlCategorias = "";

  categorias.forEach((categoria) => {
    htmlCategorias += `
        <li>
            ${categoria.id} - 
            <a href='interna.html?idCategoria=${categoria.id}'>${categoria.nome}</a> 
            <button onclick='iniciarEdicao("${categoria.id}", "${categoria.nome}")'>
                Editar
            </button>
            <button onclick='deletar("${categoria.id}", "${categoria.nome}")'>
                Deletar
            </button>
        </li>`;
  });

  ulCategorias.innerHTML = htmlCategorias;
};

const cadastrar = async (event) => {
  event.preventDefault();
  const inputValue = inputField.value;

  const request = new Request(
    estaEditando ? `${API_URL}/${idDaCategoriaQueEstouEditando}` : API_URL,
    {
      method: estaEditando ? "PUT" : "POST",
      body: JSON.stringify({
        nome: inputValue,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );

  const response = await fetch(request);

  if (response.status === 409) {
    const json = await response.json();
    alert(json.message);
    return;
  }

  inputField.value = "";
  tituloFormulario.innerHTML = `Criar Categorias`;
  botaoEnviar.value = `Cadastrar Categoria`;
  estaEditando = false;
  idDaCategoriaQueEstouEditando = undefined;
  getCategorias();
};

const iniciarEdicao = (idCategoria, nomeCategoria) => {
  estaEditando = true;
  idDaCategoriaQueEstouEditando = idCategoria;
  tituloFormulario.innerHTML = `Editando Categoria ${nomeCategoria}`;
  inputField.value = nomeCategoria;
  botaoEnviar.value = `Editar categoria ${nomeCategoria}`;
};

const deletar = async (idCategoria, nomeCategoria) => {
  const confirmarDelecao = window.confirm(
    `Tem certeza que deseja deletar a categoria ${nomeCategoria}`
  );

  if (confirmarDelecao) {
    const request = new Request(`${API_URL}/${idCategoria}`, {
      method: "DELETE",
    });

    await fetch(request);
    getCategorias();
  }
};

const procurar = async (event) => {
  event.preventDefault();
  getCategorias(pesquisarField.value);
};

pesquisarField.addEventListener("input", (event) => {
  getCategorias(event.target.value);
});

getCategorias();
