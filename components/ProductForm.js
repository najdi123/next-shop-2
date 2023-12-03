import UploadIcon from "@/public/assets/svgs/UploadIcon";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({ description, price, title, _id, images: existingImages }) {
    const router = useRouter()
    const [images, setImages] = useState([])
    const [isUploading, setIsUploading] = useState(false)

    console.log('existingImages', existingImages);
    console.log('images', images);
    useEffect(() => {
        if (existingImages?.length) {
            // setImages((prevState) => [...prevState, ...existingImages]);
            setImages((prevState) => [...existingImages]);
        }
    }, [existingImages])
    // let formData
    // console.log("free ~ formData:", formData)

    async function formAction(event) {
        event.preventDefault();
        let formData = new FormData(event.target);
        let data = { images }
        for (const key of formData.keys()) {
            if (key !== 'files') {
                data = { ...data, [key]: formData.get(key).toString() }
            } else {
                console.log('formData.get(key)', formData.get(key))
                const files = data.files || [];
                data = { ...data, files: [...files, formData.get(key)] };
            }
        }
        if (_id) {
            let res = await axios.put('/api/products', { ...data, _id })
            // console.log('products update res', res.data.modifiedCount)
            res?.data?.modifiedCount && router.push('/products')
        } else {
            let res = await axios.post('/api/products', data)
            // console.log('product add res', res)
            res?.data?.price && router.push('/products')
        }

    }
    const uploadImages = async (e) => {
        const files = e.target.files;
        const formData = new FormData();

        if (files.length > 0) {
            setIsUploading(true)
            const filesArray = Array.from(files);
            filesArray.forEach((file) => {
                formData.append('file', file);
                // setImages((prevState) => [...prevState, URL.createObjectURL(file)]);
            });
        }

        try {
            const res = await axios.post('/api/uploadProductImages', formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            });
            console.log('upload res', res.data);
            setImages((prevState) => ([...prevState, ...res.data.imageUrls]))
            setIsUploading(false)
        } catch (error) {
            console.error('Error uploading images:', error);
            // Handle the error, show an error message, etc.
            setIsUploading(false)
        }
    };

    // console.log('productInfo', productInfo)
    return (
        <form onSubmit={formAction} encType='multipart/form-data'>
            <label>Product Name</label>
            <input type="text" placeholder="Product Name" defaultValue={title ? title : ""} name='title' />
            <label>
                Photos

            </label>
            <div className="mb-2">
                <label className="w-24 h-24 flex justify-center items-center text-gray-500 bg-gray-200 rounded-lg cursor-pointer">
                    <UploadIcon />
                    Upload
                    <input type="file" name='files' multiple className="hidden" onChange={uploadImages} />
                </label>
                <div className="overflow-x-auto whitespace-nowrap">
                    {/* <div className="inline-flex w-100%"> */}
                    {/* {newImages?.length ? newImages?.map((photo, index) => <div className="flex m-3 ml-0" key={index}>{console.log('photo', photo)}<img className="w-40 " src={photo} alt="" /></div>) : <p>No Photos in this Product</p>} */}
                    {!!images?.length ?
                        <ReactSortable list={images} setList={setImages} className="inline-flex w-100%">
                            {images.map((photo) =>
                                // <div className=" m-3 ml-0 m-w-40" key={photo}>
                                <img key={photo} className="w-40 object-contain m-h-60 m-3 ml-0 cursor-move" src={photo} alt="" />
                                // </div>
                            )}
                        </ReactSortable>
                        : <p>No Photos in this Product</p>}
                    {isUploading && <div className="w-40  m-h-60 m-3 ml-0 bg-gray-200 inline-flex justify-center items-center" ><div className="loading loading-ring loading-lg" /></div>}

                    {/* </div> */}
                </div>
            </div>
            <label>Description</label>
            <textarea placeholder={"Description"} defaultValue={description ? description : ""} name='description' />
            <label>Price</label>
            <input type="number" placeholder="Price" defaultValue={price ? price : ""} name='price' />
            <button type="submit" className="btn-primary">Save</button>
        </form>
    )
}