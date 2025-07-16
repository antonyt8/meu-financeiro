export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}

export interface Categoria {
  id: number;
  nome: string;
  tipo: 'entrada' | 'saida';
  usuario: number;
}

export interface Lancamento {
  id: number;
  tipo: 'entrada' | 'saida';
  valor: number;
  data: string;
  descricao?: string;
  categoria: Categoria;
  categoria_id: number;
  usuario: number;
}

export interface DashboardData {
  saldo: number;
  entradas: number;
  saidas: number;
  totais_por_categoria: Array<{
    categoria__nome: string;
    total: number;
  }>;
  saldo_mensal: Array<{
    mes: string;
    saldo: number;
  }>;
  mes_atual: string;
} 