import { isAdminRequest } from './auth/[...nextauth]';

const multiparty = require('multiparty');
// to run locally
// .\minio.exe server C:\minio
const Minio = require('minio');
const { mongooseConnect } = require("@/lib/mongoose")


export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res)

    const form = new multiparty.Form(config);
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log('err', err);
                return res.json('error in upload', err);
            }
            resolve({ fields, files });
        });
    });

    const minioClient = new Minio.Client({
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: 'minioadmin',
        secretKey: 'minioadmin',
    });

    const metaData = {
        'Content-Type': 'image/jpeg',
        'Content-Language': 'en',
    };

    const uploadPromises = files.file.map(async (file) => {
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '' + Math.round(Math.random() * 100) + '.' + ext;

        return new Promise((resolve, reject) => {
            minioClient.fPutObject('next-shop-2', newFilename, file.path, metaData, (err, objInfo) => {
                if (err) {
                    console.log('minioClient.fPutObject error: ', err);
                    reject(err);
                } else {
                    const imageUrl = `http://127.0.0.1:9000/next-shop-2/${newFilename}`;
                    console.log('imageUrl', imageUrl);
                    resolve(imageUrl);
                }
            });
        });
    });

    try {
        const imageUrls = await Promise.all(uploadPromises);
        return res.json({ imageUrls });
    } catch (error) {
        console.error('Error during file upload:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const config = {
    api: { bodyParser: false },
};
