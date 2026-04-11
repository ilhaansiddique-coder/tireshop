<?php
/**
 * All shortcodes for use in Gutenberg via the Shortcode block.
 *
 * Available shortcodes:
 *   [dc_tyre_search]                         — Search panel
 *   [dc_product_catalog type="tyres"]        — Product grid (tyres|rims|complete-wheels)
 *   [dc_product_detail]                      — Single product page
 *   [dc_booking_form]                        — 3-step booking wizard
 *   [dc_hero title="..." subtitle="..."]     — Hero section
 *   [dc_pricing_table]                       — Deck Hotel pricing
 *   [dc_trust_badges]                        — Trust badges row
 */
class DC_Shortcodes {

    public static function init() {
        add_shortcode('dc_tyre_search', array(__CLASS__, 'tyre_search'));
        add_shortcode('dc_product_catalog', array(__CLASS__, 'product_catalog'));
        add_shortcode('dc_product_detail', array(__CLASS__, 'product_detail'));
        add_shortcode('dc_booking_form', array(__CLASS__, 'booking_form'));
        add_shortcode('dc_hero', array(__CLASS__, 'hero'));
        add_shortcode('dc_pricing_table', array(__CLASS__, 'pricing_table'));
        add_shortcode('dc_trust_badges', array(__CLASS__, 'trust_badges'));
    }

