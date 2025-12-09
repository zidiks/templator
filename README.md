# Templator

Пример реализации сервиса генерации документов по шаблонам на NestJS (backend) и React (frontend).

## Backend (NestJS)
- Поднимается на `http://localhost:3000/api`.
- Эндпоинты:
  - `GET /templates` — список шаблонов.
  - `POST /templates` — создание шаблона (json схема полей).
  - `POST /templates/:id/file` — загрузка файла шаблона (multer).
  - `PUT /templates/:id/fields-schema` — изменение схемы полей.
  - `GET /templates/:id` — получить шаблон.
  - `DELETE /templates/:id` — удалить шаблон.
  - `GET /templates/:id/form` — получить форму для генерации.
  - `POST /templates/:id/generate` — валидация данных и запись результата.

Сервис работает с локальным json-хранилищем (`storage/templates.json`) и складывает загруженные файлы в `storage/templates/`.

### Запуск backend
```bash
cd backend
npm install
npm run start:dev
```

## Frontend (React)
Простой экран для отображения списка шаблонов. Запросы идут на `/api/templates`.

### Запуск frontend
```bash
cd frontend
npm install
npm run dev -- --host
```

## Замечания
- Генерация документов реализована как заглушка: данные валидируются по required-полям и возвращаются в JSON-ответе вместе с путём сохранения.
- Проект рассчитан на дальнейшее развитие: интеграцию docxtemplater/exceljs, подключение БД PostgreSQL, S3-хранилища и роли.
