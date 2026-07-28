<?php
/**
 * Plugin Name: ACE Contact Endpoint
 * Description: Custom REST endpoints for ACE Services contact form submissions
 * Version: 1.1
 */

if (!defined('ABSPATH')) exit;

define('ACE_CONTACTS_TOKEN', 'theaceservices@3332');
define('ACE_CONTACTS_CACHE_KEY', 'ace_contacts_list');
define('ACE_CONTACTS_POST_TYPE', 'ace_contact');

register_activation_hook(__FILE__, 'ace_contact_activate');
function ace_contact_activate() {
    ace_register_post_type();
    delete_transient(ACE_CONTACTS_CACHE_KEY);
    flush_rewrite_rules();
}

add_action('init', 'ace_register_post_type');
function ace_register_post_type() {
    register_post_type(ACE_CONTACTS_POST_TYPE, [
        'labels'      => ['name' => 'Contacts', 'singular_name' => 'Contact'],
        'public'      => false,
        'show_ui'     => true,
        'show_in_menu' => true,
        'capabilities' => ['create_posts' => 'do_not_allow'],
        'map_meta_cap' => true,
        'supports'    => ['title', 'custom-fields'],
    ]);
}

add_action('rest_api_init', 'ace_register_routes');
function ace_register_routes() {
    register_rest_route('ace/v1', '/contact', [
        'methods'  => 'POST',
        'callback' => 'ace_handle_contact',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('ace/v1', '/contacts', [
        'methods'  => 'GET',
        'callback' => 'ace_get_contacts',
        'permission_callback' => 'ace_verify_token',
    ]);
}

function ace_verify_token() {
    $token = isset($_GET['token']) ? sanitize_text_field($_GET['token']) : '';
    return $token === ACE_CONTACTS_TOKEN;
}

function ace_handle_contact(WP_REST_Request $request) {
    $name        = sanitize_text_field($request->get_param('name'));
    $email       = sanitize_email($request->get_param('email'));
    $phone       = sanitize_text_field($request->get_param('phone'));
    $projectType = sanitize_text_field($request->get_param('projectType'));
    $scale       = sanitize_text_field($request->get_param('scale'));
    $details     = sanitize_textarea_field($request->get_param('details'));

    if (empty($name) || empty($email)) {
        return new WP_Error('missing_fields', 'Name and email are required.', ['status' => 400]);
    }

    $attachment_id = 0;
    if (!empty($_FILES['file']['name'])) {
        $file = $_FILES['file'];
        $allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'application/acad', 'application/x-zip-compressed', 'application/zip'];
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $allowed_ext = ['pdf', 'png', 'jpg', 'jpeg', 'tiff', 'tif', 'dwg', 'zip'];

        if (!in_array(strtolower($ext), $allowed_ext)) {
            return new WP_Error('invalid_file', 'File type not allowed.', ['status' => 400]);
        }

        $upload = wp_handle_upload($file, ['test_form' => false]);
        if (isset($upload['error'])) {
            return new WP_Error('upload_failed', $upload['error'], ['status' => 500]);
        }

        $attachment = [
            'post_title'     => $file['name'],
            'post_mime_type' => $upload['type'],
            'guid'           => $upload['url'],
        ];
        $attachment_id = wp_insert_attachment($attachment, $upload['file']);
        require_once ABSPATH . 'wp-admin/includes/image.php';
        wp_update_attachment_metadata($attachment_id, wp_generate_attachment_metadata($attachment_id, $upload['file']));
    }

    $file_url = $attachment_id ? wp_get_attachment_url($attachment_id) : '';

    $post_id = wp_insert_post([
        'post_type'   => ACE_CONTACTS_POST_TYPE,
        'post_status' => 'private',
        'post_title'  => sprintf('Contact from %s — %s', $name, $email),
        'meta_input'  => [
            'ace_name'        => $name,
            'ace_email'       => $email,
            'ace_phone'       => $phone,
            'ace_project_type'=> $projectType,
            'ace_scale'       => $scale,
            'ace_details'     => $details,
            'ace_file_url'    => $file_url,
        ],
    ]);

    if (!$post_id || is_wp_error($post_id)) {
        $msg = is_wp_error($post_id) ? $post_id->get_error_message() : 'Unknown error';
        return new WP_Error('insert_failed', $msg, ['status' => 500]);
    }

    // Clear cached contacts list so GET /contacts returns fresh data
    delete_transient(ACE_CONTACTS_CACHE_KEY);

    // Notify admin
    $to = get_option('admin_email');
    $subject = sprintf('[ACE Services] New contact from %s', $name);
    $message = "Name: $name\nEmail: $email\nPhone: $phone\n";
    $message .= "Project: $projectType\nScale: $scale\nDetails: $details\n";
    if ($file_url) $message .= "File: $file_url\n";
    wp_mail($to, $subject, $message);

    return new WP_REST_Response(['status' => 'ok', 'id' => $post_id], 201);
}

function ace_get_contacts() {
    nocache_headers();

    $cached = get_transient(ACE_CONTACTS_CACHE_KEY);
    if ($cached !== false) {
        return new WP_REST_Response($cached, 200);
    }

    $posts = get_posts([
        'post_type'      => ACE_CONTACTS_POST_TYPE,
        'post_status'    => 'private',
        'posts_per_page' => -1,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ]);

    $contacts = [];
    foreach ($posts as $post) {
        $contacts[] = [
            'id'          => $post->ID,
            'name'        => get_post_meta($post->ID, 'ace_name', true),
            'email'       => get_post_meta($post->ID, 'ace_email', true),
            'projectType' => get_post_meta($post->ID, 'ace_project_type', true),
            'scale'       => get_post_meta($post->ID, 'ace_scale', true),
            'fileUrl'     => get_post_meta($post->ID, 'ace_file_url', true),
            'date'        => $post->post_date,
        ];
    }

    set_transient(ACE_CONTACTS_CACHE_KEY, $contacts, HOUR_IN_SECONDS);

    return new WP_REST_Response($contacts, 200);
}
