import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import HotelService from './HotelService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import amenityService from '../Amenity/amenityService';
import PolicyService from '../../../services/policyService';
import LocationService from '../../../services/locationService';

const schema = Yup.object().shape({
  name: Yup.string().required('Hotel name is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  description: Yup.string(),
  status: Yup.boolean(),
  main_image: Yup.mixed(),
  policies: Yup.array().of(Yup.number()),
  locations: Yup.array().of(Yup.number()),
  amenities: Yup.array().of(Yup.number()),
});

function HotelForm({ initialValues = {}, onSubmit, onCancel, isEditMode }) {
  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const [amenities, setAmenities] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    // Load amenities, policies, and locations
    amenityService.getAllAmenities().then(res => setAmenities(res.data.data || []));
    PolicyService.getActivePolicies().then(res => setPolicies(res.data.data || []));
    LocationService.getActiveLocations().then(res => setLocations(res.data.data || []));
    if (initialValues.main_image) setMainImage(initialValues.main_image);
    reset(initialValues);
    // eslint-disable-next-line
  }, [initialValues]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
    setValue('main_image', file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
          <Controller name="name" control={control} render={({ field }) => (
            <input {...field} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )} />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <Controller name="address" control={control} render={({ field }) => (
            <input {...field} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )} />
          {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <Controller name="city" control={control} render={({ field }) => (
            <input {...field} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )} />
          {errors.city && <span className="text-red-500 text-sm">{errors.city.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <Controller name="state" control={control} render={({ field }) => (
            <input {...field} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )} />
          {errors.state && <span className="text-red-500 text-sm">{errors.state.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <Controller name="country" control={control} render={({ field }) => (
            <input {...field} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          )} />
          {errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Controller name="status" control={control} render={({ field }) => (
            <select {...field} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          )} />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <Controller name="description" control={control} render={({ field }) => (
          <ReactQuill {...field} theme="snow" className="h-32" />
        )} />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageChange} 
          className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {mainImage && (
          <div className="mt-2">
            <img
              src={typeof mainImage === 'string' ? mainImage : URL.createObjectURL(mainImage)}
              alt="main"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 p-3 rounded-md">
          {amenities.map(amenity => (
            <label key={amenity.id} className="flex items-center space-x-2">
              <Controller
                name="amenities"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    value={amenity.id}
                    checked={field.value?.includes(amenity.id) || false}
                    onChange={e => {
                      if (e.target.checked) {
                        field.onChange([...(field.value || []), amenity.id]);
                      } else {
                        field.onChange((field.value || []).filter(id => id !== amenity.id));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                )}
              />
              <span className="text-sm">{amenity.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Policies</label>
        <Controller
          name="policies"
          control={control}
          render={({ field }) => (
            <select 
              multiple 
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              value={field.value || []}
              onChange={e => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                field.onChange(selectedOptions);
              }}
            >
              {policies.map(policy => (
                <option key={policy.id} value={policy.id}>
                  {policy.title}
                </option>
              ))}
            </select>
          )}
        />
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple policies</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Locations</label>
        <Controller
          name="locations"
          control={control}
          render={({ field }) => (
            <select 
              multiple 
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              value={field.value || []}
              onChange={e => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                field.onChange(selectedOptions);
              }}
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          )}
        />
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple locations</p>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <button 
          type="button" 
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors" 
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isEditMode ? 'Update Hotel' : 'Create Hotel'}
        </button>
      </div>
    </form>
  );
}

export default HotelForm; 