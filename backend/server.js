const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/contato', async (req, res) => {
    const { nome, email, mensagem } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Novo Contato Portfólio: ${nome}`,
            text: mensagem
        });
        res.status(200).send({ msg: "Mensagem enviada com sucesso!" });
    } catch (error) {
        res.status(500).send({ msg: "Erro ao enviar." });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));