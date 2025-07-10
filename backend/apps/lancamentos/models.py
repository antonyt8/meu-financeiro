from django.db import models
from django.contrib.auth.models import User
from apps.categorias.models import Categoria

class Lancamento(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
    ]
    tipo = models.CharField(max_length=7, choices=TIPO_CHOICES)
    valor = models.DecimalField(max_digits=12, decimal_places=2)
    data = models.DateField()
    descricao = models.TextField(blank=True, null=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='lancamentos')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lancamentos')

    def __str__(self):
        return f"{self.tipo} - {self.valor} em {self.data}"
