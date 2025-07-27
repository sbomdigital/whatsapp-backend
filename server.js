const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/enviar-whatsapp", async (req, res) => {
  const { usuario, email, plano } = req.body;

  const mensagem = `Usuário Cadastrado: ${usuario}\nEmail: ${email}\nPlano Escolhido: ${plano}`;

  const resposta = await fetch("https://graph.facebook.com/v22.0/698859893318117/messages", {
    method: "POST",
    headers: {
      Authorization: "Bearer EAAKyGchuouoBPAGh5BfK9iMhVB9QVXKtzxGPVZCGCl7nS6JNBpv0a9AIJuKjCmyz3TU0WXroyE18zyycQX1xszo8iocIQkuFJz59PXw7LtE0zvRXnJvpmQ9ZAUUJAjYPRTmm57NIvXIZAQnOl88rRZBaWmRF4h0G9kVs93QIO8ZA6weCSZAWw0RRNyG3fiDGXSld31VpLJk6860j3VQucAgKWmKuirE4kdKZB2iSto7C3uGewZDZD",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: "5563985107591", // ex: 5599999999999
      type: "text",
      text: { body: mensagem },
    }),
  });

  const data = await resposta.json();
  console.log(data);

  res.status(200).json({ status: "Mensagem enviada", retorno: data });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
