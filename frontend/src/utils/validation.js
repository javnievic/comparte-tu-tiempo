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

export const validateTransactionField = (name, value = {}) => {
  let error = "";

  if (name === "title") {
    if (!value.trim()) error = "El título es obligatorio";
    else if (value.length > 100) error = "Máximo 100 caracteres";
  }

  if (name === "text") {
    if (value.length > 500) error = "Máximo 500 caracteres";
  }

  if (name === "duration") {
    if (!value.trim()) error = "La duración es obligatoria";
    else if (!/^\d{2}:\d{2}:\d{2}$/.test(value)) error = "Formato debe ser HH:MM:SS";
    else {
      const [hh, mm, ss] = value.split(":").map(Number);
      if (hh > 24 || mm > 59 || ss > 59) error = "Duración inválida";
    }
  }

  return error;
};

export const validateFormFields = (formData, fields, validateFn) => {
  const errors = {};

  const safeKey = (key) => {
    // solo permitir claves que sean strings y no peligrosas
    return typeof key === "string" && !["__proto__", "constructor", "prototype"].includes(key);
  };

  fields.forEach((field) => {
    if (!safeKey(field)) return; // ignorar campos inseguros
    const error = validateFn(field, formData[field], formData);
    if (error) errors[field] = error;
  });

  return errors;
};