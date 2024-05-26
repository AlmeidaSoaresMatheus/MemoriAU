const timelineService = require('../service/apiTimelineService');
const s3 = require('../s3');
const path = require('path'); 


module.exports = {
    findFilesAndRecords: async (req, res) => {
        const { email, nameAnimal } = req.query;
  
        if (!email || !nameAnimal) {
          return res.status(400).send('Email e nome do animal são obrigatórios.');
        }

        try {
        
            const files = await timelineService.findFileRecord(email, nameAnimal);

            if (!files.length) {
                return res.status(404).send('Nenhum registro encontrado para o animal especificado.');
            }

            const folderKey = `${email}/${nameAnimal}/`;
        
            const params = {
            Bucket: process.env.S3_BUCKET,
            Prefix: folderKey
            };
    
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

            const combinedResults = files.map(file => {
                const image = filteredImages.find(img => img.key === file.nameFile);
                return {
                  id: file.id,
                  nameFile: file.nameFile,
                  nameAnimal: file.namePet,
                  email: file.email,
                  date: file.date,
                  descriptionFile: file.descriptionFile,
                  image: image ? image.data : null  // Adicionar imagem em base64 se disponível
                };
              });
          
            combinedResults.sort((a, b) => new Date(a.date) - new Date(b.date));

            res.json(combinedResults);
        } catch (err) {
            console.error('Erro ao obter as imagens do S3:', err);
            res.status(500).send('Erro ao obter as imagens do S3');
        }
    },
}