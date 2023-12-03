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
    return (
        <Layout>
            <div className="py-3 mb-3">
                <Link className="bg-blue-900 text-white rounded-md py-3 px-4 mt-6" href={'/products/new'}>Add new product</Link>
            </div>
            <table className="basic">
                <thead>
                    <tr>
                        <td>Product Name</td>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product) => (
                        <tr key={product.id}>
                            <td>{product.title}</td>
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