#!/bin/bash

set -e  # Detiene el script si ocurre cualquier error

# Cargar variables de entorno desde .env si existe
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias
pip install --upgrade pip
pip install -r Horario_API/requirements.txt

# Aplicar migraciones
cd Horario_API
python manage.py migrate

# Cargar datos iniciales
python manage.py loaddata horario/fixtures/grupos.json

# Crear superusuario si no existe
if [[ -n "$SUPERUSER_USERNAME" && -n "$SUPERUSER_EMAIL" && -n "$SUPERUSER_PASSWORD" ]]; then
  python manage.py shell <<EOF
from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username="${SUPERUSER_USERNAME}").exists():
    User.objects.create_superuser(
        "${SUPERUSER_USERNAME}",
        "${SUPERUSER_EMAIL}",
        "${SUPERUSER_PASSWORD}"
    )
EOF
  echo "✅ Superusuario creado."
else
  echo "⚠️  Variables de entorno para superusuario no definidas. No se creó superusuario."
fi

echo "✅ Entorno configurado. Listo para usar."

python manage.py runserver 0.0.0.0:8000
