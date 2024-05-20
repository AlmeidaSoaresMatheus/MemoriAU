const petService = require('../service/apiPetService');
const s3 = require('../s3');


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
      }
}