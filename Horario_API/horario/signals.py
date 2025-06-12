from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
import environ
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
env = environ.Env()

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Este handler se ejecuta cuando alguien hace POST a /api/password_reset/
    y se genera el token. Aquí enviamos el e-mail al usuario.
    """
    # Contexto para la plantilla
    front_url = env("FRONTEND_URL")
    context = {
        'email': reset_password_token.user.email,
        'reset_password_url': f"{front_url}/reset-password?token={reset_password_token.key}"
    }

    # Renderizamos plantilla HTML o texto
    subject = 'Recuperación de contraseña'
    message = render_to_string('password_reset_email.html', context)
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [reset_password_token.user.email]

    # Enviamos el correo
    send_mail(
        subject,
        message,           
        from_email,
        recipient_list,
        html_message=message
    )
