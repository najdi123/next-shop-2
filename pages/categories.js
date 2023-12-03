import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";

export default function Categories() {
    const [categories, setCategories] = useState([])

    async function formAction(event) {
        event.preventDefault();
        let formData = new FormData(event.target);
        let name = formData.get('category').toString()
        let addNewCategory = await axios.post('/api/categories', { name })
        console.log('addNewCategory', addNewCategory);
        console.log('addNewCategory._id', addNewCategory._id);
        if (addNewCategory.data._id) {
            document.getElementById('categoryForm').reset();
        }
    }
    const getCategories = () => {

    }
    return (
        <Layout >
            <h1>Categories</h1>
            <tbody>
                {products?.map((product) => (
                    <tr key={product.id}>
                        <td>{product.title}</td>
                        <td className="flex gap-1">
                            <Link href={'/products/edit/' + product._id}>
                                {/* <EditIcon /> */}
                                Edit
                            </Link>
                            <Link href={'/products/delete/' + product._id}>
                                {/* <DeleteIcon /> */}
                                Delete
                            </Link>

                        </td>
                    </tr>
                ))}
            </tbody>
            <label>Add New Category</label>
            <form onSubmit={formAction} className="flex gap-2" id='categoryForm'>
                <input type="text" placeholder="Category name" name='category' />
                <button type="submit" className="btn-primary">Save</button>
            </form>
        </Layout>
    )
}