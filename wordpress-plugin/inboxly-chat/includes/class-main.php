<?php
/**
 * Main Plugin Class
 */

class Inboxly_Chat_Main {

    public function __construct() {
        add_action('init', array($this, 'register_chat_session_type'));

        if (is_admin()) {
            add_action('admin_init', array($this, 'maybe_redirect_on_activation'));
            add_action('add_meta_boxes', array($this, 'register_session_meta_boxes'));
        }

        if (class_exists('WooCommerce')) {
            add_action('woocommerce_new_order', array($this, 'handle_woocommerce_new_order'), 10, 1);
        }
    }

    public static function get_api_url() {
        $default_url = 'http://localhost:4000';

        if (defined('INBOXLY_CHAT_API_URL') && INBOXLY_CHAT_API_URL) {
            return self::normalize_api_url(INBOXLY_CHAT_API_URL);
        }

        $env_url = getenv('INBOXLY_CHAT_API_URL');
        if ($env_url) {
            return self::normalize_api_url($env_url);
        }

        $option_url = get_option('inboxly_chat_api_url', '');
        if ($option_url) {
            return self::normalize_api_url($option_url);
        }

        return $default_url;
    }

    private static function normalize_api_url($url) {
        $url = trim($url);
        $url = trim($url, "' \t\r\n");

        if (!$url) {
            return 'http://localhost:4000';
        }

        if (!preg_match('#^https?://#i', $url)) {
            $url = 'http://' . $url;
        }

        return rtrim($url, '/');
    }

    public function maybe_redirect_on_activation() {
        // Only redirect once, and only for users with manage_options
        $flag = get_option('inboxly_chat_do_activation_redirect', false);
        // if plugin already marked connected, skip onboarding redirect
        $connected = get_option('inboxly_chat_connected', 0);
        if ($connected) {
            // clear redirect flag and bail
            if ($flag) {
                delete_option('inboxly_chat_do_activation_redirect');
            }
            return;
        }
        if (!$flag) {
            return;
        }

        // remove the flag so we only redirect once
        delete_option('inboxly_chat_do_activation_redirect');

        if (!current_user_can('manage_options')) {
            return;
        }

        // Avoid redirect during bulk plugin activation
        if (isset($_GET['activate-multi'])) {
            return;
        }

        wp_safe_redirect(admin_url('admin.php?page=inboxly-chat-onboarding'));
        exit;
    }

