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
      Authorization: "Bearer EAAKyGchuouoBPKGSVKldamzjC3rnsXaQM9lSfn8UUYQIahBgbkZCcfytdf5SbDxsBesO9C3JiBZBVS5oyVdko5yRREVICQdp4kSbZC3kWQ4JqJFcxZAedLiaNpl7ODByY2w7sL1wXm9vylsLLkFYUONEwH4IoTbFmAAc7hHKs1ZCbt9dZCUrzILR3qjcq1dSA7fxgcNldhNBxNlJJ3ZCSLLV1pf61U76Rl6WrsfK62TfNNYgAZDZD",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: "556391325319", // ex: 5599999999999
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
