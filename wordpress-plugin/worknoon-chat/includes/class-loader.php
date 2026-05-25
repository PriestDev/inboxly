<?php
/**
 * Plugin Loader Class
 */

class Worknoon_Chat_Loader {

    public function __construct() {
    }

    public function run() {
        $this->load_dependencies();
        $this->register_hooks();
    }

    private function load_dependencies() {
        require_once WORKNOON_CHAT_PATH . 'includes/class-main.php';
        require_once WORKNOON_CHAT_PATH . 'includes/class-rest-api.php';
        require_once WORKNOON_CHAT_PATH . 'admin/class-settings.php';
    }

    private function register_hooks() {
        $main = new Worknoon_Chat_Main();
        
        add_action('wp_enqueue_scripts', array($main, 'enqueue_frontend_assets'));
        add_action('admin_enqueue_scripts', array($main, 'enqueue_admin_assets'));
        add_action('wp_footer', array($main, 'output_chat_widget'));
        add_shortcode('worknoon_chat', array($main, 'render_chat_shortcode'));

        $rest = new Worknoon_Chat_REST_API();
        add_action('rest_api_init', array($rest, 'register_routes'));

        $settings = new Worknoon_Chat_Settings();
        add_action('admin_menu', array($settings, 'add_settings_page'));
        add_action('admin_init', array($settings, 'register_settings'));
    }
}
