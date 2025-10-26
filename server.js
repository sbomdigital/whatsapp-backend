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
  const { titulo, usuario, email, plano } = req.body;

  const mensagem = `${titulo}\nUsuário Cadastrado: ${usuario}\nEmail: ${email}\nPlano Escolhido: ${plano}`;

  const resposta = await fetch("https://graph.facebook.com/v22.0/698859893318117/messages", {
    method: "POST",
    headers: {
      Authorization: "Bearer EAAKgoYBEaYkBP3480EyZCz8nxirdrLbArlWoHveSuV6kivIZAz2QGkiYvXZAdlFnzvZBrZBnmJ5msMEFuCJhKdBsP0wh6gYYhbhaePclDZADeEcnWlpuuNmCkuBcm2ZBNxh5oVWhQ1bSidRaL7pcYsDwJ4g7TjGWcTFcZAhit2HjuaSwbZAt0jpMT51JIqcVVjQM4",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: "5563991325319", // ex: 5599999999999
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
