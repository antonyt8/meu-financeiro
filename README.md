# meu-financeiro

Projeto full stack para controle financeiro pessoal.

## Stack
- **Backend:** Django, Django REST Framework, JWT, PostgreSQL
- **Frontend:** React (Create React App), Tailwind CSS, Recharts
- **Orquestração:** Docker, Docker Compose

## Funcionalidades
- Autenticação JWT (login/registro)
- CRUD de Categorias e Lançamentos
- Dashboard com gráficos (saldo, entradas, saídas, totais por categoria)
- Exportação de relatórios (PDF/Excel)

## Estrutura de Pastas
```
meu-financeiro/
├── backend/           # Backend Django
│   └── meufinanceiro/ # Projeto e apps Django
├── frontend/          # Frontend React
└── docker-compose.yml # Orquestração dos serviços
```

## Como rodar localmente
### Pré-requisitos
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Docker (opcional)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Docker Compose
```bash
docker-compose up --build
```

## Contribuição
Pull requests são bem-vindos!

## Licença
[MIT](LICENSE) 