<?php
/**
 * REST API Class
 */

class Worknoon_Chat_REST_API {

    public function __construct() {
    }

    public function register_routes() {
        register_rest_route('worknoon-chat/v1', '/user', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_user_info'),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ));

        register_rest_route('worknoon-chat/v1', '/backend-token', array(
            'methods' => 'POST',
            'callback' => array($this, 'get_backend_token'),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ));

        register_rest_route('worknoon-chat/v1', '/sync-user', array(
            'methods' => 'POST',
            'callback' => array($this, 'sync_user'),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ));

        register_rest_route('worknoon-chat/v1', '/validate-token', array(
            'methods' => 'POST',
            'callback' => array($this, 'validate_token'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('worknoon-chat/v1', '/chat-session', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_chat_sessions'),
                'permission_callback' => function () {
                    return is_user_logged_in();
                },
            ),
            array(
                'methods' => 'POST',
                'callback' => array($this, 'create_chat_session'),
                'permission_callback' => function () {
                    return is_user_logged_in();
                },
            ),
        ));

        register_rest_route('worknoon-chat/v1', '/chat-session/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_chat_session'),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ));

        register_rest_route('worknoon-chat/v1', '/chat-session/from-product', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_chat_session_from_product'),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ));

        register_rest_route('worknoon-chat/v1', '/chat-session/from-order', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_chat_session_from_order'),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ));
    }

    public function get_user_info($request) {
        if (!is_user_logged_in()) {
            return new WP_Error('not_logged_in', 'User is not logged in', array('status' => 401));
        }

        $current_user = wp_get_current_user();

        return array(
            'id' => $current_user->ID,
            'email' => $current_user->user_email,
            'username' => $current_user->user_login,
            'first_name' => $current_user->first_name,
            'last_name' => $current_user->last_name,
        );
    }

    public function get_backend_token($request) {
        $current_user = wp_get_current_user();
        if (!$current_user->exists()) {
            return new WP_Error('not_logged_in', 'User is not logged in', array('status' => 401));
        }

        $api_url = get_option('worknoon_chat_api_url', 'http://localhost:5000');
        $response = wp_remote_post($api_url . '/api/auth/wp-login', array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => wp_json_encode(array(
                'wpUserId' => $current_user->ID,
                'email' => $current_user->user_email,
                'username' => $current_user->user_login,
                'firstName' => $current_user->first_name,
                'lastName' => $current_user->last_name,
                'avatar' => get_avatar_url($current_user->ID),
            )),
            'timeout' => 20,
        ));

        if (is_wp_error($response)) {
            return new WP_Error('backend_error', 'Failed to obtain backend token', array('status' => 500));
        }

        return json_decode(wp_remote_retrieve_body($response), true);
    }

    public function sync_user($request) {
        $current_user = wp_get_current_user();
        if (!$current_user->exists()) {
            return new WP_Error('not_logged_in', 'User is not logged in', array('status' => 401));
        }

        $api_url = get_option('worknoon_chat_api_url', 'http://localhost:5000');
        $response = wp_remote_post($api_url . '/api/auth/wp-login', array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => wp_json_encode(array(
                'wpUserId' => $current_user->ID,
                'email' => $current_user->user_email,
                'username' => $current_user->user_login,
                'firstName' => $current_user->first_name,
                'lastName' => $current_user->last_name,
                'avatar' => get_avatar_url($current_user->ID),
            )),
            'timeout' => 20,
        ));

        if (is_wp_error($response)) {
            return new WP_Error('sync_failed', 'Failed to sync user', array('status' => 500));
        }

        return json_decode(wp_remote_retrieve_body($response), true);
    }

    public function validate_token($request) {
        $params = $request->get_json_params();
        $token = $params['token'] ?? null;

        if (!$token) {
            return new WP_Error('missing_token', 'Token is required', array('status' => 400));
        }

        $api_url = get_option('worknoon_chat_api_url', 'http://localhost:5000');
        $response = wp_remote_post($api_url . '/api/auth/verify-token', array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => wp_json_encode(array('token' => $token)),
            'timeout' => 20,
        ));

        if (is_wp_error($response)) {
            return new WP_Error('validation_failed', 'Failed to validate token', array('status' => 500));
        }

