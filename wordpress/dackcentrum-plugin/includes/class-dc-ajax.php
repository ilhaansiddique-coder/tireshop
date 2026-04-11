<?php
/**
 * AJAX handlers — these are the secure server-side endpoints
 * called by the frontend JavaScript. The API key never leaves the server.
 */
class DC_Ajax {

    public static function init() {
        // Public (no login required) AJAX endpoints
        add_action('wp_ajax_dc_search_products', array(__CLASS__, 'search_products'));
        add_action('wp_ajax_nopriv_dc_search_products', array(__CLASS__, 'search_products'));

        add_action('wp_ajax_dc_get_product', array(__CLASS__, 'get_product'));
        add_action('wp_ajax_nopriv_dc_get_product', array(__CLASS__, 'get_product'));

        add_action('wp_ajax_dc_search_complete_wheels', array(__CLASS__, 'search_complete_wheels'));
        add_action('wp_ajax_nopriv_dc_search_complete_wheels', array(__CLASS__, 'search_complete_wheels'));

        add_action('wp_ajax_dc_add_to_cart', array(__CLASS__, 'add_to_cart'));
        add_action('wp_ajax_nopriv_dc_add_to_cart', array(__CLASS__, 'add_to_cart'));

        add_action('wp_ajax_dc_submit_booking', array(__CLASS__, 'submit_booking'));
        add_action('wp_ajax_nopriv_dc_submit_booking', array(__CLASS__, 'submit_booking'));
    }

