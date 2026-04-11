<?php
/**
 * EonTyre API client — handles all communication with EonTyre endpoints.
 * API key is stored server-side, never exposed to the browser.
 */
class DC_API {

    const TIRE_API_BASE = 'https://p511.eontyre.com/api/webshop/products';
    const COMPLETE_WHEELS_API_BASE = 'https://p511.eontyre.com/api/v2/products/export/complete-wheels';
    const ORDER_API_BASE = 'https://p511.eontyre.com/api/v2/orders';

    public static function init() {
        // Nothing to hook — this is a utility class called by other classes.
    }

    /**
     * Fetch products (tyres/rims) from EonTyre.
     */
    public static function fetch_products($args = array()) {
        $api_key = DC_Settings::get_api_key();
        if (empty($api_key)) {
            return new WP_Error('no_api_key', 'EonTyre API key not configured.');
        }

        $defaults = array(
            'page'               => 1,
            'limit'              => 24,
            'typeId'             => '1',
            'tyreType'           => '2',
            'vehicleType'        => 'alla',
            'searchMode'         => '4',
            'showNoimageRims'    => '1',
            'showNoimageTyres'   => '1',
            'minQuantityInStock' => '4',
            'minimumTestScore'   => '0',
            'loadIndex'          => '0',
            'loadIndexRear'      => '0',
            'isElectricVehicle'  => 'false',
            'isEnforced'         => 'false',
            'isMCVehicleType'    => 'false',
            'isRunflat'          => 'false',
            'isSilence'          => 'false',
            'isStaggeredFitment' => 'false',
            'query'              => '',
            'diameter'           => '',
            'width'              => '',
            'aspectRatio'        => '',
            'speedIndex'         => '',
        );

        $args = wp_parse_args($args, $defaults);
        $webshop_id = DC_Settings::get_webshop_id();
        $location_id = DC_Settings::get_location_id();

        $params = array(
            'webshopId'          => $webshop_id,
            'version'            => '2',
            'typeId'             => $args['typeId'],
            'tyreType'           => $args['tyreType'],
            'vehicleType'        => $args['vehicleType'],
            'searchMode'         => $args['searchMode'],
            'showNoimageRims'    => $args['showNoimageRims'],
            'showNoimageTyres'   => $args['showNoimageTyres'],
            'limit'              => $args['limit'],
            'page'               => $args['page'],
            'minQuantityInStock' => $args['minQuantityInStock'],
            'minimumTestScore'   => $args['minimumTestScore'],
            'loadIndex'          => $args['loadIndex'],
            'loadIndexRear'      => $args['loadIndexRear'],
            'isElectricVehicle'  => $args['isElectricVehicle'],
            'isEnforced'         => $args['isEnforced'],
            'isMCVehicleType'    => $args['isMCVehicleType'],
            'isRunflat'          => $args['isRunflat'],
            'isSilence'          => $args['isSilence'],
            'isStaggeredFitment' => $args['isStaggeredFitment'],
            'includeLocations[]' => $location_id,
        );

        // Optional filters
        foreach (array('query', 'diameter', 'width', 'aspectRatio', 'speedIndex') as $key) {
            if (!empty($args[$key])) {
                $params[$key] = $args[$key];
            }
        }

        $url = self::TIRE_API_BASE . '?' . http_build_query($params);

        $response = wp_remote_get($url, array(
            'timeout' => 15,
            'headers' => array(
                'Accept'     => 'application/json',
                'User-Agent' => 'TireStore/1.0',
                'api-key'    => $api_key,
            ),
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);

        if ($code !== 200) {
            return new WP_Error('api_error', 'EonTyre API returned ' . $code, $body);
        }

        return $body;
    }

    /**
     * Fetch a single product by ID.
     */
    public static function fetch_product($id) {
        $api_key = DC_Settings::get_api_key();
        if (empty($api_key)) {
            return new WP_Error('no_api_key', 'EonTyre API key not configured.');
        }

        $webshop_id = DC_Settings::get_webshop_id();
        $url = self::TIRE_API_BASE . '/' . intval($id) . '?webshopId=' . $webshop_id . '&version=2';

        $response = wp_remote_get($url, array(
            'timeout' => 15,
            'headers' => array(
                'Accept'     => 'application/json',
                'User-Agent' => 'TireStore/1.0',
                'api-key'    => $api_key,
            ),
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        return $body;
    }

    /**
     * Fetch complete wheels.
     */
    public static function fetch_complete_wheels($args = array()) {
        $api_key = DC_Settings::get_api_key();
        if (empty($api_key)) {
            return new WP_Error('no_api_key', 'EonTyre API key not configured.');
        }

        $page = isset($args['page']) ? max(1, intval($args['page'])) : 1;
        $limit = isset($args['limit']) ? max(1, intval($args['limit'])) : 24;
        $query = isset($args['query']) ? sanitize_text_field($args['query']) : '';
        $webshop_id = DC_Settings::get_webshop_id();

        $params = array(
            'webshop_id'         => $webshop_id,
            'minQuantityInStock' => '1',
        );

        $url = self::COMPLETE_WHEELS_API_BASE . '?' . http_build_query($params);

        $response = wp_remote_get($url, array(
            'timeout' => 25,
            'headers' => array(
                'Accept'     => 'application/json',
                'User-Agent' => 'TireStore/1.0',
                'Api-Key'    => $api_key,
                'api-key'    => $api_key,
            ),
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        $source = isset($body['data']) && is_array($body['data']) ? $body['data'] : array();

        // Client-side text search (same as Express backend)
        if (!empty($query)) {
            $q = strtolower($query);
            $source = array_filter($source, function ($item) use ($q) {
                $fields = array(
                    'description', 'supplier_description', 'tyre_brand_name',
                    'tyre_model_name', 'rim_brand_name', 'rim_model_name',
                    'product_type_name', 'vehicle_type_name', 'rim_type_name',
                    'supplier_name', 'location_name', 'supplier_product_id',
                    'product_id', 'ean',
                );
                foreach ($fields as $f) {
                    if (isset($item[$f]) && stripos(strval($item[$f]), $q) !== false) {
                        return true;
                    }
                }
                return false;
            });
            $source = array_values($source);
        }

        $count = count($source);
        $start = ($page - 1) * $limit;
        $items = array_slice($source, $start, $limit);

        // Normalize each item
        $products = array_map(array(__CLASS__, 'normalize_complete_wheel'), $items);

        return array(
            'err'   => null,
            'count' => $count,
            'page'  => $page,
            'limit' => $limit,
            'data'  => array('products' => $products),
        );
    }

    /**
     * Normalize a complete wheel item (port of JS normaliseCompleteWheel).
     */
    private static function normalize_complete_wheel($item) {
        $product_id  = isset($item['product_id']) ? intval($item['product_id']) : 0;
        $location_id = isset($item['location_id']) ? intval($item['location_id']) : 0;
        $supplier_id = isset($item['supplier_id']) ? intval($item['supplier_id']) : 0;

        $composite_id = $product_id . ':' . $location_id . ':' . $supplier_id;

        $images = array();
        if (isset($item['images']) && is_array($item['images'])) {
            foreach ($item['images'] as $img) {
                if (!empty($img['image_id']) && !empty($img['filetype'])) {
                    $url = 'https://api.eontyre.com/images/' . $img['image_id'] . '/big.' . $img['filetype'];
                    $images[] = array_merge($img, array('url' => $url));
                }
            }
        }

        $tyre_brand = isset($item['tyre_brand_name']) ? $item['tyre_brand_name'] : '';
        $rim_brand  = isset($item['rim_brand_name']) ? $item['rim_brand_name'] : '';
        $title = isset($item['description']) ? $item['description'] : '';
        if (empty($title)) {
            $title = implode(' ', array_filter(array(
                $tyre_brand,
                isset($item['tyre_model_name']) ? $item['tyre_model_name'] : '',
                $rim_brand,
                isset($item['rim_model_name']) ? $item['rim_model_name'] : '',
            )));
        }

        return array_merge($item, array(
            'id'              => $composite_id,
            'productId'       => $product_id ?: null,
            'orderProductId'  => $product_id ?: null,
            'orderSupplierId' => $supplier_id ?: null,
            'orderLocationId' => $location_id ?: null,
            'name'            => $title ?: 'Complete wheel',
            'brand'           => $rim_brand ?: $tyre_brand ?: (isset($item['product_type_name']) ? $item['product_type_name'] : 'Complete wheel'),
            'stock'           => isset($item['stock']) ? intval($item['stock']) : 0,
            'price'           => isset($item['price']) ? floatval($item['price']) : null,
            'width'           => isset($item['width']) ? $item['width'] : null,
            'aspectRatio'     => isset($item['aspect_ratio']) ? $item['aspect_ratio'] : null,
            'diameter'        => isset($item['diameter']) ? $item['diameter'] : null,
            'images'          => $images,
            'imageUrl'        => !empty($images) ? $images[0]['url'] : null,
        ));
    }

    /**
     * Create an order via EonTyre API.
     */
    public static function create_order($payload) {
        $api_key = DC_Settings::get_api_key();
        if (empty($api_key)) {
            return new WP_Error('no_api_key', 'EonTyre API key not configured.');
        }

        $webshop_id = DC_Settings::get_webshop_id();
        if (!isset($payload['webshop_id'])) {
            $payload['webshop_id'] = intval($webshop_id);
        }

        $response = wp_remote_post(self::ORDER_API_BASE, array(
            'timeout' => 20,
            'headers' => array(
                'Accept'       => 'application/json',
                'Content-Type' => 'application/json',
                'User-Agent'   => 'TireStore/1.0',
                'Api-Key'      => $api_key,
                'api-key'      => $api_key,
            ),
            'body' => wp_json_encode($payload),
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        return $body;
    }

    /**
     * Get product image URL with fallbacks.
     */
    public static function get_product_image_url($product) {
        $checks = array(
            $product['imageUrl'] ?? null,
            $product['image']['webshop_thumb'] ?? null,
            $product['image']['thumbnail'] ?? null,
            $product['image']['original'] ?? null,
            $product['images'][0]['url'] ?? null,
            $product['images'][0]['webshop_thumb'] ?? null,
            $product['images'][0]['thumbnail'] ?? null,
            $product['images'][0]['original'] ?? null,
            $product['brandImageUrl'] ?? null,
        );
        foreach ($checks as $url) {
            if (!empty($url)) return $url;
        }
        return '';
    }

    /**
     * Format price in SEK.
     */
    public static function format_price($price, $incl_vat = false) {
        if ($price === null || $price === '') return '—';
        $p = floatval($price);
        if ($incl_vat) $p *= 1.25;
        return number_format($p, 0, ',', ' ') . ' kr';
    }

    /**
     * Season label helper.
     */
    public static function season_label($type) {
        $map = array('1' => 'Winter', '2' => 'Summer', '3' => 'All Season');
        return $map[strval($type)] ?? '';
    }

    /**
     * Season CSS class helper.
     */
    public static function season_class($type) {
        $map = array('1' => 'dc-badge-winter', '2' => 'dc-badge-summer', '3' => 'dc-badge-allseason');
        return $map[strval($type)] ?? '';
    }
}
