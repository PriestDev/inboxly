<?php
/**
 * Plugin Name: WorkNoon Chat
 * Plugin URI: https://worknoon.com/chat
 * Description: Real-time chat system integrated into your e-commerce platform
 * Version: 1.0.0
 * Author: WorkNoon
 * Author URI: https://worknoon.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Domain Path: /languages
 * Text Domain: worknoon-chat
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('WORKNOON_CHAT_VERSION', '1.0.0');
define('WORKNOON_CHAT_PATH', plugin_dir_path(__FILE__));
define('WORKNOON_CHAT_URL', plugin_dir_url(__FILE__));
define('WORKNOON_CHAT_BASENAME', plugin_basename(__FILE__));

// Include required files
require_once WORKNOON_CHAT_PATH . 'includes/class-loader.php';
require_once WORKNOON_CHAT_PATH . 'includes/class-activator.php';
require_once WORKNOON_CHAT_PATH . 'includes/class-deactivator.php';

// Activation and deactivation hooks
register_activation_hook(__FILE__, array('Worknoon_Chat_Activator', 'activate'));
register_deactivation_hook(__FILE__, array('Worknoon_Chat_Deactivator', 'deactivate'));

// Load plugin
function run_worknoon_chat() {
    $loader = new Worknoon_Chat_Loader();
    $loader->run();
}

run_worknoon_chat();
