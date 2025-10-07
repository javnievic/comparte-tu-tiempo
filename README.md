![License](https://img.shields.io/github/license/javnievic/comparte-tu-tiempo) 
![Last Commit](https://img.shields.io/github/last-commit/javnievic/comparte-tu-tiempo) 
![Version](https://img.shields.io/badge/version-1.0.0-blue) 
![Stars](https://img.shields.io/github/stars/javnievic/comparte-tu-tiempo?style=social) 
![Forks](https://img.shields.io/github/forks/javnievic/comparte-tu-tiempo?style=social) 
![Watchers](https://img.shields.io/github/watchers/javnievic/comparte-tu-tiempo?style=social) 
![Open Issues](https://img.shields.io/github/issues/javnievic/comparte-tu-tiempo) 
![Closed Issues](https://img.shields.io/github/issues-closed/javnievic/comparte-tu-tiempo) 
![PRs](https://img.shields.io/github/issues-pr/javnievic/comparte-tu-tiempo) 
![Python](https://img.shields.io/badge/python-3.11-blue) 
![React](https://img.shields.io/badge/react-18.2.0-blue?logo=react) 
![Django](https://img.shields.io/badge/django-4.3-green?logo=django) 
![MySQL](https://img.shields.io/badge/mysql-8.0-blue?logo=mysql) 
![Coverage](https://img.shields.io/codecov/c/github/javnievic/comparte-tu-tiempo) 
![Code Style](https://img.shields.io/badge/code%20style-prettier-ff69b4)

# 🕒 ComparteTuTiempo

**ComparteTuTiempo** es una aplicación de **banco de tiempo** que permite a los usuarios intercambiar servicios y habilidades utilizando horas como moneda.  
El objetivo es fomentar la colaboración, la ayuda mutua y la creación de comunidad, ofreciendo una plataforma digital donde cualquier persona pueda publicar ofertas, realizar solicitudes y llevar un registro de sus transacciones de tiempo.

---

##  Tecnologías utilizadas

- **Frontend**: React + Material UI  
- **Backend**: Django + Django REST Framework  
- **Base de datos**: MySql
- **Autenticación**: JWT (JSON Web Tokens)   
- **Control de versiones**: Git + GitHub  

---

##  Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** v18+  
- **npm** o **yarn**  
- **Python** 3.11+  
- **pip** o **pipenv** (dependiendo del gestor usado)  
- **MySQL** 
- **Git**

---

##  Instalación y ejecución en local

### Backend (Django)

1. Clonar el repositorio:  
   ```bash
   git clone https://github.com/javnievic/comparte-tu-tiempo.git
   cd comparte-tu-tiempo/backend
   ```
2.  Crear y activar entorno virtual:
    ```bash
    python -m venv venv
    ```
    ```bash
    source venv/bin/activate  # En Linux/Mac
    venv/Scripts/activate     # En Windows`
    ```

3.  Instalar dependencias:
    ```bash
    pip install -r requirements.txt
    ```

4. Configurar la base de datos MySQL:
    ```bash
    mysql -u root -p

    DROP DATABASE IF EXISTS banco_tiempo;
    DROP DATABASE IF EXISTS test_banco_tiempo;
    DROP USER IF EXISTS 'banco_user'@'localhost';


    CREATE DATABASE banco_tiempo CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
    CREATE DATABASE test_banco_tiempo CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

    CREATE USER 'banco_user'@'localhost' IDENTIFIED BY 'user1234';
    GRANT ALL PRIVILEGES ON banco_tiempo.* TO 'banco_user'@'localhost';
    GRANT ALL PRIVILEGES ON test_banco_tiempo.* TO 'banco_user'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
    ```
6.  Crear el archivo de entorno .env a partir del ejemplo:
    ```bash
    cp .env.local.example .env
    ```
    Edita el archivo .env si necesitas ajustar credenciales o rutas.


5.  Ejecutar migraciones:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6. Poblar la base de datos con datos iniciales e imágenes (opcional):
    ```bash
    python populate.py
    ```
    Esto creará un conjunto de usuarios, ofertas y transacciones de ejemplo, incluyendo imágenes de prueba. Se puede usar el usuario de demostración:
    ```makefile
    Email: juan@example.com
    Contraseña: 12345678Ma
    ```

7. Levantar el servidor:
    ```bash
    python manage.py runserver
    ```
    

### Frontend (React)

1.  Ir al directorio del frontend:
    ```bash
    cd ../frontend
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Ejecutar la aplicación:
    ```bash
    npm run dev
    ```

El frontend estará disponible en `http://localhost:5173/` y el backend en `http://localhost:8000`.

## Tests (Pytest)
Este proyecto utiliza pytest para ejecutar los tests del backend.
Para ejecutarlos:

1. Asegúrate de tener el entorno virtual activado y dependencias instaladas.
2. Lanza los tests desde la carpeta backend:
    ```bash
    pytest
    ```
3. Para ver un informe más detallado:
    ```bash
    pytest -v
    ```
4. para ver la covertura de una aplicación (users por ejemplo): 
    ```bash
    pytest --cov=apps.users apps/users/tests.py --cov-report=term-missing
    ```


## Estructura de carpetas
### Backend
  ```bash
  backend/
  │
  ├── core/                       # Configuración global del proyecto
  │   ├── __init__.py
  │   ├── settings.py
  │   ├── urls.py
  │   ├── wsgi.py
  │   └── asgi.py
  │
  ├── apps/                       # Todas las aplicaciones del dominio
  │   ├── users/                  # App de usuarios
  │   │   ├── migrations/         # Migraciones de la base de datos
  │   │   ├── admin.py
  │   │   ├── apps.py
  │   │   ├── models.py
  │   │   ├── serializers.py
  │   │   ├── tests.py
  │   │   ├── urls.py
  │   │   ├── views.py
  │   │   └── …
  │   └── …                       # Otras apps
  │
  ├── requirements.txt            # Dependencias del proyecto
  └── manage.py                    # Script principal de Django
  ```
  ### Frontend
  ```bash
  frontend/
  │
  ├── public/                     # Archivos estáticos (favicon, index.html)
  │
  ├── src/
  │   ├── assets/                 # Imágenes, fuentes, iconos
  │   ├── components/             # Componentes reutilizables (inputs, botones, tarjetas, etc.)
  │   ├── context/                # Context API (autenticación, usuario, UI, etc.)
  │   ├── hooks/                  # Hooks personalizados
  │   ├── pages/                  # Vistas principales (Register, Login, Home, Perfil, etc.)
  │   ├── services/               # Lógica para llamadas a la API (fetch/axios)
  │   ├── styles/                 # CSS global o configuración de Tailwind
  │   ├── utils/                  # Funciones utilitarias (formatos, cálculos, validaciones)
  │   ├── App.css                 
  │   ├── App.jsx                 
  │   ├── main.jsx                
  │   └── index.css               
  │
  └── package.json                # Dependencias y scripts de Node
  ```


## 👥 Créditos y autores

Proyecto desarrollado como parte de un **Trabajo de Fin de Grado (TFG)**.

**Autores:**

| Nombre | GitHub |
|--------|--------|
| Javier Nieto | [![Javier Nieto](https://img.shields.io/badge/-Javier%20Nieto-000?style=flat&logo=github&logoColor=white)](https://github.com/javnievic) |




