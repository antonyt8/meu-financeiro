from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q
from datetime import datetime, timedelta
from .models import Lancamento
from .serializers import LancamentoSerializer

# Create your views here.

class LancamentoViewSet(viewsets.ModelViewSet):
    serializer_class = LancamentoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Lancamento.objects.filter(usuario=self.request.user)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        # Filtros opcionais
        mes = request.query_params.get('mes')
        ano = request.query_params.get('ano')
        
        # Se não especificado, usar mês atual
        if not mes or not ano:
            hoje = datetime.now()
            mes = hoje.month
            ano = hoje.year
        
        # Filtrar lançamentos do mês
        queryset = self.get_queryset().filter(
            data__year=ano,
            data__month=mes
        )
        
        # Calcular totais
        entradas = queryset.filter(tipo='entrada').aggregate(total=Sum('valor'))['total'] or 0
        saidas = queryset.filter(tipo='saida').aggregate(total=Sum('valor'))['total'] or 0
        saldo = entradas - saidas
        
        # Totais por categoria
        totais_categoria = queryset.values('categoria__nome').annotate(
            total=Sum('valor')
        ).order_by('-total')
        
        # Gráfico de linha - saldo por mês (últimos 12 meses)
        hoje = datetime.now()
        saldo_mensal = []
        for i in range(12):
            data = hoje - timedelta(days=30*i)
            lancamentos_mes = self.get_queryset().filter(
                data__year=data.year,
                data__month=data.month
            )
            entradas_mes = lancamentos_mes.filter(tipo='entrada').aggregate(total=Sum('valor'))['total'] or 0
            saidas_mes = lancamentos_mes.filter(tipo='saida').aggregate(total=Sum('valor'))['total'] or 0
            saldo_mes = entradas_mes - saidas_mes
            saldo_mensal.append({
                'mes': data.strftime('%Y-%m'),
                'saldo': float(saldo_mes)
            })
        
        return Response({
            'saldo': float(saldo),
            'entradas': float(entradas),
            'saidas': float(saidas),
            'totais_por_categoria': list(totais_categoria),
            'saldo_mensal': saldo_mensal,
            'mes_atual': f"{ano}-{mes:02d}"
        })
