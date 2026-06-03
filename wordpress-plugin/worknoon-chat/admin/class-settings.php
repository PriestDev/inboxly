<?php
/**
 * Settings Page Class
 */

class Inboxly_Chat_Settings {

    public function __construct() {
        // keep onboarding visibility in sync with connection state
        add_action('admin_init', array($this, 'maybe_mark_connected'));
    }

    public function add_settings_page() {
        add_menu_page(
            'Inboxly Settings',
            'Inboxly',
            'manage_options',
            'inboxly-chat-settings',
            array($this, 'render_settings_page'),
            'dashicons-format-chat'
        );

        add_submenu_page(
            'inboxly-chat-settings',
            'Chat Sessions',
            'Chat Sessions',
            'manage_options',
            'inboxly-chat-sessions',
            array($this, 'render_sessions_page')
        );

        // Only expose onboarding while site is not connected
        $connected = get_option('inboxly_chat_connected', 0);
        if (!$connected) {
            add_submenu_page(
                'inboxly-chat-settings',
                'Onboarding & Setup',
                'Onboarding',
                'manage_options',
                'inboxly-chat-onboarding',
                array($this, 'render_onboarding_page')
            );
        }
    }

    public function register_settings() {
        register_setting('inboxly-chat-settings', 'inboxly_chat_api_url');
        register_setting('inboxly-chat-settings', 'inboxly_chat_api_key');
        register_setting('inboxly-chat-settings', 'inboxly_chat_enable_notifications');
        register_setting('inboxly-chat-settings', 'inboxly_chat_enable_offline_form');
        register_setting('inboxly-chat-settings', 'inboxly_chat_offline_contact_label');
        register_setting('inboxly-chat-settings', 'inboxly_chat_widget_position');
        register_setting('inboxly-chat-settings', 'inboxly_chat_widget_primary_color');
        register_setting('inboxly-chat-settings', 'inboxly_chat_widget_secondary_color');
        register_setting('inboxly-chat-settings', 'inboxly_chat_widget_welcome_message');
        register_setting('inboxly-chat-settings', 'inboxly_chat_single_agent_enabled');
        register_setting('inboxly-chat-settings', 'inboxly_chat_agent_name');
        register_setting('inboxly-chat-settings', 'inboxly_chat_agent_email');
    }

    public function maybe_mark_connected() {
        if (!current_user_can('manage_options')) {
            return;
        }

        $api_key = get_option('inboxly_chat_api_key', '');
        if (!empty($api_key)) {
            update_option('inboxly_chat_connected', 1);
            // remove onboarding redirect once connected
            delete_option('inboxly_chat_do_activation_redirect');
        } else {
            update_option('inboxly_chat_connected', 0);
        }
    }

    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        ?>
        <?php $connected = get_option('inboxly_chat_connected', 0); ?>
        <div class="wrap inboxly-chat-admin-panel">
            <div style="margin-bottom:1rem; display:flex; gap:1rem; align-items:center;">
                <div class="status-badge" style="font-weight:600; padding:0.5rem 0.75rem; border-radius:999px;">
                    <?php if ($connected) : ?>
                        <span style="background:#d1fae5; color:#065f46; padding:0.25rem 0.6rem; border-radius:999px;"><?php esc_html_e('Connected', 'inboxly-chat'); ?></span>
                    <?php else : ?>
                        <span style="background:#fff7ed; color:#92400e; padding:0.25rem 0.6rem; border-radius:999px;"><?php esc_html_e('Not connected', 'inboxly-chat'); ?></span>
                    <?php endif; ?>
                </div>
                <div style="color:#6b7280; font-size:0.95rem;"><?php esc_html_e('API key presence determines connection status. Configure API key and save to complete setup.', 'inboxly-chat'); ?></div>
            </div>
            <div class="page-header">
                <div>
                    <p class="page-eyebrow"><?php esc_html_e('Inboxly settings', 'inboxly-chat'); ?></p>
                    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
                    <p><?php esc_html_e('Configure your chat backend and support widget from one polished control panel.', 'inboxly-chat'); ?></p>
                </div>
                <div class="page-actions">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=inboxly-chat-onboarding')); ?>" class="button button-primary"><?php esc_html_e('Onboarding guide', 'inboxly-chat'); ?></a>
                </div>
            </div>

