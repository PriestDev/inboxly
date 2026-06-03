<?php
/**
 * Plugin Name: Inboxly – Live Chat & Customer Support
 * Description: Real-time chat system integrated into your e-commerce platform
 * Version: 1.0.0
 * Author: Priest Dev
 * Plugin URI: https://inboxly.com/chat
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Domain Path: /languages
 * Text Domain: inboxly
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('INBOXLY_CHAT_VERSION', '1.0.0');
define('INBOXLY_CHAT_PATH', plugin_dir_path(__FILE__));
define('INBOXLY_CHAT_URL', plugin_dir_url(__FILE__));
define('INBOXLY_CHAT_BASENAME', plugin_basename(__FILE__));
// Backwards-compatible aliases
if (!defined('INBOXLY_VERSION')) define('INBOXLY_VERSION', INBOXLY_CHAT_VERSION);
if (!defined('INBOXLY_PATH')) define('INBOXLY_PATH', INBOXLY_CHAT_PATH);
if (!defined('INBOXLY_URL')) define('INBOXLY_URL', INBOXLY_CHAT_URL);
if (!defined('INBOXLY_BASENAME')) define('INBOXLY_BASENAME', INBOXLY_CHAT_BASENAME);

// Include required files
require_once INBOXLY_CHAT_PATH . 'includes/class-loader.php';
require_once INBOXLY_CHAT_PATH . 'includes/class-activator.php';
require_once INBOXLY_CHAT_PATH . 'includes/class-deactivator.php';

// Activation and deactivation hooks
register_activation_hook(__FILE__, array('Inboxly_Chat_Activator', 'activate'));
register_deactivation_hook(__FILE__, array('Inboxly_Chat_Deactivator', 'deactivate'));

// Load plugin
function run_inboxly_chat() {
    $loader = new Inboxly_Chat_Loader();
    $loader->run();
}

run_inboxly_chat();
