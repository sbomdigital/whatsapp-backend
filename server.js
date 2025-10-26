const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Libera o acesso apenas do seu site WordPress
app.use(
  cors({
    origin: ["https://pt-br.speedypresell.com", "https://speedypresell.com"],
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função para verificar se o token está prestes a expirar
const TOKEN_EXPIRATION_SECONDS = 5182252; // 60 dias
const TOKEN_WARNING_DAYS = 5; // avisar 5 dias antes
const CREATED_AT = Date.now();
const TOKEN = "EAAKgoYBEaYkBPzOGnxdE1ubKOec7HwypBSjVKAcRZCwkkZAIgQUSZBxZA05ZCTRH9ZA3dPS5wW01i9tk1ZCp1ul0Mwjdktz8ZAZBis4LU1MlOuZCao9cFfOwkAbI3dvUBzIVZAWZALpci46ibhc9p5a2xb6Q8fPV8nH6jgchaFtxnNzDdNJKQfI2ZCtLaYJzCT9sebZBVh";

async function verificarExpiracaoToken() {
  const agora = Date.now();
  const tempoRestante =
    TOKEN_EXPIRATION_SECONDS * 1000 - (agora - CREATED_AT);
  const diasRestantes = tempoRestante / (1000 * 60 * 60 * 24);

  if (diasRestantes <= TOKEN_WARNING_DAYS) {
    await enviarAvisoWhatsApp(
      `⚠️ Atenção! Seu token de acesso do WhatsApp está prestes a expirar em aproximadamente ${Math.ceil(
        diasRestantes
      )} dias.`
    );
  }
}

// Envia mensagem de aviso
async function enviarAvisoWhatsApp(mensagem) {
  await fetch("https://graph.facebook.com/v22.0/698859893318117/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: "5563991325319",
      type: "text",
      text: { body: mensagem },
    }),
  });
}

// Endpoint principal
app.post("/enviar-whatsapp", async (req, res) => {
  const { titulo, usuario, email, plano } = req.body;

  const mensagem = `${titulo}\nUsuário: ${usuario}\nEmail: ${email}\nPlano: ${plano}`;

  const resposta = await fetch("https://graph.facebook.com/v22.0/698859893318117/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: "5563991325319",
      type: "text",
      text: { body: mensagem },
    }),
  });

  const data = await resposta.json();
  console.log("Resposta da API:", data);

  await verificarExpiracaoToken(); // verifica e avisa se necessário

  res.status(200).json({ status: "Mensagem enviada com sucesso!", retorno: data });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
