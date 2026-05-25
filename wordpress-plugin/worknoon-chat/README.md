# WorkNoon Chat WordPress Plugin

This is a WordPress plugin that integrates the WorkNoon Chat system into your e-commerce website.

## Installation

1. Upload the `worknoon-chat` folder to `/wp-content/plugins/`
2. Activate the plugin from the WordPress admin panel
3. Configure the plugin settings under **WorkNoon Chat** menu

## Configuration

1. Go to **WorkNoon Chat** in the WordPress admin menu
2. Enter your backend API URL (e.g., `http://localhost:5000`)
3. Configure optional settings:
   - Enable/disable notifications
   - Enable/disable file uploads
   - Set maximum upload size

## Usage

### Display Chat Widget
Add this shortcode to any page or post:
```
[worknoon_chat]
```

### Floating Chat Widget
The floating chat widget is automatically displayed on all pages for logged-in users.

## Features

- **Real-time messaging** - Powered by Socket.IO
- **WordPress user integration** - Automatically syncs with WordPress user data
- **REST API endpoints** - Seamless integration with the backend
- **Admin settings** - Easy configuration from WordPress admin
- **Responsive design** - Works on desktop and mobile

## File Structure

```
worknoon-chat/
├── worknoon-chat.php          - Main plugin file
├── includes/
│   ├── class-loader.php       - Plugin loader
│   ├── class-activator.php    - Activation hooks
│   ├── class-deactivator.php  - Deactivation hooks
│   ├── class-main.php         - Main plugin class
│   └── class-rest-api.php     - REST API endpoints
├── admin/
│   └── class-settings.php     - Settings page
├── assets/
│   ├── css/
│   │   ├── chat.css           - Chat widget styles
│   │   └── admin.css          - Admin styles
│   └── js/
│       ├── chat-app.js        - Chat widget JavaScript
│       └── admin.js           - Admin JavaScript
└── templates/
    └── chat-widget.php        - Chat widget template
```

## API Integration

The plugin communicates with the backend API through:

- **User Sync Endpoint**: `/api/users/sync` - Syncs WordPress user to chat system
- **Token Validation**: `/api/auth/verify-token` - Validates chat tokens
- **REST Endpoints**: `/wp-json/worknoon-chat/v1/` - WordPress REST API

## Settings

Configure the plugin by going to **WorkNoon Chat Settings** in the admin panel:

- **API URL** - Your backend API URL
- **Enable Notifications** - Send email notifications for new messages
- **Enable File Uploads** - Allow file uploads in chat
- **Max Upload Size** - Maximum file size for uploads (in bytes)

## Requirements

- WordPress 5.0+
- PHP 7.4+
- Node.js backend server running
- MongoDB database

## Support

For issues and support, please visit our documentation or contact support.
