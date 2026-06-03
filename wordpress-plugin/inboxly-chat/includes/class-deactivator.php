<?php
/**
 * Plugin Deactivation Class
 */

class Inboxly_Chat_Deactivator {

    public static function deactivate() {
        // Clean up on deactivation if needed
        flush_rewrite_rules();
    }
}