    /* ───────────────────────────────────────────
     * [dc_tyre_search]
     * ─────────────────────────────────────────── */
    public static function tyre_search($atts) {
        $atts = shortcode_atts(array(
            'title'       => 'Find Your Tyre',
            'button_text' => 'Search Tyres',
        ), $atts);

        ob_start();
        ?>
        <div class="dc-search-panel" id="dc-search-panel">
            <div class="dc-search-card">
                <h3 class="dc-search-title"><?php echo esc_html($atts['title']); ?></h3>
                <form id="dc-search-form" class="dc-search-form">
                    <div class="dc-search-grid">
                        <!-- Dimension Input -->
                        <div class="dc-field">
                            <label class="dc-label">DIMENSION OR LICENCE PLATE</label>
                            <input type="text" id="dc-search-query" class="dc-input" placeholder="205/55R16 or ABC123" />
                            <span class="dc-hint">e.g. 205/55R16, 215 55 R17, ABC 123</span>
                        </div>

                        <!-- Season Toggle -->
                        <div class="dc-field">
                            <label class="dc-label">SEASON</label>
                            <div class="dc-season-toggle">
                                <button type="button" class="dc-season-btn active" data-season="2">&#9728;&#65039; Summer</button>
                                <button type="button" class="dc-season-btn" data-season="1">&#10052;&#65039; Winter</button>
                                <button type="button" class="dc-season-btn" data-season="3">&#127780; All Season</button>
                            </div>
                        </div>

                        <!-- Vehicle Type -->
                        <div class="dc-field">
                            <label class="dc-label">VEHICLE TYPE</label>
                            <select id="dc-vehicle-type" class="dc-select">
                                <option value="alla">All Vehicles</option>
                                <option value="1">Passenger Car</option>
                                <option value="2">SUV / 4x4</option>
                                <option value="3">Van / Light Truck</option>
                            </select>
                        </div>
                    </div>

                    <div class="dc-search-actions">
                        <button type="submit" class="dc-btn dc-btn-primary"><?php echo esc_html($atts['button_text']); ?></button>
                    </div>
                </form>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /* ───────────────────────────────────────────
     * [dc_product_catalog type="tyres"]
     * ─────────────────────────────────────────── */
    public static function product_catalog($atts) {
        $atts = shortcode_atts(array(
            'type'  => 'tyres',      // tyres, rims, complete-wheels
            'limit' => '24',
            'title' => '',
        ), $atts);

        $type = sanitize_text_field($atts['type']);
        $limit = intval($atts['limit']);
        $title_map = array(
            'tyres'           => 'All Tyres',
            'rims'            => 'All Rims',
            'complete-wheels' => 'Complete Wheels',
        );
        $title = $atts['title'] ?: ($title_map[$type] ?? 'Products');

        ob_start();
        ?>
        <div class="dc-catalog" id="dc-catalog" data-type="<?php echo esc_attr($type); ?>" data-limit="<?php echo esc_attr($limit); ?>">
            <!-- Header -->
            <div class="dc-catalog-header">
                <div>
                    <h2 class="dc-catalog-title"><?php echo esc_html($title); ?></h2>
                </div>
                <div class="dc-catalog-controls">
                    <select id="dc-sort" class="dc-select dc-select-sm">
                        <option value="">Relevance</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="name_asc">Name A-Z</option>
                    </select>
                    <div class="dc-view-toggle">
                        <button type="button" class="dc-view-btn active" data-view="grid" title="Grid view">&#9638;</button>
                        <button type="button" class="dc-view-btn" data-view="list" title="List view">&#9776;</button>
                    </div>
                </div>
            </div>

            <!-- Filter sidebar + Products grid -->
            <div class="dc-catalog-layout">
                <!-- Filters -->
                <aside class="dc-filters" id="dc-filters">
                    <div class="dc-filter-header">
                        <span class="dc-filter-icon">&#9776;</span>
                        <strong>FILTERS</strong>
                        <button type="button" id="dc-reset-filters" class="dc-btn-link">Reset</button>
                    </div>

                    <!-- Season -->
                    <div class="dc-filter-section" data-open="true">
                        <button type="button" class="dc-filter-toggle">Season <span class="dc-chevron">&#9660;</span></button>
                        <div class="dc-filter-body">
                            <label class="dc-radio-label"><input type="radio" name="dc_filter_season" value="2" checked /> &#9728;&#65039; Summer</label>
                            <label class="dc-radio-label"><input type="radio" name="dc_filter_season" value="1" /> &#10052;&#65039; Winter</label>
                            <label class="dc-radio-label"><input type="radio" name="dc_filter_season" value="3" /> &#127780; All Season</label>
                        </div>
                    </div>

                    <!-- Vehicle Type -->
                    <div class="dc-filter-section" data-open="true">
                        <button type="button" class="dc-filter-toggle">Vehicle Type <span class="dc-chevron">&#9660;</span></button>
                        <div class="dc-filter-body">
                            <select id="dc-filter-vehicle" class="dc-select dc-select-sm">
                                <option value="alla">All Vehicles</option>
                                <option value="1">Passenger Car</option>
                                <option value="2">SUV / 4x4</option>
                                <option value="3">Van / Light Truck</option>
                            </select>
                        </div>
                    </div>

                    <!-- Rim Diameter -->
                    <div class="dc-filter-section" data-open="true">
                        <button type="button" class="dc-filter-toggle">Rim Diameter <span class="dc-chevron">&#9660;</span></button>
                        <div class="dc-filter-body">
                            <div class="dc-chip-group" data-filter="diameter">
                                <?php foreach (array(14,15,16,17,18,19,20,21,22) as $d): ?>
                                <button type="button" class="dc-chip" data-value="<?php echo $d; ?>"><?php echo $d; ?>"</button>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>

                    <!-- Width -->
                    <div class="dc-filter-section" data-open="true">
                        <button type="button" class="dc-filter-toggle">Width (mm) <span class="dc-chevron">&#9660;</span></button>
                        <div class="dc-filter-body">
                            <div class="dc-chip-group" data-filter="width">
                                <?php foreach (array(155,165,175,185,195,205,215,225,235,245,255,265,275,285,295,305,315,325) as $w): ?>
                                <button type="button" class="dc-chip" data-value="<?php echo $w; ?>"><?php echo $w; ?></button>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>

                    <!-- Aspect Ratio -->
                    <div class="dc-filter-section" data-open="false">
                        <button type="button" class="dc-filter-toggle">Aspect Ratio <span class="dc-chevron">&#9660;</span></button>
                        <div class="dc-filter-body" style="display:none;">
                            <div class="dc-chip-group" data-filter="aspectRatio">
                                <?php foreach (array(25,30,35,40,45,50,55,60,65,70,75) as $ar): ?>
                                <button type="button" class="dc-chip" data-value="<?php echo $ar; ?>"><?php echo $ar; ?></button>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>

                    <!-- Speed Rating -->
                    <div class="dc-filter-section" data-open="false">
                        <button type="button" class="dc-filter-toggle">Speed Rating <span class="dc-chevron">&#9660;</span></button>
                        <div class="dc-filter-body" style="display:none;">
                            <div class="dc-chip-group" data-filter="speedIndex">
                                <?php foreach (array('H','V','W','Y','ZR') as $s): ?>
                                <button type="button" class="dc-chip" data-value="<?php echo $s; ?>"><?php echo $s; ?></button>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>

                    <!-- Special Features -->
                    <div class="dc-filter-section" data-open="false">
                        <button type="button" class="dc-filter-toggle">Special Features <span class="dc-chevron">&#9660;</span></button>
                        <div class="dc-filter-body" style="display:none;">
                            <label class="dc-check-label"><input type="checkbox" id="dc-filter-runflat" /> Run-Flat</label>
                            <label class="dc-check-label"><input type="checkbox" id="dc-filter-silence" /> Silent / Acoustic</label>
                            <label class="dc-check-label"><input type="checkbox" id="dc-filter-ev" /> EV Optimised</label>
                        </div>
                    </div>
                </aside>

                <!-- Products Grid -->
                <div class="dc-products-area">
                    <div class="dc-products-grid" id="dc-products-grid">
                        <!-- Products loaded via JS -->
                        <div class="dc-loading">
                            <div class="dc-spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div class="dc-pagination" id="dc-pagination" style="display:none;"></div>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /* ───────────────────────────────────────────
     * [dc_product_detail]
     * ─────────────────────────────────────────── */
    public static function product_detail($atts) {
        ob_start();
        ?>
        <div class="dc-product-detail" id="dc-product-detail">
            <div class="dc-loading">
                <div class="dc-spinner"></div>
                <p>Loading product...</p>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /* ───────────────────────────────────────────
     * [dc_booking_form]
     * ─────────────────────────────────────────── */
    public static function booking_form($atts) {
        ob_start();
        ?>
        <div class="dc-booking" id="dc-booking">
            <!-- Progress Steps -->
            <div class="dc-steps">
                <div class="dc-step active" data-step="1"><span class="dc-step-num">1</span> Service</div>
                <div class="dc-step" data-step="2"><span class="dc-step-num">2</span> Date &amp; Time</div>
                <div class="dc-step" data-step="3"><span class="dc-step-num">3</span> Your Details</div>
            </div>

            <!-- Step 1: Select Service -->
            <div class="dc-booking-step" id="dc-step-1">
                <h3>Select a Service</h3>
                <div class="dc-service-grid">
                    <button type="button" class="dc-service-card" data-service="fitting">
                        <span class="dc-service-icon">&#128297;</span>
                        <div>
                            <strong>Tyre Fitting</strong>
                            <small>30–60 min</small>
                        </div>
                    </button>
                    <button type="button" class="dc-service-card" data-service="alignment">
                        <span class="dc-service-icon">&#9881;&#65039;</span>
                        <div>
                            <strong>Wheel Alignment</strong>
                            <small>45–60 min</small>
                        </div>
                    </button>
                    <button type="button" class="dc-service-card" data-service="rim">
                        <span class="dc-service-icon">&#10024;</span>
                        <div>
                            <strong>Rim Renovation</strong>
                            <small>1–2 days</small>
                        </div>
                    </button>
                    <button type="button" class="dc-service-card" data-service="hotel">
                        <span class="dc-service-icon">&#127976;</span>
                        <div>
                            <strong>Tyre Hotel Storage</strong>
                            <small>Seasonal</small>
                        </div>
                    </button>
                    <button type="button" class="dc-service-card" data-service="inspection">
                        <span class="dc-service-icon">&#128269;</span>
                        <div>
                            <strong>Tyre Inspection</strong>
                            <small>15–20 min</small>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Step 2: Date & Time -->
            <div class="dc-booking-step" id="dc-step-2" style="display:none;">
                <h3>Pick a Date &amp; Time</h3>
                <div class="dc-field">
                    <label class="dc-label">Date</label>
                    <input type="date" id="dc-booking-date" class="dc-input" min="<?php echo date('Y-m-d'); ?>" />
                </div>
                <div class="dc-field">
                    <label class="dc-label">Time</label>
                    <div class="dc-time-grid" id="dc-time-grid">
                        <?php
                        $slots = array('08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30');
                        foreach ($slots as $slot): ?>
                        <button type="button" class="dc-time-btn" data-time="<?php echo $slot; ?>"><?php echo $slot; ?></button>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- Step 3: Your Details -->
            <div class="dc-booking-step" id="dc-step-3" style="display:none;">
                <h3>Your Details</h3>
                <div class="dc-form-grid">
                    <div class="dc-field">
                        <label class="dc-label">Name *</label>
                        <input type="text" id="dc-booking-name" class="dc-input" required />
                    </div>
                    <div class="dc-field">
                        <label class="dc-label">Phone *</label>
                        <input type="tel" id="dc-booking-phone" class="dc-input" required />
                    </div>
                    <div class="dc-field dc-field-full">
                        <label class="dc-label">Email *</label>
                        <input type="email" id="dc-booking-email" class="dc-input" required />
                    </div>
                    <div class="dc-field dc-field-full">
                        <label class="dc-label">Vehicle</label>
                        <input type="text" id="dc-booking-vehicle" class="dc-input" placeholder="e.g. Volvo XC60 2021" />
                    </div>
                    <div class="dc-field dc-field-full">
                        <label class="dc-label">Notes</label>
                        <textarea id="dc-booking-notes" class="dc-textarea" rows="3"></textarea>
                    </div>
                </div>

                <!-- Summary -->
                <div class="dc-booking-summary" id="dc-booking-summary"></div>
            </div>

            <!-- Success State -->
            <div class="dc-booking-step" id="dc-step-success" style="display:none;">
                <div class="dc-success">
                    <div class="dc-success-icon">&#10004;</div>
                    <h2>Appointment Booked!</h2>
                    <p id="dc-booking-confirm-msg"></p>
                    <button type="button" class="dc-btn dc-btn-primary" id="dc-booking-reset">Book Another</button>
                </div>
            </div>

            <!-- Navigation -->
            <div class="dc-booking-nav" id="dc-booking-nav">
                <button type="button" class="dc-btn dc-btn-ghost" id="dc-booking-back" style="display:none;">&#8592; Back</button>
                <button type="button" class="dc-btn dc-btn-primary" id="dc-booking-next" disabled>Next &#8594;</button>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /* ───────────────────────────────────────────
     * [dc_hero title="..." subtitle="..." accent="..." cta_text="..." cta_url="..."]
     * ─────────────────────────────────────────── */
    public static function hero($atts) {
        $atts = shortcode_atts(array(
            'accent'    => "HELSINGBORG'S PREMIUM TYRE SPECIALIST",
            'title'     => 'Drive with Confidence.',
            'highlight' => 'Confidence.',
            'subtitle'  => 'Premium tyres, expert fitting, and unbeatable service — all under one roof in Helsingborg.',
            'cta_text'  => 'Browse Tyres',
            'cta_url'   => '/tyres',
        ), $atts);

        $title_html = str_replace(
            $atts['highlight'],
            '<span class="dc-text-gold">' . esc_html($atts['highlight']) . '</span>',
            esc_html($atts['title'])
        );

        ob_start();
        ?>
        <section class="dc-hero">
            <div class="dc-hero-content">
                <p class="dc-hero-accent"><?php echo esc_html($atts['accent']); ?></p>
                <h1 class="dc-hero-title"><?php echo $title_html; ?></h1>
                <p class="dc-hero-subtitle"><?php echo esc_html($atts['subtitle']); ?></p>
                <?php if ($atts['cta_text']): ?>
                <a href="<?php echo esc_url($atts['cta_url']); ?>" class="dc-btn dc-btn-primary dc-btn-lg"><?php echo esc_html($atts['cta_text']); ?></a>
                <?php endif; ?>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }

    /* ───────────────────────────────────────────
     * [dc_pricing_table]
     * ─────────────────────────────────────────── */
    public static function pricing_table($atts) {
        ob_start();
        ?>
        <section class="dc-pricing">
            <h2 class="dc-section-title">Our Storage Packages</h2>
            <div class="dc-pricing-grid">
                <div class="dc-pricing-card">
                    <h3>Economy</h3>
                    <p class="dc-pricing-desc">Basic seasonal storage for your tyres. Clean, dry, and secure facility.</p>
                    <ul class="dc-pricing-features">
                        <li>&#10003; Seasonal storage</li>
                        <li>&#10003; Clean &amp; dry facility</li>
                        <li>&#10003; Insurance included</li>
                    </ul>
                    <a href="/book-appointment" class="dc-btn dc-btn-outline">Select</a>
                </div>

                <div class="dc-pricing-card dc-pricing-featured">
                    <div class="dc-pricing-badge">Most Popular</div>
                    <h3>Standard</h3>
                    <p class="dc-pricing-desc">Storage plus tyre inspection and pressure check before each season change.</p>
                    <ul class="dc-pricing-features">
                        <li>&#10003; Everything in Economy</li>
                        <li>&#10003; Tyre inspection</li>
                        <li>&#10003; Pressure check</li>
                        <li>&#10003; Tread depth report</li>
                    </ul>
                    <a href="/book-appointment" class="dc-btn dc-btn-primary">Select</a>
                </div>

                <div class="dc-pricing-card">
                    <h3>Luxury</h3>
                    <p class="dc-pricing-desc">Full-service package with wash, inspection, and priority seasonal changeover.</p>
                    <ul class="dc-pricing-features">
                        <li>&#10003; Everything in Standard</li>
                        <li>&#10003; Tyre wash &amp; clean</li>
                        <li>&#10003; Priority changeover</li>
                        <li>&#10003; SMS reminders</li>
                        <li>&#10003; Free pick-up &amp; delivery</li>
                    </ul>
                    <a href="/book-appointment" class="dc-btn dc-btn-outline">Select</a>
                </div>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }

    /* ───────────────────────────────────────────
     * [dc_trust_badges]
     * ─────────────────────────────────────────── */
    public static function trust_badges($atts) {
        ob_start();
        ?>
        <div class="dc-trust-badges">
            <div class="dc-badge-item"><span class="dc-badge-icon">&#10003;</span> Verified Brands</div>
            <div class="dc-badge-item"><span class="dc-badge-icon">&#9889;</span> Fast Delivery</div>
            <div class="dc-badge-item"><span class="dc-badge-icon">&#128295;</span> Expert Fitting</div>
            <div class="dc-badge-item"><span class="dc-badge-icon">&#8634;</span> Easy Returns</div>
        </div>
        <?php
        return ob_get_clean();
    }
}
