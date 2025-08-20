import React, { useEffect, useState } from 'react'
import { Label, FormGroup, Input, Button } from "reactstrap";
import * as ALlIcon from "react-icons/fa"
import SelectBox from '../../../Elements/SelectBox';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import { API_URL } from '../../../../config';

import Swal from 'sweetalert2';
import { GetAllServices } from '../../../../Store/Actions/Dashboard/servicesAction';

import { BounceLoader } from 'react-spinners';

const MasterAddService = ({ ToggleMasterAddService , data}) => {

    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(false);
    const [type, setType] = useState(data?.service_role || '')

    const [formData, setFormData] = useState({
        serviceName: data?.serviceName || '',
        icon: data?.icon || null,
        image: data?.image || null,
        details: data?.details || '',
        service_role: data?.service_role || ''
    });

    const handlechange = (e, maxLenght) => {
        const { value, name } = e.target;
        if (value.length <= maxLenght) {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB

        if (file) {
            // Check file size
            if (file.size > maxFileSize) {
                Swal.fire({
                    title: 'File Too Large',
                    text: 'Please select an image file smaller than 5MB.',
                    icon: 'error'
                });
                e.target.value = null;
                return;
            }

            // Check file extension
            const fileName = file.name;
            const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
            
            // Check MIME type
            const fileMimeType = file.type.toLowerCase();
            
            if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(fileMimeType)) {
                // Clean filename: remove spaces, special characters, and replace with underscores
                const cleanFileName = fileName
                    .replace(/[^\w\s.-]/g, '') // Remove special characters except word chars, spaces, dots, hyphens
                    .replace(/\s+/g, '_') // Replace spaces with underscores
                    .replace(/_{2,}/g, '_') // Replace multiple underscores with single underscore
                    .toLowerCase(); // Convert to lowercase
                
                // Create a new File object with the cleaned name
                const cleanedFile = new File([file], cleanFileName, {
                    type: file.type,
                    lastModified: file.lastModified
                });
                
                setFormData({ ...formData, [type]: cleanedFile });
            } else {
                Swal.fire({
                    title: 'Invalid File Type',
                    text: 'Please select a valid image file (JPG, JPEG, PNG).',
                    icon: 'error'
                });
                e.target.value = null;
            }
        }
    };

    const handleKeyPress = (e) => {
        const charCode = e.which || e.keyCode;
        const charStr = String.fromCharCode(charCode);
        if (!/^[a-zA-Z\s]+$/.test(charStr)) {
            e.preventDefault();
        }
    };

    const HandleSubmit = () => {
        const data2 = {
            ...formData,
            service_role: type?.value
        }
        
        setLoading(true);    
        const formDataSubmit = new FormData();
        formDataSubmit.append('serviceName', data2.serviceName);
        formDataSubmit.append('icon', data2.icon);
        formDataSubmit.append('image', data2.image);
        formDataSubmit.append('details', data2.details);
        formDataSubmit.append('service_role', data2.service_role);

        var apiUrl = "";
		if(data?.id!=null){
			 apiUrl = `${API_URL}/service/update/${data.id}`;
		}else{
			apiUrl = `${API_URL}/service/add`;
		}

        axios.post(apiUrl, formDataSubmit)
            .then(response => {
                console.log(response)
                setLoading(false);
                ToggleMasterAddService();
                Swal.fire(
                    'Successfully',
                    response.data.message,
                    'success'
                );
                dispatch(GetAllServices());
            })
            .catch(error => {
                setLoading(false);
                console.error('Error adding service:', error);
                Swal.fire(
                    'Error',
                    error,
                    'error'
                );
            });
    };

    return (
        <div className='position-relative'>
            <div className={`${Loading ? "d-flex" : "d-none"} align-items-center justify-content-center`} style={{ zIndex: "10", background: "rgba(0,0,0,0.6)", position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
                <BounceLoader
                    color="#fff83f"
                    loading={Loading}
                />
            </div>
            <FormGroup>
                <Label for="serviceName">Service Name</Label>
                <Input
                    type="text"
                    name="serviceName"
                    defaultValue={formData?.serviceName}
                    onChange={(e) => handlechange(e, 50)}
                    onKeyPress={handleKeyPress}
                    placeholder="Service Name"
                />
            </FormGroup>
            <FormGroup>
                <Label for="icon">Upload Icon</Label>
                <Input
                    type="file"
                    name="icon"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => handleImageUpload(e, 'icon')}
                />
                <small className="text-muted">Accepted formats: JPG, JPEG, PNG (Max: 5MB)</small>
            </FormGroup>
            <FormGroup>
                <Label for="image">Choose Image</Label>
                <Input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => handleImageUpload(e, 'image')}
                />
                <small className="text-muted">Accepted formats: JPG, JPEG, PNG (Max: 5MB)</small>
            </FormGroup>
            <FormGroup>
                <Label for="details">Details (360 characters)</Label>
                <Input
                    type='textarea'
                    name='details'
                    defaultValue={formData?.details}
                    onChange={(e) => handlechange(e, 360)}
                    placeholder='Type details here...'
                />
            </FormGroup>
            {/* <FormGroup>
                <Label for="details">Service Type</Label>
                <SelectBox
                    initialValue={type}
                    options={serviceType}
                    setSelcted={setType}
                />
            </FormGroup> */}
            <Button type='button' onClick={HandleSubmit}> {data?.id ? 'Update' : 'Submit'}</Button>
        </div>
    );
};
export default MasterAddService