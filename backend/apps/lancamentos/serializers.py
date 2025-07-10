from rest_framework import serializers
from .models import Lancamento
from apps.categorias.serializers import CategoriaSerializer

class LancamentoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Lancamento
        fields = ['id', 'tipo', 'valor', 'data', 'descricao', 'categoria', 'categoria_id', 'usuario']
        read_only_fields = ['usuario']

    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data) 