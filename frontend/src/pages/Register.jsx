import { useState } from "react";
import { registerUser } from "../services/authService";

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      console.log("Registro exitoso", response);
    } catch (error) {
      console.error("Error en el registro", error);
    }
  };

  return (
    <div className="register-container">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="Nombre" onChange={handleChange} />
        <input name="last_name" placeholder="Apellidos" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
        <input name="phone_number" placeholder="Teléfono" onChange={handleChange} />
        <input name="location" placeholder="Ubicación" onChange={handleChange} />
        <textarea name="description" placeholder="Descripción" onChange={handleChange} />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
