# Horario

Repositorio que contiene el frontend y backend para montar la aplicación fácilmente.

## Pasos para iniciar el proyecto

1. **Clona este repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd Horario
   ```

2. **Configura los archivos `.env`**
   - Copia los archivos de plantilla `.env.plantilla` a `.env` en:
     - La carpeta raíz
     - `Horario_API`
     - `horario-project`
   - Por ejemplo:
     ```bash
     cp .env.plantilla .env
     cp Horario_API/.env.plantilla Horario_API/.env
     cp horario-project/.env.plantilla horario-project/.env
     ```
   - **Ajusta las variables en cada `.env`:**
     - **En la raíz:**  
       - `SUPERUSER_USERNAME`: Nombre de usuario del superusuario de Django.
       - `SUPERUSER_EMAIL`: Email del superusuario.
       - `SUPERUSER_PASSWORD`: Contraseña del superusuario.
     - **En `Horario_API/.env`:**
       - `RUTA_TXT`: (opcional) Ruta al archivo de datos de horarios por si se quiere usar el comando.
       - `EMAIL_USER` y `EMAIL_PASSWORD`: Credenciales para el envío de emails (usar una cuenta de Gmail con contraseña de aplicación).
       - `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`: Datos de acceso a la base de datos PostgreSQL.
       - `DB_HOST`, `DB_PORT`: Host y puerto de la base de datos.
       - `FRONTEND_IP`, `FRONTEND_URL`: Dirección y URL del frontend.
     - **En `horario-project/.env`:**
       - `VITE_CLIENT_ID`, `VITE_CLIENT_SECRET`: Credenciales OAuth2 (puedes asignar primero este valor y luego ponerlo en Oauth2).
       - `VITE_CLIENT_IP`: URL del backend (por defecto, `http://host.docker.internal:8000` para Docker en Window, para despliegue en AWS la IP publica).

3. **Levanta los servicios con Docker**
   ```bash
   docker-compose up -d
   ```

4. **Inicializa la base de datos y el superusuario**
   ```bash
    bash setup_django
   ```

5. **Configura las credenciales OAuth2**
   - Inicia sesion en el `/admin` del backend.
   - Accede a `/oauth2/applications` en el backend.
   - Crea una aplicación OAuth2 y copia el `client_id` y `client_secret` en el `.env` de `horario-project`.

6. **Inicia sesión con el superusuario**
   - Accede a la pagina web, inicia sesion con el superusuario y sube el horario.
---


