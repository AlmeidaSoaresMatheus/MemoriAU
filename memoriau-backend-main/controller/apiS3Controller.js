const s3Service = require('../service/apiS3Service');
const s3 = require('../s3');
const path = require('path');
const { format } = require('date-fns');
const querystring = require('querystring');


module.exports = {
  findFiles: async (req, res) => {
    const { email, nameAnimal } = req.query;
  
    if (!email || !nameAnimal) {
      return res.status(400).send('Email e nome do animal são obrigatórios.');
    }
  
    const folderKey = `${email}/${nameAnimal}/`;
  
    const params = {
      Bucket: process.env.S3_BUCKET,
      Prefix: folderKey
    };
  
    try {
      const data = await s3.listObjectsV2(params).promise();
  
      if (!data.Contents.length) {
        return res.status(404).send('Nenhuma imagem encontrada para o animal especificado.');
      }
  
      const images = await Promise.all(data.Contents.map(async (obj) => {
        const imageData = await s3.getObject({ Bucket: params.Bucket, Key: obj.Key }).promise();
        if (imageData.Body.toString('base64') !== '') {
          return {
            key: obj.Key,
            data: imageData.Body.toString('base64')
          };
        } else {
          return null;
        }
      }));
  
      const filteredImages = images.filter(image => image !== null);
  
      res.json(filteredImages);
    } catch (err) {
      console.error('Erro ao obter as imagens do S3:', err);
      res.status(500).send('Erro ao obter as imagens do S3');
    }
  },
  
  //memories
  upload: async (req, res) => {
    const { email, petName, date, description} = req.body;

    if (!req.file || !email || !petName || !description) {
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
        Key: `${email}/${petName}/${description}/${date}_${path.basename(req.file.originalname)}`,
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
  },

  findFileRecord: async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ error: 'Nao foram fornecidos todos os campos.' });
        }

        const findFileRecord = await s3Service.findFileRecord(email);

        if (findFileRecord  === "Error") {
            return res.status(400).json({ error: 'Erro ao verificar credenciais.' });
        }

        res.status(201).json(findFileRecord);
    } catch (error) {
        console.error('Erro ao verificar credenciais:', error);
        res.status(500).json({ error: 'Erro ao verificar as credenciais.' });
    }
  },

  delete: async (req, res) => {
    const { email, petName, description} = req.query;

    if (!email || !petName || !description) {
      return res.status(400).json({ error: 'Nao foram fornecidos todos os campos.' });
    }

    try {
      const petFolderExists = await checkFolderExists(`${email}/${petName}/${description}`);

      if (!petFolderExists) {
        return res.status(400).json({ error: 'Memoria nao encontrada.' });
      }

      await deleteObject(`${email}/${petName}/${description}`);

      await s3Service.deleteMemory(email, petName, description);
      
      res.status(200).json({ message: 'Memoria deletada com sucesso .' });
    }  catch (error) {
      console.error('Erro ao deletar memoria:', error);
      res.status(500).json({ error: 'Erro ao deletar memoria.' });
    }
  },

  //cadastrar imagem de "perfil" do pet
  uploadprofilePetImage: async (req, res) => {
    const { email, petName } = req.body;

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

      const currentDate = format(new Date(), 'yyyy-MM-dd');

      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${email}/${petName}/profilePet/${currentDate}_${path.basename(req.file.originalname)}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.upload(params).promise();

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

  async function deleteObject(prefix) {
      
    const params = {
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix
    };

    try {
      const listedObjects = await s3.listObjectsV2(params).promise();
  
      if (listedObjects.Contents.length === 0) return;
  
      const deleteParams = {
        Bucket: process.env.S3_BUCKET,
        Delete: { Objects: [] }
      };
  
      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });
  
      await s3.deleteObjects(deleteParams).promise();
  
      if (listedObjects.IsTruncated) await deleteObjects(prefix);
    } catch (error) {
      console.error('Erro ao deletar objetos:', error);
      throw new Error('Erro ao deletar objetos.');
    }
  };