const petService = require('../service/apiPetService');
const s3 = require('../s3');
const path = require('path'); //

module.exports = {
  findAll: async (req, res) => {
    const { key } = req.params;

    // Parâmetros para obter a imagem do S3
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key
    };

    try {
      const data = await s3.getObject(params).promise();

      res.set('Content-Type', data.ContentType);

      res.send(data.Body);
    } catch (err) {
      console.error('Erro ao obter a imagem do S3:', err);
      res.status(500).send('Erro ao obter a imagem do S3');
    }
  },

  upload: async (req, res) => {
    const { name } = req.body;

    if (!req.file || !name) {
      return res.status(400).send('Imagem ou nome do pet nao fornecido.');
    }

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${name}/${Date.now()}_${path.basename(req.file.originalname)}`, // Cria uma pasta com o nome do pet
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {
      await s3.upload(params).promise();
      res.status(200).send('Imagem enviada com sucesso');
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao enviar imagem');
    }
  }
}