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

        add_submenu_page(
            'worknoon-chat-settings',
            'Onboarding & Setup',
            'Onboarding',
            'manage_options',
            'worknoon-chat-onboarding',
            array($this, 'render_onboarding_page')
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
        <div class="wrap worknoon-chat-admin-panel">
            <div class="page-header">
                <div>
                    <p class="page-eyebrow"><?php esc_html_e('WorkNoon Chat settings', 'worknoon-chat'); ?></p>
                    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
                    <p><?php esc_html_e('Configure your chat backend, notifications, and file upload behavior from one polished control panel.', 'worknoon-chat'); ?></p>
                </div>
                <div class="page-actions">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=worknoon-chat-onboarding')); ?>" class="button button-primary"><?php esc_html_e('Onboarding guide', 'worknoon-chat'); ?></a>
                </div>
            </div>

            <form action="options.php" method="post">
                <?php
                settings_fields('worknoon-chat-settings');
                do_settings_sections('worknoon-chat-settings');
                ?>
                <div class="panel-card">
                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="api_url"><?php esc_html_e('API URL', 'worknoon-chat'); ?></label>
                            </th>
                            <td>
                                <input type="text" id="api_url" name="worknoon_chat_api_url" 
                                       value="<?php echo esc_attr(get_option('worknoon_chat_api_url')); ?>"
                                       class="regular-text" />
                                <p class="description"><?php esc_html_e('Enter the URL of your chat backend API.', 'worknoon-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="enable_notifications"><?php esc_html_e('Enable Notifications', 'worknoon-chat'); ?></label>
                            </th>
                            <td>
                                <label style="display:inline-flex; align-items:center; gap:0.5rem;">
                                    <input type="checkbox" id="enable_notifications" name="worknoon_chat_enable_notifications" 
                                           value="1" <?php checked(get_option('worknoon_chat_enable_notifications')); ?> />
                                    <?php esc_html_e('Send email notifications for new messages', 'worknoon-chat'); ?>
                                </label>
                                <p class="description"><?php esc_html_e('Enable automatic notifications when a new chat message arrives.', 'worknoon-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="enable_file_uploads"><?php esc_html_e('Enable File Uploads', 'worknoon-chat'); ?></label>
                            </th>
                            <td>
                                <label style="display:inline-flex; align-items:center; gap:0.5rem;">
                                    <input type="checkbox" id="enable_file_uploads" name="worknoon_chat_enable_file_uploads" 
                                           value="1" <?php checked(get_option('worknoon_chat_enable_file_uploads')); ?> />
                                    <?php esc_html_e('Allow attachments inside chat threads', 'worknoon-chat'); ?>
                                </label>
                                <p class="description"><?php esc_html_e('Allow users to upload files in chat conversations.', 'worknoon-chat'); ?></p>
                            </td>
                        </tr>
                    </table>
                </div>
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

    public function render_onboarding_page() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $activated_at = get_option('worknoon_chat_activated_at');
        $activated_site = get_option('worknoon_chat_activated_site');
        $api_url = esc_attr(get_option('worknoon_chat_api_url')) ?: 'http://localhost:5000';
        $shortcode = '[worknoon_chat]';
        ?>
        <div class="wrap worknoon-chat-admin-panel">
            <div class="page-header">
                <div>
                    <p class="page-eyebrow"><?php esc_html_e('Onboarding & setup', 'worknoon-chat'); ?></p>
                    <h1><?php esc_html_e('WorkNoon Chat — Onboarding & Setup', 'worknoon-chat'); ?></h1>
                    <p><?php esc_html_e('This guide helps you finish setup fast and get the chat widget live on your site.', 'worknoon-chat'); ?></p>
                </div>
                <div class="page-actions">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=worknoon-chat-settings')); ?>" class="button button-secondary"><?php esc_html_e('View settings', 'worknoon-chat'); ?></a>
                </div>
            </div>

            <div class="panel-grid">
                <section class="panel-card">
                    <h2><?php esc_html_e('Activation', 'worknoon-chat'); ?></h2>
                    <p><?php esc_html_e('Plugin activated on this site at:', 'worknoon-chat'); ?> <strong><?php echo esc_html($activated_at); ?></strong></p>
                    <p><?php esc_html_e('Registered site URL:', 'worknoon-chat'); ?> <strong><?php echo esc_html($activated_site); ?></strong></p>
                </section>

                <section class="panel-card">
                    <h2><?php esc_html_e('Quick start', 'worknoon-chat'); ?></h2>
                    <ol class="checklist">
                        <li><?php esc_html_e('Set the backend API URL in Settings → WorkNoon Chat.', 'worknoon-chat'); ?></li>
                        <li><?php esc_html_e('Create a page or post and insert the shortcode below.', 'worknoon-chat'); ?></li>
                        <li><?php esc_html_e('Ensure your backend server is running at the configured URL.', 'worknoon-chat'); ?></li>
                        <li><?php esc_html_e('If using WooCommerce, new orders will generate chat sessions automatically.', 'worknoon-chat'); ?></li>
                    </ol>
                </section>
            </div>

            <div class="panel-grid">
                <section class="panel-card">
                    <h3><?php esc_html_e('Shortcode', 'worknoon-chat'); ?></h3>
                    <div class="shortcode-box">
                        <input type="text" id="worknoon-shortcode" readonly value="<?php echo esc_attr($shortcode); ?>" />
                        <button class="button button-secondary" id="worknoon-copy-shortcode"><?php esc_html_e('Copy', 'worknoon-chat'); ?></button>
                    </div>
                </section>

                <section class="panel-card">
                    <h3><?php esc_html_e('API URL', 'worknoon-chat'); ?></h3>
                    <p><code class="api-url-code"><?php echo esc_html($api_url); ?></code></p>
                </section>
            </div>

            <section class="panel-card">
                <h2><?php esc_html_e('Testing', 'worknoon-chat'); ?></h2>
                <ol class="checklist">
                    <li><?php esc_html_e('Open the page that contains the shortcode while logged in.', 'worknoon-chat'); ?></li>
                    <li><?php esc_html_e('Click the chat icon, open the widget, and send a test message.', 'worknoon-chat'); ?></li>
                    <li><?php esc_html_e('Review your backend logs for connection and message events.', 'worknoon-chat'); ?></li>
                </ol>
            </section>

            <script>
            document.addEventListener('DOMContentLoaded', function(){
                var btn = document.getElementById('worknoon-copy-shortcode');
                if (btn) btn.addEventListener('click', function(){
                    var el = document.getElementById('worknoon-shortcode');
                    el.select(); el.setSelectionRange(0, 99999);
                    try { document.execCommand('copy'); btn.textContent = '<?php echo esc_html__('Copied', 'worknoon-chat'); ?>'; setTimeout(()=> btn.textContent='<?php echo esc_html__('Copy', 'worknoon-chat'); ?>',1200);} catch(e){ alert('<?php echo esc_html__('Copy failed.', 'worknoon-chat'); ?>'); }
                });
            });
            </script>
        </div>
        <?php
    }
}
