<?php
/**
 * Dackcentrum Child Theme Functions
 */

// Enqueue parent + child styles
add_action('wp_enqueue_scripts', function () {
    // Parent theme style
    wp_enqueue_style(
        'twentytwentyfive-style',
        get_template_directory_uri() . '/style.css'
    );

    // Child theme style
    wp_enqueue_style(
        'dackcentrum-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array('twentytwentyfive-style'),
        wp_get_theme()->get('Version')
    );

    // Custom brand CSS
    wp_enqueue_style(
        'dackcentrum-brand',
        get_stylesheet_directory_uri() . '/assets/css/brand.css',
        array('dackcentrum-child-style'),
        wp_get_theme()->get('Version')
    );

    // Dark/light mode toggle script
    wp_enqueue_script(
        'dackcentrum-theme-toggle',
        get_stylesheet_directory_uri() . '/assets/js/theme-toggle.js',
        array(),
        wp_get_theme()->get('Version'),
        true
    );
});

// Inject dark mode script in <head> to prevent flash of wrong theme
add_action('wp_head', function () {
    ?>
    <script>
    (function(){
        try {
            var t = localStorage.getItem('dc-theme') || 'dark';
            document.documentElement.setAttribute('data-theme', t);
        } catch(e){}
    })();
    </script>
    <?php
}, 1);

// Add theme support
add_action('after_setup_theme', function () {
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    add_theme_support('editor-styles');
    add_editor_style('assets/css/brand.css');
});

// Add custom body classes for theme mode
add_filter('body_class', function ($classes) {
    $classes[] = 'dc-dark-mode';
    return $classes;
});
