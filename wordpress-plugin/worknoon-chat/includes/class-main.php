<?php
/**
 * Main Plugin Class
 */

class Worknoon_Chat_Main {

    public function __construct() {
    }

    public function enqueue_frontend_assets() {
        wp_enqueue_style(
            'worknoon-chat-styles',
            WORKNOON_CHAT_URL . 'assets/css/chat.css',
            array(),
            WORKNOON_CHAT_VERSION
        );

        wp_enqueue_script(
            'socket-io',
            'https://cdn.socket.io/4.5.4/socket.io.js',
            array(),
            '4.5.4',
            true
        );

        wp_enqueue_script(
            'worknoon-chat-app',
            WORKNOON_CHAT_URL . 'assets/js/chat-app.js',
            array('socket-io'),
            WORKNOON_CHAT_VERSION,
            true
        );

        $api_url = get_option('worknoon_chat_api_url', 'http://localhost:5000');
        $current_user = wp_get_current_user();

        wp_localize_script('worknoon-chat-app', 'WorknoonChat', array(
            'apiUrl' => $api_url,
            'userId' => $current_user->ID,
            'userEmail' => $current_user->user_email,
            'userName' => $current_user->user_login,
            'isLoggedIn' => is_user_logged_in(),
            'nonce' => wp_create_nonce('worknoon_chat_nonce'),
        ));
    }

    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'worknoon-chat') === false) {
            return;
        }

        wp_enqueue_style(
            'worknoon-chat-admin',
            WORKNOON_CHAT_URL . 'assets/css/admin.css',
            array(),
            WORKNOON_CHAT_VERSION
        );

        wp_enqueue_script(
            'worknoon-chat-admin',
            WORKNOON_CHAT_URL . 'assets/js/admin.js',
            array('jquery'),
            WORKNOON_CHAT_VERSION,
            true
        );
    }

    public function output_chat_widget() {
        if (!is_user_logged_in()) {
            return;
        }

        echo '<div id="worknoon-chat-widget"></div>';
    }

    public function render_chat_shortcode($atts) {
        if (!is_user_logged_in()) {
            return '<p>Please log in to use the chat feature.</p>';
        }

        return '<div id="worknoon-chat-shortcode" style="width: 100%; height: 600px;"></div>';
    }
}
