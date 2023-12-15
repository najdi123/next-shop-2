import UploadIcon from '@/public/assets/svgs/UploadIcon';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import PropertyForm from './PropertyForm';

export default function ProductForm({
  description,
  price,
  title,
  _id,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
}) {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [productProperties, setProductProperties] = useState([]);
  const [parentProperties, setParentProperties] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);

  const getCategories = () => {
    axios
      .get('/api/categories')
      .then((res) => setCategories(res.data))
      .catch((error) => console.log('get categpries error: ', error));
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (existingProperties?.length) {
      setProductProperties((prevState) => [...existingProperties]);
    }
  }, [existingProperties]);

  useEffect(() => {
    if (existingImages?.length) {
      setImages((prevState) => [...existingImages]);
    }
  }, [existingImages]);

  useEffect(() => {
    if (existingCategory?.length) {
      setCategory(existingCategory);
    }
  }, [existingCategory]);

  async function formAction(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let data = { images, category, properties: [...productProperties, ...parentProperties] };

    for (const key of formData.keys()) {
      if (key !== 'files') {
        data = { ...data, [key]: formData.get(key).toString() };
      } else {
        const files = data.files || [];
        data = { ...data, files: [...files, formData.get(key)] };
      }
    }

    if (_id) {
      let res = await axios.put('/api/products', { ...data, _id });
      res?.data?.modifiedCount && router.push('/products');
    } else {
      let res = await axios.post('/api/products', data);
      res?.data?.price && router.push('/products');
    }
  }

  const uploadImages = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    if (files.length > 0) {
      setIsUploading(true);
      const filesArray = Array.from(files);
      filesArray.forEach((file) => {
        formData.append('file', file);
      });
    }

    try {
      const res = await axios.post('/api/uploadProductImages', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      setImages((prevState) => [...prevState, ...res.data.imageUrls]);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading images:', error);
      setIsUploading(false);
    }
  };

  const addProperty = ({ name, value, quantity }) => {
    setProductProperties((prevProperties) => {
      const existingPropertyIndex = prevProperties.findIndex((item) => item.name === name);

      if (existingPropertyIndex !== -1) {
        const existingValueIndex = prevProperties[existingPropertyIndex].values.findIndex((val) => val.value === value);

        if (existingValueIndex !== -1) {
          prevProperties[existingPropertyIndex].values[existingValueIndex].quantity = quantity;
        } else {
          prevProperties[existingPropertyIndex].values.push({
            value,
            quantity,
          });
        }
      } else {
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

      return [...prevProperties];
    });
  };

  const getQuantityForProperty = (propertyName, propertyValue) => {
    const property = productProperties.find((item) => item.name === propertyName);
    if (property) {
      const value = property.values.find((val) => val.value === propertyValue);
      return value ? value.quantity : '';
    }
    return '';
  };

  const propertyForm = (property) => {
    return (
      <div
        className="flex items-center gap-1 mb-2"
        key={property?._id ? property._id : Math.round(Math.random() * 10000)}
      >
        <p className="p-1 font-bold h-8">
          {property?.name}
          {': '}
        </p>
        {property?.values?.map((value, index) => (
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
        ))}
      </div>
    );
  };

  const checkAndAddParentProperties = (categoryObject) => {
    console.log('categoryObject', categoryObject);
    if (
      (typeof categoryObject?.parent === 'string' && categoryObject?.parent.length > 0) ||
      categoryObject?.parent?._id?.length > 0
    ) {
      let id;
      if (typeof categoryObject?.parent === 'string') {
        id = categoryObject?.parent;
      } else if (categoryObject?.parent?._id) {
        id = categoryObject?.parent?._id;
      }
      const parentCat = categories.find(({ _id }) => _id === id);

      setParentCategories((prev) => [...prev, parentCat]);
      parentCat.properties.map((property) => {
        setParentProperties((prev) => [...prev, property]);
      });
      if (parentCat?.parent) {
        checkAndAddParentProperties(parentCat);
      }
    }
  };

  useEffect(() => {
    if (categories.length > 0 && category) {
      let categoryObject = categories?.filter((item) => item._id === category)?.[0];
      setParentCategories([]);
      setParentProperties([]);
      checkAndAddParentProperties(categoryObject);
    }
  }, [categories, category]);

  const propertiesToFill = () => {
    let categoryObject;

    if (categories.length > 0 && category) {
      categoryObject = categories?.filter((item) => item._id === category)?.[0];
    }

    return (
      <div>
        <label>Category Properties</label>
        {categoryObject?.properties?.map((property) => {
          return propertyForm(property);
        })}
        <label>Parent Category Properties</label>
        {parentProperties?.map((property) => {
          return propertyForm(property);
        })}
      </div>
    );
  };

  return (
    <form onSubmit={formAction} encType="multipart/form-data">
      <label>Product Name</label>
      <input type="text" placeholder="Product Name" defaultValue={title ? title : ''} name="title" />
      <label className="block">Product Category</label>
      <select
        className="border rounded-md border-blue-500 h-10 px-3 my-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">No category</option>
        {categories?.map((category, index) => (
          <option key={index} value={category._id}>
            {category?.name}
          </option>
        ))}
      </select>
      {propertiesToFill()}
      <label className="block">Photos</label>
      <div className="mb-2">
        <label className="w-24 h-24 flex justify-center items-center text-gray-500 bg-gray-200 rounded-lg cursor-pointer">
          <UploadIcon />
          Upload
          <input type="file" name="files" multiple className="hidden" onChange={uploadImages} />
        </label>
        <div className="overflow-x-auto whitespace-nowrap">
          {!!images?.length ? (
            <ReactSortable list={images} setList={setImages} className="inline-flex w-100%">
              {images.map((photo) => (
                <img key={photo} className="w-40 object-contain m-h-60 m-3 ml-0 cursor-move" src={photo} alt="" />
              ))}
            </ReactSortable>
          ) : (
            <p>No Photos in this Product</p>
          )}
          {isUploading && (
            <div className="w-40 m-h-60 m-3 ml-0 bg-gray-200 inline-flex justify-center items-center">
              <div className="loading loading-ring loading-lg" />
            </div>
          )}
        </div>
      </div>
      <label>Description</label>
      <textarea placeholder={'Description'} defaultValue={description ? description : ''} name="description" />
      <label>Price</label>
      <input type="number" placeholder="Price" defaultValue={price ? price : ''} name="price" />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
