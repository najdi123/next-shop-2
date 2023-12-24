import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
    const { productId } = useRouter().query;
    const [productInfo, setProductInfo] = useState(null)

    console.log('productId', productId);
    useEffect(() => {
        productId && axios.get('/api/products?id=' + productId).then(res => {
            setProductInfo(res.data)
        }).catch((err) => console.log('err get Products', err))
    }, [productId])
    return (
        <Layout>
            <h1 >Edit Product</h1>
            <ProductForm  {...productInfo} />
        </Layout>
    )
}