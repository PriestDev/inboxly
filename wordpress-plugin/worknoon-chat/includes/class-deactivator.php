<?php
/**
 * Plugin Deactivation Class
 */

class Worknoon_Chat_Deactivator {

    public static function deactivate() {
        // Clean up on deactivation if needed
        flush_rewrite_rules();
    }
}
