<?php
/**
 * Settings Page Class
 */

class Worknoon_Chat_Settings {

    public function __construct() {
    }

    public function add_settings_page() {
        add_menu_page(
            'WorkNoon Chat Settings',
            'WorkNoon Chat',
            'manage_options',
            'worknoon-chat-settings',
            array($this, 'render_settings_page'),
            'dashicons-format-chat'
        );

        add_submenu_page(
            'worknoon-chat-settings',
            'Chat Sessions',
            'Chat Sessions',
            'manage_options',
            'worknoon-chat-sessions',
            array($this, 'render_sessions_page')
        );
    }

    public function register_settings() {
        register_setting('worknoon-chat-settings', 'worknoon_chat_api_url');
        register_setting('worknoon-chat-settings', 'worknoon_chat_enable_notifications');
        register_setting('worknoon-chat-settings', 'worknoon_chat_enable_file_uploads');
        register_setting('worknoon-chat-settings', 'worknoon_chat_max_upload_size');
    }

    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('worknoon-chat-settings');
                do_settings_sections('worknoon-chat-settings');
                ?>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="api_url">API URL</label>
                        </th>
                        <td>
                            <input type="text" id="api_url" name="worknoon_chat_api_url" 
                                   value="<?php echo esc_attr(get_option('worknoon_chat_api_url')); ?>"
                                   class="regular-text" />
                            <p class="description">Enter the URL of your chat backend API</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="enable_notifications">Enable Notifications</label>
                        </th>
                        <td>
                            <input type="checkbox" id="enable_notifications" name="worknoon_chat_enable_notifications" 
                                   value="1" <?php checked(get_option('worknoon_chat_enable_notifications')); ?> />
                            <p class="description">Enable email notifications for new messages</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="enable_file_uploads">Enable File Uploads</label>
                        </th>
                        <td>
                            <input type="checkbox" id="enable_file_uploads" name="worknoon_chat_enable_file_uploads" 
                                   value="1" <?php checked(get_option('worknoon_chat_enable_file_uploads')); ?> />
                            <p class="description">Allow file uploads in chat</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }

    public function render_sessions_page() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $args = array(
            'post_type' => 'chat_session',
            'posts_per_page' => 50,
            'post_status' => 'publish',
        );

        $sessions = get_posts($args);
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Chat Sessions', 'worknoon-chat'); ?></h1>
            <p><?php esc_html_e('View all chat sessions and jump to related WooCommerce orders or products.', 'worknoon-chat'); ?></p>
            <table class="widefat fixed striped">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Session ID', 'worknoon-chat'); ?></th>
                        <th><?php esc_html_e('Title', 'worknoon-chat'); ?></th>
                        <th><?php esc_html_e('Context', 'worknoon-chat'); ?></th>
                        <th><?php esc_html_e('Order', 'worknoon-chat'); ?></th>
                        <th><?php esc_html_e('Products', 'worknoon-chat'); ?></th>
                        <th><?php esc_html_e('Backend Conv.', 'worknoon-chat'); ?></th>
                        <th><?php esc_html_e('Actions', 'worknoon-chat'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($sessions)) : ?>
                        <tr>
                            <td colspan="7"><?php esc_html_e('No chat sessions found.', 'worknoon-chat'); ?></td>
                        </tr>
                    <?php else : ?>
                        <?php foreach ($sessions as $session) :
                            $order_id = get_post_meta($session->ID, '_worknoon_chat_order_id', true);
                            $product_ids = get_post_meta($session->ID, '_worknoon_chat_product_ids', true);
                            $backend_conv = get_post_meta($session->ID, '_worknoon_chat_backend_conversation_id', true);
                            $context = get_post_meta($session->ID, '_worknoon_chat_context', true) ?: __('General', 'worknoon-chat');
                            $edit_link = get_edit_post_link($session->ID);
                        ?>
                            <tr>
                                <td><?php echo esc_html($session->ID); ?></td>
                                <td><?php echo esc_html(get_the_title($session->ID)); ?></td>
                                <td><?php echo esc_html($context); ?></td>
                                <td>
                                    <?php if ($order_id) : ?>
                                        <?php if (function_exists('wc_get_order')) : ?>
                                            <a href="<?php echo esc_url(get_edit_post_link($order_id)); ?>" target="_blank"><?php echo esc_html('#' . $order_id); ?></a>
                                        <?php else : ?>
                                            <?php echo esc_html('#' . $order_id); ?>
                                        <?php endif; ?>
                                    <?php else : ?>
                                        &mdash;
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if (!empty($product_ids) && is_array($product_ids)) : ?>
                                        <?php foreach ($product_ids as $product_id) : ?>
                                            <?php if (function_exists('wc_get_product')) : ?>
                                                <a href="<?php echo esc_url(get_edit_post_link($product_id)); ?>" target="_blank"><?php echo esc_html($product_id); ?></a>
                                            <?php else : ?>
                                                <?php echo esc_html($product_id); ?>
                                            <?php endif; ?>
                                            <span>, </span>
                                        <?php endforeach; ?>
                                    <?php else : ?>
                                        &mdash;
                                    <?php endif; ?>
                                </td>
                                <td><?php echo esc_html($backend_conv ?: __('None', 'worknoon-chat')); ?></td>
                                <td>
                                    <a href="<?php echo esc_url($edit_link); ?>"><?php esc_html_e('Edit', 'worknoon-chat'); ?></a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}
