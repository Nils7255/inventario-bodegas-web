from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import Usuario


class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        correo = attrs['correo']
        password = attrs['password']

        try:
            usuario = Usuario.objects.select_related('rol').get(correo=correo, activo=True)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError('Credenciales invalidas')

        if not check_password(password, usuario.password):
            raise serializers.ValidationError('Credenciales invalidas')

        refresh = RefreshToken.for_user(usuario)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'usuario': {
                'id': usuario.id,
                'nombre': usuario.nombre,
                'correo': usuario.correo,
                'rol': usuario.rol.nombre,
            },
        }
