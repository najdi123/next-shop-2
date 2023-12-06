import Layout from "@/components/Layout";
import EditIcon from "@/public/assets/svgs/EditIcon";
import DeleteIcon from "@/public/assets/svgs/DeleteIcon";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState([])
    useEffect(() => {
        axios.get('/api/products').then(res => {
            console.log('products res.data:', res.data);
            setProducts(res.data)
        })
    }, [])
    const [categories, setCategories] = useState([])
    // const [category, setCategory] = useState('')
    const getCategories = () => {
        axios.get('/api/categories').then(res => setCategories(res.data))
    }
    useEffect(() => {
        getCategories()
    }, [])
    const getCategoryName = (categoryId) => {
        let category = categories.filter(item => item._id === categoryId)
        if (category?.[0]?.name) {
            return category?.[0]?.name
        }
    }
    return (
        <Layout>
            <div className="py-3 mb-3">
                <Link className="bg-blue-900 text-white rounded-md py-3 px-4 mt-6" href={'/products/new'}>Add new product</Link>
            </div>
            <table className="basic">
                <thead>
                    <tr>
                        <td>Product Name</td>
                        <td>Product Category</td>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product) => (
                        <tr key={product._id}>
                            <td>{product.title}</td>
                            <td>{product.category && getCategoryName(product.category)}</td>
                            <td className="flex gap-1">
                                <Link href={'/products/edit/' + product._id}>
                                    <EditIcon />
                                    Edit
                                </Link>
                                <Link href={'/products/delete/' + product._id}>
                                    <DeleteIcon />
                                    Delete
                                </Link>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}