    /**
     * Search tyres/rims via EonTyre API.
     */
    public static function search_products() {
        check_ajax_referer('dc_nonce', 'nonce');

        $args = array(
            'page'          => isset($_GET['page']) ? intval($_GET['page']) : 1,
            'limit'         => isset($_GET['limit']) ? intval($_GET['limit']) : 24,
            'typeId'        => isset($_GET['typeId']) ? sanitize_text_field($_GET['typeId']) : '1',
            'tyreType'      => isset($_GET['tyreType']) ? sanitize_text_field($_GET['tyreType']) : '2',
            'vehicleType'   => isset($_GET['vehicleType']) ? sanitize_text_field($_GET['vehicleType']) : 'alla',
            'query'         => isset($_GET['query']) ? sanitize_text_field($_GET['query']) : '',
            'diameter'      => isset($_GET['diameter']) ? sanitize_text_field($_GET['diameter']) : '',
            'width'         => isset($_GET['width']) ? sanitize_text_field($_GET['width']) : '',
            'aspectRatio'   => isset($_GET['aspectRatio']) ? sanitize_text_field($_GET['aspectRatio']) : '',
            'speedIndex'    => isset($_GET['speedIndex']) ? sanitize_text_field($_GET['speedIndex']) : '',
            'isRunflat'     => isset($_GET['isRunflat']) ? sanitize_text_field($_GET['isRunflat']) : 'false',
            'isSilence'     => isset($_GET['isSilence']) ? sanitize_text_field($_GET['isSilence']) : 'false',
            'isElectricVehicle' => isset($_GET['isElectricVehicle']) ? sanitize_text_field($_GET['isElectricVehicle']) : 'false',
        );

        $result = DC_API::fetch_products($args);

        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message(), 500);
        }

        wp_send_json_success($result);
    }

    /**
     * Get single product detail.
     */
    public static function get_product() {
        check_ajax_referer('dc_nonce', 'nonce');

        $id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;
        if (!$id) {
            wp_send_json_error('Missing product_id', 400);
        }

        $result = DC_API::fetch_product($id);

        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message(), 500);
        }

        wp_send_json_success($result);
    }

    /**
     * Search complete wheels.
     */
    public static function search_complete_wheels() {
        check_ajax_referer('dc_nonce', 'nonce');

        $args = array(
            'page'  => isset($_GET['page']) ? intval($_GET['page']) : 1,
            'limit' => isset($_GET['limit']) ? intval($_GET['limit']) : 24,
            'query' => isset($_GET['query']) ? sanitize_text_field($_GET['query']) : '',
        );

        $result = DC_API::fetch_complete_wheels($args);

        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message(), 500);
        }

        wp_send_json_success($result);
    }

    /**
     * Add a product to WooCommerce cart.
     * We create a custom cart item since products aren't WC products.
     */
    public static function add_to_cart() {
        check_ajax_referer('dc_nonce', 'nonce');

        $product_id   = sanitize_text_field($_POST['product_id'] ?? '');
        $name         = sanitize_text_field($_POST['name'] ?? '');
        $brand        = sanitize_text_field($_POST['brand'] ?? '');
        $price        = floatval($_POST['price'] ?? 0);
        $quantity     = max(1, intval($_POST['quantity'] ?? 1));
        $image_url    = esc_url_raw($_POST['image_url'] ?? '');
        $dimension    = sanitize_text_field($_POST['dimension'] ?? '');
        $supplier_id  = sanitize_text_field($_POST['supplier_id'] ?? '');
        $location_id  = sanitize_text_field($_POST['location_id'] ?? '');

        if (empty($product_id) || empty($name) || $price <= 0) {
            wp_send_json_error('Invalid product data.', 400);
        }

        // Use WooCommerce's placeholder/dummy product approach
        // We store EonTyre product data as cart item meta
        $cart_item_data = array(
            'dc_eontyre_product' => true,
            'dc_product_id'      => $product_id,
            'dc_name'            => $name,
            'dc_brand'           => $brand,
            'dc_price'           => $price,
            'dc_image_url'       => $image_url,
            'dc_dimension'       => $dimension,
            'dc_supplier_id'     => $supplier_id,
            'dc_location_id'     => $location_id,
        );

        // We need a WC product to add to cart. Use a placeholder product.
        $placeholder_id = self::get_or_create_placeholder_product();

        if (!$placeholder_id) {
            wp_send_json_error('Could not create cart item.', 500);
        }

        // Generate unique cart item key based on eontyre product + supplier + location
        $cart_item_key = WC()->cart->generate_cart_id($placeholder_id, 0, array(), $cart_item_data);
        $found = WC()->cart->find_product_in_cart($cart_item_key);

        if ($found) {
            WC()->cart->set_quantity($found, WC()->cart->cart_contents[$found]['quantity'] + $quantity);
        } else {
            WC()->cart->add_to_cart($placeholder_id, $quantity, 0, array(), $cart_item_data);
        }

        wp_send_json_success(array(
            'cart_count' => WC()->cart->get_cart_contents_count(),
            'cart_total' => WC()->cart->get_cart_total(),
            'message'    => $name . ' added to cart.',
        ));
    }

    /**
     * Get or create a hidden WooCommerce placeholder product for EonTyre items.
     */
    private static function get_or_create_placeholder_product() {
        $placeholder_id = get_option('dc_placeholder_product_id', 0);

        if ($placeholder_id && get_post_status($placeholder_id) === 'publish') {
            return $placeholder_id;
        }

        // Create a hidden placeholder product
        $product = new WC_Product_Simple();
        $product->set_name('Däckcentrum Product');
        $product->set_status('publish');
        $product->set_catalog_visibility('hidden');
        $product->set_price(0);
        $product->set_regular_price(0);
        $product->set_virtual(true);
        $product->save();

        update_option('dc_placeholder_product_id', $product->get_id());
        return $product->get_id();
    }

    /**
     * Submit booking form.
     */
    public static function submit_booking() {
        check_ajax_referer('dc_nonce', 'nonce');

        $service = sanitize_text_field($_POST['service'] ?? '');
        $date    = sanitize_text_field($_POST['date'] ?? '');
        $time    = sanitize_text_field($_POST['time'] ?? '');
        $name    = sanitize_text_field($_POST['name'] ?? '');
        $email   = sanitize_email($_POST['email'] ?? '');
        $phone   = sanitize_text_field($_POST['phone'] ?? '');
        $vehicle = sanitize_text_field($_POST['vehicle'] ?? '');
        $notes   = sanitize_textarea_field($_POST['notes'] ?? '');

        if (empty($service) || empty($date) || empty($time) || empty($name) || empty($email) || empty($phone)) {
            wp_send_json_error('Please fill in all required fields.', 400);
        }

        $result = DC_Booking::create_booking(array(
            'service' => $service,
            'date'    => $date,
            'time'    => $time,
            'name'    => $name,
            'email'   => $email,
            'phone'   => $phone,
            'vehicle' => $vehicle,
            'notes'   => $notes,
        ));

        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message(), 500);
        }

        wp_send_json_success(array(
            'booking_id' => $result,
            'message'    => 'Booking confirmed! Check your email for details.',
        ));
    }
}