    public function enqueue_frontend_assets() {
        wp_enqueue_style(
            'inboxly-chat-styles',
            INBOXLY_CHAT_URL . 'assets/css/chat.css',
            array(),
            INBOXLY_CHAT_VERSION
        );

        wp_enqueue_script(
            'socket-io',
            'https://cdn.socket.io/4.7.2/socket.io.min.js',
            array(),
            '4.7.2',
            true
        );

        wp_enqueue_script(
            'inboxly-chat-app',
            INBOXLY_CHAT_URL . 'assets/js/chat-app.js',
            array('socket-io'),
            INBOXLY_CHAT_VERSION,
            true
        );

        $api_url = self::get_api_url();
        $api_key = get_option('inboxly_chat_api_key', '');
        $current_user = wp_get_current_user();
        $context = $this->get_page_context();

        $widgetSettings = array(
            'position' => get_option('inboxly_chat_widget_position', 'bottom-right'),
            'primaryColor' => get_option('inboxly_chat_widget_primary_color', '#0b74f9'),
            'secondaryColor' => get_option('inboxly_chat_widget_secondary_color', '#6d28d9'),
            'title' => get_option('inboxly_chat_widget_title', 'Live chat support'),
            'welcomeMessage' => get_option('inboxly_chat_widget_welcome_message', 'Hi there! Ask me anything about orders, pricing, or product details.'),
            'offlineEnabled' => get_option('inboxly_chat_enable_offline_form', true),
            'offlineLabel' => get_option('inboxly_chat_offline_contact_label', 'We’re offline now — leave a message and we’ll email you back shortly.'),
            'singleAgentEnabled' => get_option('inboxly_chat_single_agent_enabled', true),
            'agentName' => get_option('inboxly_chat_agent_name', 'Megan Support'),
            'agentEmail' => get_option('inboxly_chat_agent_email', 'support@inboxly.com'),
        );

        wp_localize_script('inboxly-chat-app', 'InboxlyChat', array(
            'apiUrl' => $api_url,
            'apiKey' => $api_key,
            'userId' => $current_user->ID,
            'userEmail' => $current_user->user_email,
            'userName' => $current_user->user_login,
            'isLoggedIn' => is_user_logged_in(),
            'nonce' => wp_create_nonce('wp_rest'),
            'pageContext' => $context,
            'widgetSettings' => $widgetSettings,
        ));
    }

    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'inboxly-chat') === false) {
            return;
        }

        wp_enqueue_style('dashicons');

        wp_enqueue_style(
            'inboxly-chat-admin',
            INBOXLY_CHAT_URL . 'assets/css/admin.css',
            array(),
            INBOXLY_CHAT_VERSION
        );

        wp_enqueue_script(
            'inboxly-chat-admin',
            INBOXLY_CHAT_URL . 'assets/js/admin.js',
            array('jquery'),
            INBOXLY_CHAT_VERSION,
            true
        );
    }

    public function output_chat_widget() {
        if (!is_user_logged_in()) {
            return;
        }

        echo '<div id="inboxly-chat-widget"></div>';
    }

    public function render_chat_shortcode($atts) {
        if (!is_user_logged_in()) {
            return '<p>Please log in to use the chat feature.</p>';
        }

        return '<div id="inboxly-chat-shortcode" style="width: 100%; height: 600px;"></div>';
    }

    public function register_chat_session_type() {
        $labels = array(
            'name' => __('Chat Sessions', 'inboxly-chat'),
            'singular_name' => __('Chat Session', 'inboxly-chat'),
            'menu_name' => __('Chat Sessions', 'inboxly-chat'),
            'name_admin_bar' => __('Chat Session', 'inboxly-chat'),
            'add_new' => __('Add New', 'inboxly-chat'),
            'add_new_item' => __('Add New Chat Session', 'inboxly-chat'),
            'new_item' => __('New Chat Session', 'inboxly-chat'),
            'edit_item' => __('Edit Chat Session', 'inboxly-chat'),
            'view_item' => __('View Chat Session', 'inboxly-chat'),
            'all_items' => __('All Chat Sessions', 'inboxly-chat'),
            'search_items' => __('Search Chat Sessions', 'inboxly-chat'),
            'not_found' => __('No chat sessions found.', 'inboxly-chat'),
            'not_found_in_trash' => __('No chat sessions found in Trash.', 'inboxly-chat'),
        );

        $args = array(
            'labels' => $labels,
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'capability_type' => 'post',
            'supports' => array('title', 'editor', 'custom-fields'),
            'has_archive' => false,
            'rewrite' => false,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-format-chat',
        );

        register_post_type('chat_session', $args);
    }

    public function register_session_meta_boxes() {
        add_meta_box(
            'inboxly_chat_session_meta',
            __('Chat Session Details', 'inboxly-chat'),
            array($this, 'render_session_meta_box'),
            'chat_session',
            'side',
            'default'
        );
    }

    public function render_session_meta_box($post) {
        $order_id = get_post_meta($post->ID, '_inboxly_chat_order_id', true);
        $product_ids = get_post_meta($post->ID, '_inboxly_chat_product_ids', true);
        $context = get_post_meta($post->ID, '_inboxly_chat_context', true);
        $backend_conversation = get_post_meta($post->ID, '_inboxly_chat_backend_conversation_id', true);

        echo '<p><strong>' . __('Context', 'inboxly-chat') . ':</strong> ' . esc_html($context ?: __('General', 'inboxly-chat')) . '</p>';
        echo '<p><strong>' . __('Order ID', 'inboxly-chat') . ':</strong> ' . esc_html($order_id ?: __('None', 'inboxly-chat')) . '</p>';
        echo '<p><strong>' . __('Product IDs', 'inboxly-chat') . ':</strong> ' . esc_html(is_array($product_ids) ? implode(', ', $product_ids) : $product_ids) . '</p>';
        echo '<p><strong>' . __('Backend Conversation', 'inboxly-chat') . ':</strong> ' . esc_html($backend_conversation ?: __('Not created', 'inboxly-chat')) . '</p>';
    }

    public function handle_woocommerce_new_order($order_id) {
        if (!function_exists('wc_get_order')) {
            return;
        }

        $order = wc_get_order($order_id);
        if (!$order) {
            return;
        }

        $product_ids = array();
        $product_names = array();

        foreach ($order->get_items() as $item) {
            if ($item->get_product_id()) {
                $product_ids[] = $item->get_product_id();
                $product_names[] = $item->get_name();
            }
        }

        $session_id = $this->create_chat_session(array(
            'title' => sprintf(__('Order #%d Support Chat', 'inboxly-chat'), $order_id),
            'user_id' => $order->get_user_id(),
            'order_id' => $order_id,
            'product_ids' => $product_ids,
            'product_names' => $product_names,
            'context' => 'order',
        ));

        if ($session_id) {
            update_post_meta($order_id, '_inboxly_chat_session_id', $session_id);
        }
    }

    protected function create_chat_session($args = array()) {
        $defaults = array(
            'title' => __('Chat Session', 'inboxly-chat'),
            'user_id' => get_current_user_id(),
            'order_id' => '',
            'product_ids' => array(),
            'product_names' => array(),
            'context' => 'general',
            'context_text' => '',
        );

        $args = wp_parse_args($args, $defaults);

        $post_id = wp_insert_post(array(
            'post_title' => sanitize_text_field($args['title']),
            'post_type' => 'chat_session',
            'post_status' => 'publish',
            'post_author' => intval($args['user_id']),
            'post_content' => sanitize_textarea_field($args['context_text']),
        ));

        if (is_wp_error($post_id) || !$post_id) {
            return false;
        }

        update_post_meta($post_id, '_inboxly_chat_user_id', intval($args['user_id']));
        update_post_meta($post_id, '_inboxly_chat_order_id', sanitize_text_field($args['order_id']));
        update_post_meta($post_id, '_inboxly_chat_product_ids', array_map('intval', (array) $args['product_ids']));
        update_post_meta($post_id, '_inboxly_chat_product_names', array_map('sanitize_text_field', (array) $args['product_names']));
        update_post_meta($post_id, '_inboxly_chat_context', sanitize_text_field($args['context']));
        update_post_meta($post_id, '_inboxly_chat_context_text', sanitize_textarea_field($args['context_text']));

        return $post_id;
    }

    private function get_page_context() {
        $context = array(
            'type' => 'general',
            'title' => '',
            'data' => array(),
        );

        if (function_exists('is_product') && is_product()) {
            global $product;
            if ($product) {
                $context['type'] = 'product';
                $context['title'] = $product->get_name();
                $context['data'] = array(
                    'productId' => $product->get_id(),
                    'productName' => $product->get_name(),
                    'productSku' => $product->get_sku(),
                    'productUrl' => get_permalink($product->get_id()),
                );
            }
        }

        if (function_exists('is_order_received_page') && is_order_received_page()) {
            $order_id = absint(get_query_var('order-received'));
            if ($order_id) {
                $order = wc_get_order($order_id);
                if ($order) {
                    $context['type'] = 'order';
                    $context['title'] = sprintf(__('Order #%d Chat', 'inboxly-chat'), $order_id);
                    $context['data'] = array(
                        'orderId' => $order_id,
                        'orderTotal' => $order->get_total(),
                        'productIds' => wp_list_pluck($order->get_items(), 'product_id'),
                    );
                }
            }
        }

        return $context;
    }
}
