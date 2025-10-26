const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 3000;

// ==============================================
// CONFIGURAÇÕES DO TOKEN E CONTROLE DE VALIDADE
// ==============================================

// 🧩 Substitua abaixo pelo SEU TOKEN REAL (NÃO publique este valor publicamente)
const TOKEN_WHATSAPP = "EAAKgoYBEaYkBPzOGnxdE1ubKOec7HwypBSjVKAcRZCwkkZAIgQUSZBxZA05ZCTRH9ZA3dPS5wW01i9tk1ZCp1ul0Mwjdktz8ZAZBis4LU1MlOuZCao9cFfOwkAbI3dvUBzIVZAWZALpci46ibhc9p5a2xb6Q8fPV8nH6jgchaFtxnNzDdNJKQfI2ZCtLaYJzCT9sebZBVh";

// 🗓️ Data de geração do token (ajuste conforme o dia que você o gerou)
const TOKEN_GERADO_EM = new Date("2025-10-26"); // formato: AAAA-MM-DD

// ⏳ Duração do token em segundos (5184000 = 60 dias)
const TOKEN_DURACAO = 5184000;

// 🧮 Calcula a data de expiração
const TOKEN_EXPIRA_EM = new Date(TOKEN_GERADO_EM.getTime() + TOKEN_DURACAO * 1000);

// 📱 Número de telefone para alertas via WhatsApp (ex: 5563991325319)
const NUMERO_ALERTA = "5563991325319";

// Função para calcular dias restantes
function diasRestantes() {
  const diffMs = TOKEN_EXPIRA_EM - new Date();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// Função para enviar mensagem via WhatsApp
async function enviarMensagemWhatsApp(mensagem, numero = NUMERO_ALERTA) {
  try {
    const resposta = await fetch("https://graph.facebook.com/v22.0/698859893318117/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN_WHATSAPP}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: { body: mensagem },
      }),
    });

    const data = await resposta.json();
    console.log("📩 Resposta do WhatsApp:", data);
    return data;
  } catch (erro) {
    console.error("❌ Erro ao enviar mensagem:", erro);
  }
}

// Função automática para checar validade do token diariamente
async function verificarValidadeToken() {
  const dias = diasRestantes();

  console.log(`⏱️ Token expira em ${dias} dias (${TOKEN_EXPIRA_EM.toLocaleDateString()})`);

  if (dias === 7 || dias === 3 || dias === 1) {
    const aviso = `⚠️ Aviso automático: seu token do WhatsApp expira em ${dias} dia(s). Gere um novo token em breve para evitar falhas.`;
    await enviarMensagemWhatsApp(aviso);
  }

  if (dias <= 0) {
    const avisoExpirado = `🚨 Seu token do WhatsApp EXPIROU hoje! Gere um novo token e atualize o arquivo server.js imediatamente.`;
    await enviarMensagemWhatsApp(avisoExpirado);
  }
}

// Agendamento diário da verificação (a cada 24h)
setInterval(verificarValidadeToken, 24 * 60 * 60 * 1000);

// ==============================================
// API DE ENVIO DE MENSAGEM NORMAL
// ==============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/enviar-whatsapp", async (req, res) => {
  const { titulo, usuario, email, plano } = req.body;

  const mensagem = `${titulo}\nUsuário Cadastrado: ${usuario}\nEmail: ${email}\nPlano Escolhido: ${plano}`;

  const data = await enviarMensagemWhatsApp(mensagem);

  res.status(200).json({ status: "Mensagem enviada", retorno: data });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  verificarValidadeToken(); // Executa verificação logo ao iniciar
});
