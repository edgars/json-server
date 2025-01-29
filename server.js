const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const jsonServer = require("json-server");
const basicAuth = require("express-basic-auth"); // Importar o middleware

const app = express();
const PORT = 3000;

// Configuração da autenticação básica
const authUsers = {
  admin: "senha123", // Usuário: admin, Senha: senha123
  user: "123456",    // Usuário: user, Senha: 123456
};

// Middleware para permitir CORS e parsear JSON
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta "public" (sem autenticação)
app.use(express.static(path.join(__dirname, "public")));

// Iniciar o json-server (sem autenticação)
const jsonServerRouter = jsonServer.router(path.join(__dirname, "db.json"));
app.use("/api", jsonServerRouter); // API REST do json-server

// Rota para obter o conteúdo do db.json (sem autenticação)
app.get("/db/editor", (req, res) => {
  const filePath = path.join(__dirname, "db.json");

  // Verifica se o arquivo existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Arquivo db.json não encontrado.");
  }

  // Tenta ler o arquivo
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo db.json:", err);
      return res.status(500).send("Erro ao ler o arquivo db.json.");
    }

    // Tenta parsear o JSON
    try {
      const jsonData = JSON.parse(data); // Valida se o JSON é válido
      res.send(jsonData); // Envia o JSON parseado
    } catch (parseError) {
      console.error("Erro ao parsear o arquivo db.json:", parseError);
      return res.status(500).send("O arquivo db.json contém um JSON inválido.");
    }
  });
});

// Rota para salvar o conteúdo no db.json (sem autenticação)
app.post("/db/editor", (req, res) => {
  const content = JSON.stringify(req.body, null, 2); // Formata o JSON
  fs.writeFile(path.join(__dirname, "db.json"), content, "utf8", (err) => {
    if (err) {
      return res.status(500).send("Erro ao salvar o arquivo db.json");
    }
    res.send("Arquivo salvo com sucesso!");
  });
});

// Proteger apenas a rota do index.html com autenticação básica
app.get("/", basicAuth({
  users: authUsers,
  challenge: true, // Solicita credenciais se não forem fornecidas
  unauthorizedResponse: "Acesso não autorizado. Forneça um usuário e senha válidos.",
}), (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`API REST disponível em http://localhost:${PORT}/api`);
  console.log(`Editor disponível em http://localhost:${PORT}`);
});