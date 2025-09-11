export const validateUserField = (name, value, formData = {}) => {
    let error = "";
    if (["first_name", "last_name"].includes(name)) {
      if (!value.trim()) error = "Este campo es obligatorio";
      else if (!/^[a-zA-Z\s]+$/.test(value)) error = "Solo letras y espacios";
    }
    if (name === "email") {
      if (!value.trim()) error = "Este campo es obligatorio";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email inválido";
    }
    if (name === "password") {
      if (!value.trim()) error = "Este campo es obligatorio";
      else if (value.length < 8) error = "Mínimo 8 caracteres";
      else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value))
        error = "Debe contener mayúscula, minúscula y número";
    }
    if (name === "confirm_password") {
      if (!value.trim()) error = "Este campo es obligatorio";
      else if (value !== formData.password) error = "Las contraseñas no coinciden";
    }
    if (name === "phone_number") {
      if (value && !/^\d{9,15}$/.test(value)) error = "Número inválido (9-15 dígitos)";
    }
    if (name === "location") {
      if (value.length > 100) error = "Máximo 100 caracteres";
    }
    if (name === "description") {
      if (value.length > 500) error = "Máximo 500 caracteres";
    }
    return error;

};