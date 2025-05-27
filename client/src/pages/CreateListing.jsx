import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [tempImageUrls, setTempImageUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    regularPrice: 0,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: 'rent',
    offer: false,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Cleanup temp images on unmount or when starting a new listing
  useEffect(() => {
    return () => {
      if (tempImageUrls.length > 0) {
        fetch('/api/listing/cleanup-temp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrls: tempImageUrls }),
        });
      }
    };
    
  }, [tempImageUrls]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleImageUpload = async () => {
    if (files.length === 0) return setError('Select images first');
    if (files.length + tempImageUrls.length > 6) return setError('You can only upload up to 6 images in total.');
    setUploading(true);
    setError('');
    const data = new FormData();
    files.forEach((file) => data.append('images', file));
    try {
      const res = await fetch('/api/listing/upload-temp', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        // Append new images to previous ones
        setTempImageUrls(prev => [...prev, ...result.imageUrls].slice(0, 6));
        setFiles([]); // Optionally clear file input after upload
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch {
      setError('Upload failed');
    }
    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    setTempImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    try {
      if (tempImageUrls.length < 1) {
      setUploading(false);
      return setError('Please upload at least one image');
    }
    if(formData.regularPrice < formData.discountPrice) {
      setUploading(false);
      return setError('Regular price must be greater than or equal to discount price');
    }
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls: tempImageUrls,
          userRef: currentUser._id,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setTempImageUrls([]);
        navigate(`/listing/${result._id}`);
      } else {
        setError(result.message || 'Create failed');
      }
    } catch {
      setError('Create failed');
    }
    setUploading(false);
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form
        className='flex flex-col sm:flex-row gap-4'
        onSubmit={handleCreateListing}
      >
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            value={formData.name}
            onChange={handleChange}
            maxLength='62'
            minLength='10'
            required
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            value={formData.address}
            onChange={handleChange}
            required
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                checked={formData.type === 'sale'}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    type: prev.type === 'sale' ? '' : 'sale',
                  }))
                }
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                checked={formData.type === 'rent'}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    type: prev.type === 'rent' ? '' : 'rent',
                  }))
                }
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                checked={formData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='1'
                required
                className='p-3 border border-gray-300 rounded-lg'
                value={formData.regularPrice}
                onChange={handleChange}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  value={formData.discountPrice}
                  onChange={handleChange}
                />
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={handleImageChange}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
              value={undefined}
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageUpload}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{error && error}</p>
          {tempImageUrls.length > 0 &&
            tempImageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={`http://localhost:3000${url}`}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
            disabled={uploading}
            type='submit'
          >
            {uploading ? "Creating..." : "Create Listing"}
          </button>
          
        </div>
      </form>
    </main>
  );
}