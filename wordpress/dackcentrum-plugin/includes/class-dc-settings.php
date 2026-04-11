<?php
/**
 * Admin settings page for API configuration.
 */
class DC_Settings {

    const OPTION_GROUP = 'dc_settings';

    public static function init() {
        add_action('admin_menu', array(__CLASS__, 'add_menu'));
        add_action('admin_init', array(__CLASS__, 'register_settings'));
    }

    public static function add_menu() {
        add_menu_page(
            'Däckcentrum Settings',
            'Däckcentrum',
            'manage_options',
            'dackcentrum',
            array(__CLASS__, 'render_page'),
            'dashicons-car',
            56
        );
    }

    public static function register_settings() {
        register_setting(self::OPTION_GROUP, 'dc_api_key', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '',
        ));
        register_setting(self::OPTION_GROUP, 'dc_webshop_id', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '38',
        ));
        register_setting(self::OPTION_GROUP, 'dc_include_location', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '1048',
        ));

        add_settings_section('dc_api_section', 'EonTyre API Settings', null, 'dackcentrum');

        add_settings_field('dc_api_key', 'API Key', function () {
            $val = get_option('dc_api_key', '');
            echo '<input type="password" name="dc_api_key" value="' . esc_attr($val) . '" class="regular-text" />';
            echo '<p class="description">Your EonTyre API key.</p>';
        }, 'dackcentrum', 'dc_api_section');

        add_settings_field('dc_webshop_id', 'Webshop ID', function () {
            $val = get_option('dc_webshop_id', '38');
            echo '<input type="text" name="dc_webshop_id" value="' . esc_attr($val) . '" class="regular-text" />';
            echo '<p class="description">Default: 38</p>';
        }, 'dackcentrum', 'dc_api_section');

        add_settings_field('dc_include_location', 'Location ID', function () {
            $val = get_option('dc_include_location', '1048');
            echo '<input type="text" name="dc_include_location" value="' . esc_attr($val) . '" class="regular-text" />';
            echo '<p class="description">Default: 1048</p>';
        }, 'dackcentrum', 'dc_api_section');
    }

    public static function render_page() {
        if (!current_user_can('manage_options')) return;
        ?>
        <div class="wrap">
            <h1>Däckcentrum Settings</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields(self::OPTION_GROUP);
                do_settings_sections('dackcentrum');
                submit_button('Save Settings');
                ?>
            </form>
            <hr>
            <h2>Available Shortcodes</h2>
            <p>Use these in any page via the <strong>Shortcode block</strong> in Gutenberg:</p>
            <table class="widefat" style="max-width:800px">
                <thead><tr><th>Shortcode</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>[dc_tyre_search]</code></td><td>Tyre search panel (dimension, season, vehicle type)</td></tr>
                    <tr><td><code>[dc_product_catalog type="tyres"]</code></td><td>Product grid with filters. Types: tyres, rims, complete-wheels</td></tr>
                    <tr><td><code>[dc_product_detail]</code></td><td>Single product detail page (reads ID from URL ?product_id=X)</td></tr>
                    <tr><td><code>[dc_booking_form]</code></td><td>3-step appointment booking wizard</td></tr>
                    <tr><td><code>[dc_hero title="..." subtitle="..." cta_text="..." cta_url="..."]</code></td><td>Hero section with brand styling</td></tr>
                    <tr><td><code>[dc_pricing_table]</code></td><td>Deck hotel pricing (3 tiers)</td></tr>
                    <tr><td><code>[dc_trust_badges]</code></td><td>Trust indicator badges row</td></tr>
                </tbody>
            </table>
        </div>
        <?php
    }

    public static function get_api_key() {
        return get_option('dc_api_key', '');
    }

    public static function get_webshop_id() {
        return get_option('dc_webshop_id', '38');
    }

    public static function get_location_id() {
        return get_option('dc_include_location', '1048');
    }
}
