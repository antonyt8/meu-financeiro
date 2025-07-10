from django.db import models
from django.contrib.auth.models import User

class Categoria(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
    ]
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=7, choices=TIPO_CHOICES)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categorias')

    def __str__(self):
        return f"{self.nome} ({self.tipo})"