        return json_decode(wp_remote_retrieve_body($response), true);
    }

    public function get_chat_sessions($request) {
        $current_user_id = get_current_user_id();

        $sessions = get_posts(array(
            'post_type' => 'chat_session',
            'meta_key' => '_worknoon_chat_user_id',
            'meta_value' => $current_user_id,
            'posts_per_page' => -1,
        ));

        return array_map(array($this, 'format_session'), $sessions);
    }

    public function get_chat_session($request) {
        $session_id = absint($request['id']);
        $session = get_post($session_id);

        if (!$session || $session->post_type !== 'chat_session') {
            return new WP_Error('not_found', 'Chat session not found', array('status' => 404));
        }

        $current_user_id = get_current_user_id();
        $owner_id = intval(get_post_meta($session_id, '_worknoon_chat_user_id', true));

        if ($owner_id !== $current_user_id) {
            return new WP_Error('forbidden', 'You do not have access to this chat session', array('status' => 403));
        }

        return $this->format_session($session);
    }

    public function create_chat_session($request) {
        $params = $request->get_json_params();
        $title = sanitize_text_field($params['title'] ?? 'Chat Session');
        $context = sanitize_text_field($params['context'] ?? 'custom');
        $context_text = sanitize_textarea_field($params['context_text'] ?? '');
        $product_ids = isset($params['product_ids']) ? array_map('intval', (array) $params['product_ids']) : array();
        $order_id = intval($params['order_id'] ?? 0);

        $session_id = $this->create_session_post(array(
            'title' => $title,
            'user_id' => get_current_user_id(),
            'order_id' => $order_id,
            'product_ids' => $product_ids,
            'context' => $context,
            'context_text' => $context_text,
        ));

        if (!$session_id) {
            return new WP_Error('create_failed', 'Unable to create chat session', array('status' => 500));
        }

        return $this->format_session(get_post($session_id));
    }

    public function create_chat_session_from_product($request) {
        if (!function_exists('wc_get_product')) {
            return new WP_Error('woocommerce_required', 'WooCommerce is required for product chat sessions', array('status' => 400));
        }

        $params = $request->get_json_params();
        $product_id = intval($params['product_id'] ?? 0);

        if (!$product_id) {
            return new WP_Error('invalid_product', 'Product ID is required', array('status' => 400));
        }

        $product = wc_get_product($product_id);
        if (!$product) {
            return new WP_Error('invalid_product', 'Invalid product', array('status' => 404));
        }

        $session_id = $this->create_session_post(array(
            'title' => sprintf(__('Product Chat: %s', 'worknoon-chat'), $product->get_name()),
            'user_id' => get_current_user_id(),
            'product_ids' => array($product_id),
            'product_names' => array($product->get_name()),
            'context' => 'product',
            'context_text' => $product->get_description(),
        ));

        if (!$session_id) {
            return new WP_Error('create_failed', 'Unable to create product chat session', array('status' => 500));
        }

        return $this->format_session(get_post($session_id));
    }

    public function create_chat_session_from_order($request) {
        if (!function_exists('wc_get_order')) {
            return new WP_Error('woocommerce_required', 'WooCommerce is required for order chat sessions', array('status' => 400));
        }

        $params = $request->get_json_params();
        $order_id = absint($params['order_id'] ?? 0);

        if (!$order_id) {
            return new WP_Error('invalid_order', 'Order ID is required', array('status' => 400));
        }

        $order = wc_get_order($order_id);
        if (!$order) {
            return new WP_Error('invalid_order', 'Invalid order', array('status' => 404));
        }

        $product_ids = array();
        $product_names = array();

        foreach ($order->get_items() as $item) {
            if ($item->get_product_id()) {
                $product_ids[] = $item->get_product_id();
                $product_names[] = $item->get_name();
            }
        }

        $session_id = $this->create_session_post(array(
            'title' => sprintf(__('Order #%d Support Chat', 'worknoon-chat'), $order_id),
            'user_id' => get_current_user_id(),
            'order_id' => $order_id,
            'product_ids' => $product_ids,
            'product_names' => $product_names,
            'context' => 'order',
            'context_text' => sprintf(__('Order total: %s', 'worknoon-chat'), wc_price($order->get_total())),
        ));

        if (!$session_id) {
            return new WP_Error('create_failed', 'Unable to create order chat session', array('status' => 500));
        }

        return $this->format_session(get_post($session_id));
    }

    private function create_session_post($args = array()) {
        $defaults = array(
            'title' => __('Chat Session', 'worknoon-chat'),
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

        update_post_meta($post_id, '_worknoon_chat_user_id', intval($args['user_id']));
        update_post_meta($post_id, '_worknoon_chat_order_id', sanitize_text_field($args['order_id']));
        update_post_meta($post_id, '_worknoon_chat_product_ids', array_map('intval', (array) $args['product_ids']));
        update_post_meta($post_id, '_worknoon_chat_product_names', array_map('sanitize_text_field', (array) $args['product_names']));
        update_post_meta($post_id, '_worknoon_chat_context', sanitize_text_field($args['context']));

        return $post_id;
    }

    private function format_session($session) {
        return array(
            'id' => $session->ID,
            'title' => get_the_title($session->ID),
            'content' => apply_filters('the_content', $session->post_content),
            'status' => $session->post_status,
            'order_id' => intval(get_post_meta($session->ID, '_worknoon_chat_order_id', true)),
            'product_ids' => (array) get_post_meta($session->ID, '_worknoon_chat_product_ids', true),
            'product_names' => (array) get_post_meta($session->ID, '_worknoon_chat_product_names', true),
            'context' => get_post_meta($session->ID, '_worknoon_chat_context', true),
            'created_at' => get_post_field('post_date', $session->ID),
        );
    }
}
