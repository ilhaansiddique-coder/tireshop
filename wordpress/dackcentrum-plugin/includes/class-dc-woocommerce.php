<?php
/**
 * WooCommerce integration — handles custom cart items from EonTyre,
 * custom pricing, and order forwarding to EonTyre API.
 */
class DC_WooCommerce {

    public static function init() {
        // Override cart item price with EonTyre price
        add_action('woocommerce_before_calculate_totals', array(__CLASS__, 'set_custom_prices'), 20);

        // Display custom name in cart
        add_filter('woocommerce_cart_item_name', array(__CLASS__, 'cart_item_name'), 10, 3);

        // Display custom thumbnail in cart
        add_filter('woocommerce_cart_item_thumbnail', array(__CLASS__, 'cart_item_thumbnail'), 10, 3);

        // Add custom data display in cart
        add_filter('woocommerce_get_item_data', array(__CLASS__, 'cart_item_data'), 10, 2);

        // Save custom meta to order items
        add_action('woocommerce_checkout_create_order_line_item', array(__CLASS__, 'save_order_item_meta'), 10, 4);

        // Forward order to EonTyre after payment
        add_action('woocommerce_order_status_processing', array(__CLASS__, 'forward_order_to_eontyre'));
        add_action('woocommerce_order_status_completed', array(__CLASS__, 'forward_order_to_eontyre'));

        // Hide placeholder product from shop
        add_action('woocommerce_product_query', array(__CLASS__, 'hide_placeholder_from_shop'));
    }

    /**
     * Set custom price for EonTyre cart items.
     */
    public static function set_custom_prices($cart) {
        if (is_admin() && !defined('DOING_AJAX')) return;
        if (did_action('woocommerce_before_calculate_totals') >= 2) return;

        foreach ($cart->get_cart() as $cart_item) {
            if (!empty($cart_item['dc_eontyre_product'])) {
                $price = floatval($cart_item['dc_price'] ?? 0);
                $cart_item['data']->set_price($price);
            }
        }
    }

    /**
     * Override product name in cart with EonTyre product name.
     */
    public static function cart_item_name($name, $cart_item, $cart_item_key) {
        if (!empty($cart_item['dc_eontyre_product'])) {
            $brand = esc_html($cart_item['dc_brand'] ?? '');
            $pname = esc_html($cart_item['dc_name'] ?? 'Product');
            return '<span class="dc-cart-brand">' . $brand . '</span><br>' . $pname;
        }
        return $name;
    }

    /**
     * Override product thumbnail in cart.
     */
    public static function cart_item_thumbnail($thumbnail, $cart_item, $cart_item_key) {
        if (!empty($cart_item['dc_eontyre_product']) && !empty($cart_item['dc_image_url'])) {
            return '<img src="' . esc_url($cart_item['dc_image_url']) . '" alt="' . esc_attr($cart_item['dc_name'] ?? '') . '" class="dc-cart-thumb" style="width:64px;height:64px;object-fit:contain;" />';
        }
        return $thumbnail;
    }

    /**
     * Show extra data (dimension, brand) under cart item name.
     */
    public static function cart_item_data($item_data, $cart_item) {
        if (!empty($cart_item['dc_eontyre_product'])) {
            if (!empty($cart_item['dc_dimension'])) {
                $item_data[] = array(
                    'key'   => 'Dimension',
                    'value' => $cart_item['dc_dimension'],
                );
            }
        }
        return $item_data;
    }

    /**
     * Save EonTyre product data to WooCommerce order item meta.
     */
    public static function save_order_item_meta($item, $cart_item_key, $values, $order) {
        if (!empty($values['dc_eontyre_product'])) {
            $item->add_meta_data('_dc_eontyre_product', true);
            $item->add_meta_data('_dc_product_id', $values['dc_product_id'] ?? '');
            $item->add_meta_data('_dc_supplier_id', $values['dc_supplier_id'] ?? '');
            $item->add_meta_data('_dc_location_id', $values['dc_location_id'] ?? '');
            $item->add_meta_data('_dc_brand', $values['dc_brand'] ?? '');
            $item->add_meta_data('_dc_name', $values['dc_name'] ?? '');
            $item->add_meta_data('_dc_dimension', $values['dc_dimension'] ?? '');
            $item->add_meta_data('Dimension', $values['dc_dimension'] ?? '');
            $item->add_meta_data('Brand', $values['dc_brand'] ?? '');
        }
    }

    /**
     * Forward a WooCommerce order to EonTyre when it's processed.
     */
    public static function forward_order_to_eontyre($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) return;

        // Don't forward twice
        if ($order->get_meta('_dc_eontyre_order_id')) return;

        $products = array();
        foreach ($order->get_items() as $item) {
            if ($item->get_meta('_dc_eontyre_product')) {
                $products[] = array(
                    'id'       => intval($item->get_meta('_dc_product_id')),
                    'quantity' => $item->get_quantity(),
                    'supplier' => intval($item->get_meta('_dc_supplier_id')) ?: null,
                    'location' => intval($item->get_meta('_dc_location_id')) ?: null,
                );
            }
        }

        if (empty($products)) return;

        $payload = array(
            'customer' => array(
                'type'        => 2,
                'name'        => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
                'email'       => $order->get_billing_email(),
                'phone'       => $order->get_billing_phone(),
                'address1'    => $order->get_billing_address_1(),
                'postal_code' => $order->get_billing_postcode(),
                'city'        => $order->get_billing_city(),
                'country'     => $order->get_billing_country() ?: 'SE',
                'update'      => true,
            ),
            'products'        => $products,
            'delivery_option' => 0,
            'comments'        => array($order->get_customer_note()),
        );

        $result = DC_API::create_order($payload);

        if (!is_wp_error($result) && isset($result['id'])) {
            $order->update_meta_data('_dc_eontyre_order_id', $result['id']);
            $order->add_order_note('EonTyre order created: #' . $result['id']);
            $order->save();
        } else {
            $error_msg = is_wp_error($result) ? $result->get_error_message() : 'Unknown error';
            $order->add_order_note('EonTyre order failed: ' . $error_msg);
            $order->save();
        }
    }

    /**
     * Hide the placeholder product from the shop page.
     */
    public static function hide_placeholder_from_shop($query) {
        $placeholder_id = get_option('dc_placeholder_product_id', 0);
        if ($placeholder_id) {
            $query->set('post__not_in', array($placeholder_id));
        }
    }
}
