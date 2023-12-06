import CategoryTableItem from "@/components/CategoryTableItem";
import Layout from "@/components/Layout";
import DeleteIcon from "@/public/assets/svgs/DeleteIcon";
import EditIcon from "@/public/assets/svgs/EditIcon";
import axios from "axios";
// import Link from "next/link";
import { useEffect, useState } from "react";

export default function Categories() {
    const [edit, setEdit] = useState(null)
    const [categories, setCategories] = useState([])
    console.log("🚀 ~ file: categories.js:12 ~ Categories ~ categories:", categories)
    const [parentCategory, setParentCategory] = useState('')
    const [properties, setProperties] = useState([])
    const getCategories = () => {
        axios.get('/api/categories').then(res => setCategories(res.data)).catch(error => console.log('get categories error: ', error))
    }
    useEffect(() => {
        getCategories()
    }, [])
    async function formAction(event) {
        event.preventDefault();
        let formData = new FormData(event.target);
        let name = formData.get('category').toString()
        console.log('formAction called', name);
        // let properties = []
        // for (const [key, value] of formData.entries()) {
        //     console.log(`yoooooooooo ${key}: ${value}`);
        //     properties.push({ [key]: value })
        // }
        // let propert = properties?.map((property, index) => {
        //     formData.get('propertyName' + index)
        // })
        // console.log('propert', propert);
        if (name.length > 0) {
            let entries = formData.entries()
            console.log("🚀 ~ file: categories.js:29 ~ formAction ~ entries:", entries)
            let newCategory
            if (edit) {
                newCategory = await axios.put('/api/categories', { name, parentCategory, _id: edit._id, properties })

            } else {
                newCategory = await axios.post('/api/categories', { name, parentCategory, properties })
            }
            console.log('newCategory', newCategory);
            if (newCategory.data._id || newCategory.data.modifiedCount) {
                document.getElementById('categoryForm').reset();
                getCategories();
                setEdit(null)
                setParentCategory('')
                setProperties([])
            }
        }
    }

    const addProperty = (e) => {
        e.preventDefault()
        setProperties(prev => ([...prev, { name: '', values: [] }]))
    }
    const handlePropertyNameChange = (e, property, index) => {
        let propertiesCopy = structuredClone(properties)
        propertiesCopy[index].name = e.target.value
        setProperties(propertiesCopy)
    }
    const handlePropertyValuesChange = (e, property, index) => {
        let propertiesCopy = structuredClone(properties)
        propertiesCopy[index].values = e.target.value.split(",")
        setProperties(propertiesCopy)
    }
    const removeProperty = (e, index) => {
        e.preventDefault()
        let propertiesCopy = properties.filter((item, index2) => index !== index2)
        setProperties(propertiesCopy)
    }
    console.log('edit', edit);
    const cancelEdit = () => {
        setEdit(null)
        setParentCategory('')
        setProperties([])
        document.getElementById('categoryForm').reset();

    }
    return (
        <Layout >
            <h1>Categories</h1>
            <label>{edit ? 'Edit Category' : 'Add New Category'}</label>
            <form onSubmit={formAction} id='categoryForm'>
                <div className="flex gap-2">
                    <input type="text" placeholder={edit ? edit.name : "Category name"} name='category' />
                    <select
                        className="border rounded-md border-blue-500 h-10 px-3"
                        value={parentCategory}
                        onChange={e => setParentCategory(e.target.value)}
                    >
                        <option value=''>No parent category</option>
                        {categories?.map((category, index) => (
                            <option key={index} value={category._id}>{category?.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-5">
                    <label className="block">Properties</label>
                    <button
                        className="btn mb-2"
                        onClick={addProperty}
                    >
                        Add new property
                    </button>
                    {properties?.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-2 mb-3">
                            <input
                                className="mb-0"
                                value={property.name}
                                onChange={(e) => handlePropertyNameChange(e, property, index)}
                                type="text"
                                name={'propertyName' + index}
                                placeholder="Property Name (example: color)"
                            />
                            <input
                                className="mb-0"
                                onChange={(e) => handlePropertyValuesChange(e, property, index)}
                                value={property.values}
                                name={'propertyValues' + index}
                                type="text" placeholder="values, comma separated"
                            />
                            <button
                                className="btn btn-warning text-white"
                                onClick={(e) => removeProperty(e, index)}
                            >
                                Remove</button>
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn-primary mb-5 h-12">Save</button>
                <button onClick={cancelEdit} className="btn ml-3 mb-5">Cencel</button>
            </form>
            <table className="basic">
                <thead>
                    <tr>
                        <td className="px-2">Category Name</td>
                        <td className="px-2">Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories?.map((category) => (
                        <CategoryTableItem
                            category={category}
                            getCategories={getCategories}
                            setEdit={setEdit}
                            setParentCategory={setParentCategory}
                            setProperties={setProperties}
                            key={category._id}
                        />
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}