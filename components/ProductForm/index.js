import UploadIcon from "@/public/assets/svgs/UploadIcon";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import PropertyForm from "./PropertyForm";

export default function ProductForm({
    description,
    price,
    title,
    _id,
    images: existingImages,
    category: existingCategory,
    properties: existingProperties
}) {
    const router = useRouter()
    const [images, setImages] = useState([])
    const [isUploading, setIsUploading] = useState(false)

    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState('')
    const [productProperties, setProductProperties] = useState([])
    const [parentProperties, setParentProperties] = useState([])
    console.log("🚀 ~ file: index.js:23 ~ productProperties:", productProperties)
    const getCategories = () => {
        axios.get('/api/categories').then(res => setCategories(res.data))
    }
    useEffect(() => {
        getCategories()
    }, [])
    useEffect(() => {
        if (existingProperties?.length) {
            // setImages((prevState) => [...prevState, ...existingImages]);
            setProductProperties((prevState) => [...existingProperties]);
        }
    }, [existingProperties])
    useEffect(() => {
        if (existingImages?.length) {
            // setImages((prevState) => [...prevState, ...existingImages]);
            setImages((prevState) => [...existingImages]);
        }
    }, [existingImages])
    useEffect(() => {
        if (existingCategory?.length) {
            // setImages((prevState) => [...prevState, ...existingImages]);
            setCategory(existingCategory);
        }
    }, [existingCategory])
    // let formData
    // console.log("free ~ formData:", formData)

    async function formAction(event) {
        event.preventDefault();
        let formData = new FormData(event.target);
        let data = { images, category, properties: productProperties }
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
    const addProperty = ({ name, value, quantity }) => {
        setProductProperties((prevProperties) => {
            // Check if the property already exists in the array
            const existingPropertyIndex = prevProperties.findIndex(
                (item) => item.name === name
            );

            if (existingPropertyIndex !== -1) {
                // If property exists, check if the value exists in its values array
                const existingValueIndex = prevProperties[existingPropertyIndex].values.findIndex(
                    (val) => val.value === value
                );

                if (existingValueIndex !== -1) {
                    // If value exists, update its quantity
                    prevProperties[existingPropertyIndex].values[existingValueIndex].quantity =
                        quantity;
                } else {
                    // If value does not exist, add a new value
                    prevProperties[existingPropertyIndex].values.push({
                        value,
                        quantity,
                    });
                }
            } else {
                // If property does not exist, create a new property
                prevProperties.push({
                    name,
                    values: [
                        {
                            value,
                            quantity,
                        },
                    ],
                });
            }

            return [...prevProperties]; // Return a new array to trigger a state update
        });
    };
    const getQuantityForProperty = (propertyName, propertyValue) => {
        const property = productProperties.find((item) => item.name === propertyName);
        if (property) {
            const value = property.values.find((val) => val.value === propertyValue);
            return value ? value.quantity : "";
        }
        return "";
    };

    const propertyForm = (property) => {
        return (
            <div className="flex items-center gap-1" key={property?._id ? property._id : Math.round(Math.random() * 10000)}>
                <p className="p-1 font-bold h-8">{property?.name}{": "}</p>
                {property?.values?.map((value, index) =>
                    <div key={index} className="flex mx-1 gap-1">
                        <p className=" p-1">{value}:</p>
                        <input
                            type="number"
                            className=" p-2 w-14 h-8 mb-0"
                            placeholder="0"
                            onChange={(e) => addProperty({ name: property.name, value, quantity: e.target.value })}
                            value={getQuantityForProperty(property.name, value)}
                        />
                    </div>
                )
                }
            </div>
        )
    }

    const checkAndAddParentProperties = ({ property }) => {
        console.log('checkAndAddParentProperties property', property);
    }
    const propertiesToFill = () => {
        let categoryObject
        let parentCategory
        if (categories.length > 0 && category) {
            categoryObject = categories?.filter(item => item._id === category)?.[0]
        }
        console.log("🚀 ~ file: index.js:147 ~ propertiesToFill ~ categoryObject:", categoryObject)

        return (
            <div>
                <label>Category Properties</label>
                {categoryObject?.properties?.map(property => {
                    checkAndAddParentProperties(property)
                    return (
                        propertyForm(property)
                    )
                }
                )}
                {/* <label>Parent Category Properties</label>
                {categoryObject?.parent?.properties?.map(property => (
                    propertyForm(property)
                )
                )} */}
            </div>
        )
    }

    // console.log('productInfo', productInfo)
    return (
        <form onSubmit={formAction} encType='multipart/form-data'>
            <label>Product Name</label>
            <input type="text" placeholder="Product Name" defaultValue={title ? title : ""} name='title' />
            <label className="block">Product Category</label>
            <select
                className="border rounded-md border-blue-500 h-10 px-3 my-2"
                value={category}
                onChange={e => setCategory(e.target.value)}
            >
                <option value=''>No category</option>
                {categories?.map((category, index) => (
                    <option key={index} value={category._id}>{category?.name}</option>
                ))}
            </select>
            {propertiesToFill()}
            <label className="block">
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