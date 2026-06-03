<?php
/**
 * Plugin Activation Class
 */

class Inboxly_Chat_Activator {

    public static function activate() {
        // Check PHP version
        // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            wp_die('Inboxly requires PHP 7.4 or higher');
        }

        // Create plugin options
        $default_settings = array(
            'api_url' => 'https://api.inboxly.com',
            'api_key' => '',
            'enable_notifications' => true,
            'notification_subject' => 'New Inboxly chat message',
            'notification_sender' => 'Inboxly Support',
            'enable_file_uploads' => true,
            'max_upload_size' => 5242880, // 5MB
            'enable_offline_form' => true,
            'offline_contact_label' => 'We’re offline now — leave a message and we’ll email you back shortly.',
            'widget_position' => 'bottom-right',
            'widget_primary_color' => '#0b74f9',
            'widget_secondary_color' => '#6d28d9',
            'widget_title' => 'Live chat support',
            'widget_welcome_message' => 'Hi there! Ask me anything about orders, pricing, or product details.',
            'single_agent_enabled' => true,
            'agent_name' => 'Megan Support',
            'agent_email' => 'support@inboxly.com',
            // whether the plugin is connected (set when API key configured / widget detected)
            'connected' => 0,
        );

        foreach ($default_settings as $key => $value) {
            if (!get_option('inboxly_chat_' . $key)) {
                add_option('inboxly_chat_' . $key, $value);
            }
        }

        // Track activation timestamp and site
        if (!get_option('inboxly_chat_activated_at')) {
            add_option('inboxly_chat_activated_at', current_time('mysql'));
        } else {
            update_option('inboxly_chat_activated_at', current_time('mysql'));
        }

        if (!get_option('inboxly_chat_activated_site')) {
            add_option('inboxly_chat_activated_site', site_url());
        } else {
            update_option('inboxly_chat_activated_site', site_url());
        }
        // Set a one-time redirect flag so admin can be sent to onboarding page
        if (!get_option('inboxly_chat_do_activation_redirect')) {
            add_option('inboxly_chat_do_activation_redirect', 1);
        } else {
            update_option('inboxly_chat_do_activation_redirect', 1);
        }
        // Flush rewrite rules
        flush_rewrite_rules();
    }
}
