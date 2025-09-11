// src/hooks/useForm.js
import { useState } from "react";

export const useForm = (initialData, validateField) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (validateField) {
      const error = validateField(name, value, { ...formData, [name]: value });
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profile_picture: e.target.files[0] }));
    }
  };

  return { formData, setFormData, errors, setErrors, handleChange, handleFileChange };
};
