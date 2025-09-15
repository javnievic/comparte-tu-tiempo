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
1.  Crear y activar entorno virtual:
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Linux/Mac
    venv\Scripts\activate     # En Windows`
    ```

2.  Instalar dependencias:
    ```bash
    pip install -r requirements.txt
    ```
    
3.  Ejecutar migraciones y cargar el servidor:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
    
4. Configurar la base de datos MySQL:
    ```bash
    mysql -u root -p

    DROP DATABASE IF EXISTS banco_tiempo;
    DROP USER IF EXISTS 'banco_user'@'localhost';
    CREATE DATABASE banco_tiempo CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
    CREATE USER 'banco_user'@'localhost' IDENTIFIED BY 'user1234';
    GRANT ALL PRIVILEGES ON banco_tiempo.* TO 'banco_user'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
    ```

5. Levantar el servidor:
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


## Créditos y autores

Proyecto desarrollado como parte de un **Trabajo de Fin de Grado (TFG)**.

Autores:

-   Javier Nieto
    
-   \[Colaboradores del equipo de desarrollo, si aplica\]
    

`¿Quieres que te lo prepare también con **badges de GitHub** (ej. build, licencia, versión de Node/Pyt`
