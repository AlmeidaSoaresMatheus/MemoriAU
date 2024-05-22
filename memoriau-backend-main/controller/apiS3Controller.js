const s3Service = require('../service/apiS3Service');
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
    const { email, petName, date, description} = req.body;

    if (!req.file || !email || !petName) {
      return res.status(400).send('Nao foram fornecidos todos os campos.');
    }
        try {
      const userFolderExists = await checkFolderExists(email);
      
      if (!userFolderExists) {
        await createFolder(email);
      }
  
      const petFolderExists = await checkFolderExists(`${email}/${petName}`);
  
      if (!petFolderExists) {
        await createFolder(`${email}/${petName}`);
      }
  
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${email}/${petName}/${Date.now()}_${path.basename(req.file.originalname)}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
  
      await s3.upload(params).promise();

      const newFile = await s3Service.addFileRecord(params['Key'], petName, email, date, description);
  
      res.status(200).send('Arquivo criado com sucesso');
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao enviar imagem');
    }
  }
}

  async function checkFolderExists(folderKey) {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Prefix: folderKey,
      Delimiter: '/'
    }
  
    try {
      const data = await s3.listObjectsV2(params).promise();
      return data.CommonPrefixes.length > 0;
    } catch (err) {
      console.error('Erro ao verificar a existência da pasta:', err);
      return false;
    }
  };

  async function createFolder(folderKey) {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${folderKey}/`,
      Body: ''
    };
  
    try {
      await s3.upload(params).promise();
    } catch (err) {
      console.error('Erro ao criar a pasta:', err);
      throw err;
    }
  };