# Project Root

This directory contains the complete WorkNoon Chat System project.

## Folder Structure

```
worknoon_remote/
├── backend/              - Node.js/Express backend
├── frontend/             - React frontend
├── wordpress-plugin/     - WordPress plugin
└── docs/                 - Documentation
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

### 3. WordPress Plugin
- Copy `wordpress-plugin/worknoon-chat` to `wp-content/plugins/`
- Activate in WordPress admin

## System Requirements

- Node.js 14+
- MongoDB
- WordPress 5.0+
- Modern web browser

## Configuration

1. Update backend `.env` with MongoDB connection and settings
2. Update frontend `.env` with API URL
3. Configure WordPress plugin with backend API URL

## Resources

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [WordPress Plugin README](./wordpress-plugin/worknoon-chat/README.md)
- [Full Setup Guide](./docs/SETUP_GUIDE.md)

## Support

For detailed setup instructions, refer to the individual README files in each folder.
