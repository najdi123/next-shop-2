const { mongooseConnect } = require("@/lib/mongoose")
const Product = require("@/models/Product");

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }))
        } else {
            res.json(await Product.find())
        }

    }
    if (method === 'POST') {
        const { title, description, price, images, files } = req.body;
        const productDoc = await Product.create({
            title, description, price, images, files
        })
        res.json(productDoc)
    }
    if (method === 'PUT') {
        const { title, description, price, _id, images, files } = req.body;
        const productDoc = await Product.updateOne({ _id }, {
            title, description, price, images, files
        })
        res.json(productDoc)
    }
    if (method === 'DELETE') {
        if (req.query?.id) {
            const deleteProductRes = await Product.deleteOne({ _id: req.query?.id })
            res.json(deleteProductRes)
        }

    }
}
