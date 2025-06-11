#!/bin/bash

set -e

# Cargar variables de entorno desde .env si existe
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate

pip install --upgrade pip
pip install -r Horario_API/requirements.txt

cd Horario_API
python manage.py migrate

python manage.py loaddata horario/fixtures/grupos.json

# Crea superusuario usando el .env
if [[ -n "$SUPERUSER_USERNAME" && -n "$SUPERUSER_EMAIL" && -n "$SUPERUSER_PASSWORD" ]]; then
  echo "from django.contrib.auth import get_user_model; User = get_user_model(); \
if not User.objects.filter(username='$SUPERUSER_USERNAME').exists(): \
    User.objects.create_superuser('$SUPERUSER_USERNAME', '$SUPERUSER_EMAIL', '$SUPERUSER_PASSWORD')" | python manage.py shell
  echo "Superusuario creado."
else
  echo "⚠️  Variables de entorno para superusuario no definidas. No se creó superusuario."
fi

echo "Entorno configurado, iniciando servidor."


python manage.py runserver 0.0.0.0:8000