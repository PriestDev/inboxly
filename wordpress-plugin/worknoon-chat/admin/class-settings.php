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
}
