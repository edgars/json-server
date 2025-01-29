require.config({ paths: { vs: "https://unpkg.com/monaco-editor@0.33.0/min/vs" } });

let editor;

require(["vs/editor/editor.main"], function () {
  // Inicializar o Monaco Editor
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: "", // Inicialmente vazio
    language: "json",
    theme: "vs-dark",
  });

  // Botão de carregar
  document.getElementById("carregar").addEventListener("click", () => {
    fetch("/db/editor")
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Erro ao carregar o arquivo.");
        }
        return response.json();
      })
      .then((data) => {
        editor.setValue(JSON.stringify(data, null, 2));
        document.getElementById("mensagem").textContent = "Arquivo carregado com sucesso!";
      })
      .catch((error) => {
        console.error("Erro ao carregar db.json:", error);
        document.getElementById("mensagem").textContent = "Erro ao carregar o arquivo.";
      });
  });

  // Botão de salvar
  document.getElementById("salvar").addEventListener("click", () => {
    const content = editor.getValue();
    fetch("/db/editor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: content,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao salvar o arquivo.");
        }
        return response.text();
      })
      .then((mensagem) => {
        document.getElementById("mensagem").textContent = mensagem;
      })
      .catch((error) => {
        console.error("Erro ao salvar:", error);
        document.getElementById("mensagem").textContent = "Erro ao salvar o arquivo.";
      });
  });
});