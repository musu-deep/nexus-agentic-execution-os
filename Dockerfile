FROM node:22-alpine AS studio-builder
WORKDIR /studio
COPY organization-studio/package*.json ./
RUN npm install --no-audit --no-fund
COPY organization-studio/ ./
RUN npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY --from=studio-builder /studio/dist /app/organization-studio-dist
ENV PORT=8080
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
