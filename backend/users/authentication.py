from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken

from users.models import Usuario


class UsuarioJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token['user_id']
        except KeyError:
            raise InvalidToken('Token sin identificador de usuario')

        try:
            usuario = Usuario.objects.select_related('rol').get(id=user_id)
        except Usuario.DoesNotExist:
            raise AuthenticationFailed('Usuario no encontrado', code='user_not_found')

        if not usuario.activo:
            raise AuthenticationFailed('Usuario inactivo', code='user_inactive')

        return usuario
