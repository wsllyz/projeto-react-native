const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const dbPassword = '2ki5Xp1aEgAx49cd';
const dbName = 'Cluster';
const dbUri = `mongodb+srv://westvsantana:${dbPassword}@cluster.yaxnw.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster`;

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB Atlas com sucesso!'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB: ', err));

const localizacaoSchema = new mongoose.Schema({
    nome: String,
    latitude: Number,
    longitude: Number
});

const Localizacao = mongoose.model('Localizacao', localizacaoSchema);

app.get('/localizacao', async (req, res) => {
    try {
        const localizacoes = await Localizacao.find();
        res.json(localizacoes);
    } catch (err) {
        res.status(500).send('Erro ao buscar localizações: ' + err);
    }
});

app.post('/localizacao', async (req, res) => {
    const { nome, latitude, longitude } = req.body;
    try {
        const novaLocalizacao = new Localizacao({ nome, latitude, longitude });
        await novaLocalizacao.save();
        res.status(201).json(novaLocalizacao);
    } catch (err) {
        res.status(500).send('Erro ao criar localização: ' + err);
    }
});

app.put('/localizacao/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, latitude, longitude } = req.body;
    try {
        const localizacaoAtualizada = await Localizacao.findByIdAndUpdate(
            id,
            { nome, latitude, longitude },
            { new: true }
        );
        res.json(localizacaoAtualizada);
    } catch (err) {
        res.status(500).send('Erro ao atualizar localização: ' + err);
    }
});

app.delete('/localizacao/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletada = await Localizacao.findByIdAndDelete(id);
        if (!deletada) {
            return res.status(404).send('Localização não encontrada.');
        }
        res.json({ message: 'Localização deletada com sucesso' });
    } catch (err) {
        res.status(500).send('Erro ao deletar localização: ' + err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
