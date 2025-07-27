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
      Authorization: "Bearer EAAKgoYBEaYkBPLI8mlhuEFxxXrBVHvKLYymcaMZBa0QCQIrsZCG8GERFdzprD5J1omxDFYZCV8FREO44qyfmHSqlOj5wdN8dBTHf50N0CZBS60fbq1X8GSnRx2yhwCBZAh4PZAYhHeQPlgdgmrYmZBJciWicbPy9Q5Ch2xesDHg9IlsUe5LhAuHicjWY6eHqMLYOj4WZBH6EraluEwZBEvpJY2VlJ0V76Ml5hq6sJaXNskCphUAZDZD",
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
