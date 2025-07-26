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

  const resposta = await fetch("https://graph.facebook.com/v19.0/698859893318117/messages", {
    method: "POST",
    headers: {
      Authorization: "EAAKyGchuouoBPJB6bjJ3QskSJmrrMN2yddSAqcIzCaqDZANJ3tRRg9FmoiJbRSxZAVZBUKvb3Q6xbCUZCrSaEWBDi2bqZBsBi4OZBxaygX5T5BVSO1ARXLWZBwOzgBi45MNEiUtQILGDhYy7BdQXIihbwg7dpxuVIWFwZBv6EyEvCrwOByNRXveLT0a0EJ9XnRs7RR9ORbqWPi21lTC0db5TJ8J464QBxhWQnWnpDnGUFZCygIAZDZD",
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
