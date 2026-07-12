# Sistema de Inventario para Bodegas

## Descripcion
Aplicacion web para gestionar inventario de bodegas, con autenticacion, dashboard, productos, proveedores, movimientos, alertas, usuarios y reportes.

## Requisitos
- Python 3.12
- Node.js
- npm

## Instalacion backend
```bash
cd backend
python -m venv ..\.venv
..\.venv\Scripts\pip install -r requirements.txt
..\.venv\Scripts\python manage.py migrate
```

## Instalacion frontend
```bash
cd frontend
npm install
```

## Ejecucion
Backend:
```bash
cd backend
..\.venv\Scripts\python manage.py runserver
```

Frontend:
```bash
cd frontend
npm run dev
```

## Estructura del proyecto
```text
backend/   API Django REST
frontend/  Aplicacion Vue 3
Figma exportado/  Referencia visual
Evaluacion final/ Documentacion de evaluacion
```
