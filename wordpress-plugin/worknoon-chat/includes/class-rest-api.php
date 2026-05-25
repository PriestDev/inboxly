<?php
/**
 * REST API Class
 */

class Worknoon_Chat_REST_API {

    public function __construct() {
    }

    public function register_routes() {
        // Endpoint to get WordPress user info for chat
        register_rest_route('worknoon-chat/v1', '/user', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_user_info'),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ));

        // Endpoint to sync WordPress user to chat system
        register_rest_route('worknoon-chat/v1', '/sync-user', array(
            'methods' => 'POST',
            'callback' => array($this, 'sync_user'),
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ));

        // Endpoint to validate chat token
        register_rest_route('worknoon-chat/v1', '/validate-token', array(
            'methods' => 'POST',
            'callback' => array($this, 'validate_token'),
            'permission_callback' => '__return_true',
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

    public function sync_user($request) {
        if (!is_user_logged_in()) {
            return new WP_Error('not_logged_in', 'User is not logged in', array('status' => 401));
        }

        $current_user = wp_get_current_user();
        $user_data = $request->get_json_params();

        // Call backend API to sync user
        $api_url = get_option('worknoon_chat_api_url', 'http://localhost:5000');
        $response = wp_remote_post($api_url . '/api/users/sync', array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => wp_json_encode(array(
                'wpUserId' => $current_user->ID,
                'email' => $current_user->user_email,
                'username' => $current_user->user_login,
                'firstName' => $current_user->first_name,
                'lastName' => $current_user->last_name,
                'avatar' => get_avatar_url($current_user->ID),
            )),
        ));

        if (is_wp_error($response)) {
            return new WP_Error('sync_failed', 'Failed to sync user', array('status' => 500));
        }

        return json_decode(wp_remote_retrieve_body($response));
    }

    public function validate_token($request) {
        $params = $request->get_json_params();
        $token = $params['token'] ?? null;

        if (!$token) {
            return new WP_Error('missing_token', 'Token is required', array('status' => 400));
        }

        // Validate token with backend API
        $api_url = get_option('worknoon_chat_api_url', 'http://localhost:5000');
        $response = wp_remote_post($api_url . '/api/auth/verify-token', array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => wp_json_encode(array('token' => $token)),
        ));

        if (is_wp_error($response)) {
            return new WP_Error('validation_failed', 'Failed to validate token', array('status' => 500));
        }

        $body = json_decode(wp_remote_retrieve_body($response));
        return $body;
    }
}
