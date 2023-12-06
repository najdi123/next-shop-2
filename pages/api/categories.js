import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/Category"

export default async function handle(req, res) {
    const { method } = req
    await mongooseConnect()
    if (method === 'GET') {
        const categoryDoc = await Category.find().populate('parent')
        res.json(categoryDoc);
    }
    if (method === 'POST') {
        const { name, parentCategory, properties } = req.body
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory || undefined,
            properties,
        })
        res.json(categoryDoc)
    }
    if (method === 'PUT') {
        const { name, parentCategory, _id, properties } = req.body
        const categoryDoc = await Category.updateOne({ _id }, {
            name,
            parent: parentCategory || undefined,
            properties,
        })
        res.json(categoryDoc)
    }
    if (method === 'DELETE') {
        const { _id } = req.query;
        const deleteDoc = await Category.deleteOne({ _id })
        res.json(deleteDoc)
    }

}