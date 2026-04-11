<?php
/**
 * Booking system — stores appointments as a custom post type
 * and sends email notifications.
 */
class DC_Booking {

    const POST_TYPE = 'dc_booking';

    public static function init() {
        add_action('init', array(__CLASS__, 'register_post_type'));
    }

    public static function register_post_type() {
        register_post_type(self::POST_TYPE, array(
            'labels' => array(
                'name'          => 'Bookings',
                'singular_name' => 'Booking',
                'menu_name'     => 'Bookings',
                'all_items'     => 'All Bookings',
                'add_new_item'  => 'Add New Booking',
            ),
            'public'       => false,
            'show_ui'      => true,
            'show_in_menu' => 'dackcentrum',
            'supports'     => array('title', 'custom-fields'),
            'capability_type' => 'post',
        ));
    }

    /**
     * Create a booking and send notification emails.
     */
    public static function create_booking($data) {
        $services_map = array(
            'fitting'    => 'Tyre Fitting',
            'alignment'  => 'Wheel Alignment',
            'rim'        => 'Rim Renovation',
            'hotel'      => 'Tyre Hotel Storage',
            'inspection' => 'Tyre Inspection',
        );

        $service_label = $services_map[$data['service']] ?? $data['service'];

        $post_id = wp_insert_post(array(
            'post_type'   => self::POST_TYPE,
            'post_title'  => $data['name'] . ' — ' . $service_label . ' — ' . $data['date'],
            'post_status' => 'publish',
            'meta_input'  => array(
                '_dc_service' => $data['service'],
                '_dc_date'    => $data['date'],
                '_dc_time'    => $data['time'],
                '_dc_name'    => $data['name'],
                '_dc_email'   => $data['email'],
                '_dc_phone'   => $data['phone'],
                '_dc_vehicle' => $data['vehicle'],
                '_dc_notes'   => $data['notes'],
            ),
        ));

        if (is_wp_error($post_id)) {
            return $post_id;
        }

        // Send confirmation email to customer
        $subject = 'Booking Confirmation — ' . $service_label . ' at Däckcentrum';
        $message = "Hi {$data['name']},\n\n";
        $message .= "Your appointment has been confirmed:\n\n";
        $message .= "Service: {$service_label}\n";
        $message .= "Date: {$data['date']}\n";
        $message .= "Time: {$data['time']}\n";
        if (!empty($data['vehicle'])) {
            $message .= "Vehicle: {$data['vehicle']}\n";
        }
        $message .= "\nLocation: Däckcentrum, Helsingborg\n";
        $message .= "\nIf you need to reschedule, please contact us.\n";
        $message .= "\nBest regards,\nDäckcentrum";

        wp_mail($data['email'], $subject, $message);

        // Notify admin
        $admin_email = get_option('admin_email');
        $admin_subject = 'New Booking: ' . $service_label . ' — ' . $data['name'];
        $admin_message = "New booking received:\n\n";
        $admin_message .= "Name: {$data['name']}\n";
        $admin_message .= "Email: {$data['email']}\n";
        $admin_message .= "Phone: {$data['phone']}\n";
        $admin_message .= "Service: {$service_label}\n";
        $admin_message .= "Date: {$data['date']}\n";
        $admin_message .= "Time: {$data['time']}\n";
        $admin_message .= "Vehicle: {$data['vehicle']}\n";
        $admin_message .= "Notes: {$data['notes']}\n";

        wp_mail($admin_email, $admin_subject, $admin_message);

        return $post_id;
    }
}
