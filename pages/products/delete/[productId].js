import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const { productId } = useRouter().query;
    const [productInfo, setProductInfo] = useState(null)
    const router = useRouter()

    console.log('productId', productId);
    useEffect(() => {
        productId && axios.get('/api/products?id=' + productId).then(res => {
            setProductInfo(res.data)
        }).catch((err) => console.log('err get Products', err))
    }, [productId])
    const goBack = () => {
        router.back()
    }
    const deleteProduct = async (e) => {
        e.preventDefault();
        const res = await axios.delete('/api/products?id=' + productId);
        console.log("🚀 ~ file: [productId].js:24 ~ deleteProduct ~ res:", res)
        res?.data?.deletedCount && goBack();
    };
    return (
        <Layout>
            {/* <h1 >Edit Product</h1>
            <ProductForm  {...productInfo} /> */}
            <div>
                <h4>Do you really want to delete product <strong>&quot;{productInfo?.title}&quot;</strong></h4>
                <div className="flex w-80 justify-around mt-10">
                    <button
                        className="btn btn-warning w-20"
                        onClick={deleteProduct}
                    >
                        Yes
                    </button>
                    <button className="btn w-20" onClick={goBack}>No</button>
                </div>
            </div>

        </Layout>
    )
}