            <form action="options.php" method="post">
                <?php
                settings_fields('inboxly-chat-settings');
                do_settings_sections('inboxly-chat-settings');
                // When saving settings, if API key exists we mark plugin connected
                $api_key = get_option('inboxly_chat_api_key');
                if (!empty($api_key)) {
                    update_option('inboxly_chat_connected', 1);
                    // once connected, remove one-time activation redirect and onboarding visibility
                    delete_option('inboxly_chat_do_activation_redirect');
                }
                ?>
                <div class="panel-card">
                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="api_key"><?php esc_html_e('API Key', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <input type="password" id="api_key" name="inboxly_chat_api_key" 
                                       value="<?php echo esc_attr(get_option('inboxly_chat_api_key')); ?>"
                                       class="regular-text" />
                                <p class="description"><?php esc_html_e('Enter your Inboxly API key to connect this site securely.', 'inboxly-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="enable_notifications"><?php esc_html_e('Enable Notifications', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <label style="display:inline-flex; align-items:center; gap:0.5rem;">
                                    <input type="checkbox" id="enable_notifications" name="inboxly_chat_enable_notifications" 
                                           value="1" <?php checked(get_option('inboxly_chat_enable_notifications')); ?> />
                                    <?php esc_html_e('Send email notifications for new messages', 'inboxly-chat'); ?>
                                </label>
                                <p class="description"><?php esc_html_e('Enable automatic notifications when a new chat message arrives.', 'inboxly-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="widget_position"><?php esc_html_e('Widget position', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <select id="widget_position" name="inboxly_chat_widget_position">
                                    <?php $position = esc_attr(get_option('inboxly_chat_widget_position')); ?>
                                    <option value="bottom-right" <?php selected($position, 'bottom-right'); ?>><?php esc_html_e('Bottom right', 'inboxly-chat'); ?></option>
                                    <option value="bottom-left" <?php selected($position, 'bottom-left'); ?>><?php esc_html_e('Bottom left', 'inboxly-chat'); ?></option>
                                    <option value="top-right" <?php selected($position, 'top-right'); ?>><?php esc_html_e('Top right', 'inboxly-chat'); ?></option>
                                    <option value="top-left" <?php selected($position, 'top-left'); ?>><?php esc_html_e('Top left', 'inboxly-chat'); ?></option>
                                </select>
                                <p class="description"><?php esc_html_e('Choose the position for the floating chat widget.', 'inboxly-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="widget_primary_color"><?php esc_html_e('Primary color', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <input type="color" id="widget_primary_color" name="inboxly_chat_widget_primary_color" 
                                       value="<?php echo esc_attr(get_option('inboxly_chat_widget_primary_color')); ?>" />
                                <p class="description"><?php esc_html_e('Primary accent color for the chat widget.', 'inboxly-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="widget_secondary_color"><?php esc_html_e('Secondary color', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <input type="color" id="widget_secondary_color" name="inboxly_chat_widget_secondary_color" 
                                       value="<?php echo esc_attr(get_option('inboxly_chat_widget_secondary_color')); ?>" />
                                <p class="description"><?php esc_html_e('Secondary accent color for buttons and badges.', 'inboxly-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="widget_welcome_message"><?php esc_html_e('Welcome message', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <textarea id="widget_welcome_message" name="inboxly_chat_widget_welcome_message" rows="3" class="large-text"><?php echo esc_textarea(get_option('inboxly_chat_widget_welcome_message')); ?></textarea>
                                <p class="description"><?php esc_html_e('Friendly introductory text shown inside the chat widget.', 'inboxly-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="enable_offline_form"><?php esc_html_e('Enable offline contact form', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <label style="display:inline-flex; align-items:center; gap:0.5rem;">
                                    <input type="checkbox" id="enable_offline_form" name="inboxly_chat_enable_offline_form" 
                                           value="1" <?php checked(get_option('inboxly_chat_enable_offline_form')); ?> />
                                    <?php esc_html_e('Show offline message capture form to visitors.', 'inboxly-chat'); ?>
                                </label>
                                <p class="description"><?php esc_html_e('When agents are offline, capture visitor messages and email them automatically.', 'inboxly-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="offline_contact_label"><?php esc_html_e('Offline message label', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <textarea id="offline_contact_label" name="inboxly_chat_offline_contact_label" rows="3" class="large-text"><?php echo esc_textarea(get_option('inboxly_chat_offline_contact_label')); ?></textarea>
                                <p class="description"><?php esc_html_e('Text displayed when the widget is offline.', 'inboxly-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="single_agent_enabled"><?php esc_html_e('Single agent support', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <label style="display:inline-flex; align-items:center; gap:0.5rem;">
                                    <input type="checkbox" id="single_agent_enabled" name="inboxly_chat_single_agent_enabled" 
                                           value="1" <?php checked(get_option('inboxly_chat_single_agent_enabled')); ?> />
                                    <?php esc_html_e('Assign a dedicated support agent for every visitor.', 'inboxly-chat'); ?>
                                </label>
                                <p class="description"><?php esc_html_e('Use a single agent profile to make support feel personal.', 'inboxly-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="agent_name"><?php esc_html_e('Agent name', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <input type="text" id="agent_name" name="inboxly_chat_agent_name" 
                                       value="<?php echo esc_attr(get_option('inboxly_chat_agent_name')); ?>"
                                       class="regular-text" />
                                <p class="description"><?php esc_html_e('Name of the primary support agent shown to visitors.', 'inboxly-chat'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="agent_email"><?php esc_html_e('Agent email', 'inboxly-chat'); ?></label>
                            </th>
                            <td>
                                <input type="email" id="agent_email" name="inboxly_chat_agent_email" 
                                       value="<?php echo esc_attr(get_option('inboxly_chat_agent_email')); ?>"
                                       class="regular-text" />
                                <p class="description"><?php esc_html_e('Email address used for agent notifications and contact follow-up.', 'inboxly-chat'); ?></p>
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
            <h1><?php esc_html_e('Chat Sessions', 'inboxly-chat'); ?></h1>
            <p><?php esc_html_e('View all chat sessions and jump to related WooCommerce orders or products.', 'inboxly-chat'); ?></p>
            <table class="widefat fixed striped">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Session ID', 'inboxly-chat'); ?></th>
                        <th><?php esc_html_e('Title', 'inboxly-chat'); ?></th>
                        <th><?php esc_html_e('Context', 'inboxly-chat'); ?></th>
                        <th><?php esc_html_e('Order', 'inboxly-chat'); ?></th>
                        <th><?php esc_html_e('Products', 'inboxly-chat'); ?></th>
                        <th><?php esc_html_e('Backend Conv.', 'inboxly-chat'); ?></th>
                        <th><?php esc_html_e('Actions', 'inboxly-chat'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($sessions)) : ?>
                        <tr>
                            <td colspan="7"><?php esc_html_e('No chat sessions found.', 'inboxly-chat'); ?></td>
                        </tr>
                    <?php else : ?>
                        <?php foreach ($sessions as $session) :
                            $order_id = get_post_meta($session->ID, '_inboxly_chat_order_id', true);
                            $product_ids = get_post_meta($session->ID, '_inboxly_chat_product_ids', true);
                            $backend_conv = get_post_meta($session->ID, '_inboxly_chat_backend_conversation_id', true);
                            $context = get_post_meta($session->ID, '_inboxly_chat_context', true) ?: __('General', 'inboxly-chat');
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
                                <td><?php echo esc_html($backend_conv ?: __('None', 'inboxly-chat')); ?></td>
                                <td>
                                    <a href="<?php echo esc_url($edit_link); ?>"><?php esc_html_e('Edit', 'inboxly-chat'); ?></a>
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

        // If plugin is already connected, send user to settings instead
        if (get_option('inboxly_chat_connected', 0)) {
            wp_safe_redirect(admin_url('admin.php?page=inboxly-chat-settings'));
            exit;
        }

        $activated_at = get_option('inboxly_chat_activated_at');
        $activated_site = get_option('inboxly_chat_activated_site');
        $shortcode = '[inboxly_chat]';
        ?>
        <div class="wrap inboxly-chat-admin-panel">
            <div class="page-header">
                <div>
                    <p class="page-eyebrow"><?php esc_html_e('Getting started', 'inboxly-chat'); ?></p>
                    <h1><?php esc_html_e('Welcome to Inboxly', 'inboxly-chat'); ?></h1>
                    <p><?php esc_html_e('Let's connect your site to Inboxly and start accepting live chat messages from your visitors.', 'inboxly-chat'); ?></p>
                </div>
                <div class="page-actions">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=inboxly-chat-settings')); ?>" class="button button-secondary"><?php esc_html_e('Skip to settings', 'inboxly-chat'); ?></a>
                </div>
            </div>

            <div class="panel-grid">
                <section class="panel-card onboarding-step">
                    <div class="step-number">1</div>
                    <h3><?php esc_html_e('Get your API key', 'inboxly-chat'); ?></h3>
                    <p><?php esc_html_e('Sign up for a free Inboxly account and retrieve your API key from the dashboard.', 'inboxly-chat'); ?></p>
                    <ol class="checklist" style="margin-top:1rem;">
                        <li><?php esc_html_e('Visit', 'inboxly-chat'); ?> <strong><a href="https://app.inboxly.com/signup" target="_blank">app.inboxly.com</a></strong></li>
                        <li><?php esc_html_e('Create your account or sign in', 'inboxly-chat'); ?></li>
                        <li><?php esc_html_e('Go to Settings → API Keys', 'inboxly-chat'); ?></li>
                        <li><?php esc_html_e('Copy your API key (starts with', 'inboxly-chat'); ?> <code>sk_</code>)</li>
                    </ol>
                </section>

                <section class="panel-card onboarding-step">
                    <div class="step-number">2</div>
                    <h3><?php esc_html_e('Configure the plugin', 'inboxly-chat'); ?></h3>
                    <p><?php esc_html_e('Paste your API key into the plugin settings to connect your site.', 'inboxly-chat'); ?></p>
                    <ol class="checklist" style="margin-top:1rem;">
                        <li><?php esc_html_e('Go to', 'inboxly-chat'); ?> <strong><?php esc_html_e('WP Admin → Inboxly → Settings', 'inboxly-chat'); ?></strong></li>
                        <li><?php esc_html_e('Paste your API key in the "API Key" field', 'inboxly-chat'); ?></li>
                        <li><?php esc_html_e('Click "Save Changes"', 'inboxly-chat'); ?></li>
                    </ol>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=inboxly-chat-settings')); ?>" class="button button-primary" style="margin-top:1.5rem;"><?php esc_html_e('Open Settings', 'inboxly-chat'); ?></a>
                </section>

                <section class="panel-card onboarding-step">
                    <div class="step-number">3</div>
                    <h3><?php esc_html_e('Add to your site', 'inboxly-chat'); ?></h3>
                    <p><?php esc_html_e('Display the chat widget on any page or post using the shortcode below.', 'inboxly-chat'); ?></p>
                    <div class="shortcode-box" style="margin-top:1rem;">
                        <input type="text" id="inboxly-shortcode" readonly value="<?php echo esc_attr($shortcode); ?>" />
                        <button class="button button-secondary" id="inboxly-copy-shortcode"><?php esc_html_e('Copy', 'inboxly-chat'); ?></button>
                    </div>
                    <p class="description"><?php esc_html_e('Paste this shortcode into any WordPress page, post, or custom template.', 'inboxly-chat'); ?></p>
                </section>
            </div>

            <section class="panel-card">
                <h2><?php esc_html_e('What happens next?', 'inboxly-chat'); ?></h2>
                <ul class="checklist" style="list-style:disc; padding-left:1.5rem;">
                    <li><?php esc_html_e('Once you save your API key, the "Onboarding" tab will disappear and Settings will be your control center.', 'inboxly-chat'); ?></li>
                    <li><?php esc_html_e('Visitors will see the live chat widget on pages with the shortcode.', 'inboxly-chat'); ?></li>
                    <li><?php esc_html_e('Your support team can respond to chats from the Inboxly dashboard.', 'inboxly-chat'); ?></li>
                    <li><?php esc_html_e('If using WooCommerce, new orders will automatically create chat sessions.', 'inboxly-chat'); ?></li>
                </ul>
            </section>

            <section class="panel-card" style="background:#f0fdf4; border-color:#86efac;">
                <h2 style="color:#166534;"><?php esc_html_e('💡 Pro tip', 'inboxly-chat'); ?></h2>
                <p style="color:#15803d;"><?php esc_html_e('Add the shortcode to a sticky footer or floating widget so the chat is always available to your visitors.', 'inboxly-chat'); ?></p>
            </section>

            <script>
            document.addEventListener('DOMContentLoaded', function(){
                var btn = document.getElementById('inboxly-copy-shortcode');
                if (btn) btn.addEventListener('click', function(){
                    var el = document.getElementById('inboxly-shortcode');
                    el.select(); el.setSelectionRange(0, 99999);
                    try { document.execCommand('copy'); btn.textContent = '<?php echo esc_html__('Copied!', 'inboxly-chat'); ?>'; setTimeout(()=> btn.textContent='<?php echo esc_html__('Copy', 'inboxly-chat'); ?>',1200);} catch(e){ alert('<?php echo esc_html__('Copy failed.', 'inboxly-chat'); ?>'); }
                });
            });
            </script>
        </div>
        <?php
    }
}
