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
      Authorization: "EAAKyGchuouoBPOhyqV0XoEZAC2y2wk1KvLmVRpdAgsB5XjmEwlgtngcEZCpKhizEsIH9gaAgZAmZCqxqgsPXwDtytCQpm3LliUMMHP6EIGQXuEC6VNPhH7HFSncZAM1TnHsMxzW3vFHAnywDZB2zXOPZAlqAIABTHaSzvyOKGPAZBxk6ZAi8BktJ6tCTkHTgU9m1I8eiRRQvckimoSLifb7ZAQRoKaWeYOa1Iq0Nssbh3HJrioxAUZD",
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
