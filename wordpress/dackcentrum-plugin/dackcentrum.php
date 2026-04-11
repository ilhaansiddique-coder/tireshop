<?php
/**
 * Plugin Name: Däckcentrum - EonTyre Integration
 * Plugin URI: https://dackcentrum.kinsta.cloud
 * Description: Connects to EonTyre API to display tyres, rims, complete wheels. Provides shortcodes for the Gutenberg block editor. Integrates with WooCommerce for cart & checkout.
 * Version: 1.0.0
 * Author: Däckcentrum
 * Text Domain: dackcentrum
 * Requires Plugins: woocommerce
 */

if (!defined('ABSPATH')) exit;

define('DC_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DC_PLUGIN_URL', plugin_dir_url(__FILE__));
define('DC_VERSION', '1.0.0');

// Load includes
require_once DC_PLUGIN_DIR . 'includes/class-dc-settings.php';
require_once DC_PLUGIN_DIR . 'includes/class-dc-api.php';
require_once DC_PLUGIN_DIR . 'includes/class-dc-shortcodes.php';
require_once DC_PLUGIN_DIR . 'includes/class-dc-ajax.php';
require_once DC_PLUGIN_DIR . 'includes/class-dc-woocommerce.php';
require_once DC_PLUGIN_DIR . 'includes/class-dc-booking.php';

// Initialize
add_action('plugins_loaded', function () {
    DC_Settings::init();
    DC_API::init();
    DC_Shortcodes::init();
    DC_Ajax::init();
    DC_WooCommerce::init();
    DC_Booking::init();
});

// Enqueue frontend assets
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('dc-styles', DC_PLUGIN_URL . 'assets/css/dackcentrum.css', array(), DC_VERSION);
    wp_enqueue_script('dc-scripts', DC_PLUGIN_URL . 'assets/js/dackcentrum.js', array('jquery'), DC_VERSION, true);

    wp_localize_script('dc-scripts', 'dcData', array(
        'ajaxUrl'  => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('dc_nonce'),
        'currency' => 'kr',
        'vatRate'  => 25,
        'cartUrl'  => wc_get_cart_url(),
        'checkoutUrl' => wc_get_checkout_url(),
    ));
});

// Activation: flush rewrite rules
register_activation_hook(__FILE__, function () {
    flush_rewrite_rules();
});
