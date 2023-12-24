import DeleteIcon from "@/public/assets/svgs/DeleteIcon";
import EditIcon from "@/public/assets/svgs/EditIcon";
import axios from "axios";

export default function CategoryTableItem({ category,
    getCategories,
    setEdit,
    setParentCategory,
    setProperties
}) {
    const editCurrentCategory = (category) => {
        setEdit(category)
        setProperties(category.properties)
        category?.parent?._id ? setParentCategory(category.parent._id) : setParentCategory('')
    }
    const deleteCategory = async (category) => {
        console.log('category', category);
        const deleteRes = await axios.delete('/api/categories?_id=' + category._id)
        if (deleteRes.data.deletedCount) {
            getCategories()
        }
    }

    return (
        <tr >
            <td className=" px-3 flex items-center"><p>{category?.name}</p></td>
            <td className=" px-3 flex items-center"><p>{category?.parent?.name}</p></td>
            <td className="flex gap-3 p-2 flex-col sm:flex-row">
                <button
                    className="btn btn-warning text-white"
                    onClick={() => editCurrentCategory(category)}
                >
                    <EditIcon />
                    Edit
                </button>
                <button
                    onClick={() => {
                        document.getElementById('delete_modal_' + category._id).showModal()
                    }}
                    className="flex p-3 btn  rounded-md  gap-1 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                >
                    <DeleteIcon />
                    Delete
                </button>
                <dialog id={"delete_modal_" + category._id} className="modal">
                    <div className="modal-box">
                        <p className="py-4 inline">Are you sure you want to delete the category</p>
                        <h3 className="font-bold text-lg inline px-2">&quot;{category.name}&quot;</h3>
                        <div className="modal-action">
                            <form method="dialog" className="flex gap-5">
                                {/* if there is a button in form, it will close the modal */}
                                <button
                                    onClick={() => deleteCategory(category)}
                                    className="flex p-3  rounded-md  gap-1 text-white bg-red-700 hover:bg-red-800"
                                >Delete</button>
                                <button className="btn bg-gray-400 text-white">Cancel</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </td>
        </tr>
    )
}