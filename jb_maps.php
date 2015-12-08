<?php
/*
Plugin Name: JB Google maps
Plugin URI: http://jbprovider.com/
Description: Easy way to show a location by map on your website
Version: 1.1
Author: Jack Bui
Author URI: http://jbprovider.com/
License: GPLv2
Text Domain: jb_provider
*/
/**
 * add all files need in plugins
 *
 * @param void
 * @return void
 * @since 1.0
 * @package JBPLUGIN
 * @category void
 * @author JACK BUI
 */
function jb_require_plugin_file(){
    if( !defined ( 'JB_DOMAIN' ) ){
        define( 'JB_DOMAIN', 'jb_provider' );
    }
    add_action( 'wp_enqueue_scripts', 'jb_plugin_enqueue_scripts' );
}
add_action('after_setup_theme', 'jb_require_plugin_file');
/**
 * Description
 *
 * @param void
 * @return void
 * @since 1.0
 * @package JBPLUGIN
 * @category void
 * @author JACK BUI
 */
function jb_plugin_enqueue_scripts(){
    wp_enqueue_style('jb_plugin_css', plugin_dir_url(__FILE__) . 'css/jb-plugincss.css', array(), '1.0');
    wp_enqueue_script('jb-googlemap-api', '//maps.googleapis.com/maps/api/js?sensor=false&signed_in=false', '3.0', true);
    wp_enqueue_script('gmaps', plugin_dir_url(__FILE__) . 'js/gmaps.min.js', array('jb-googlemap-api'), '1.0', true);
    wp_enqueue_script('marker', plugin_dir_url(__FILE__) . 'js/marker.js', array('gmaps'), '1.0', true);
    wp_enqueue_script('jb_plugin_js', plugin_dir_url(__FILE__) . 'js/jb-pluginjs.js', array(
        'underscore',
        'backbone'),
        '1.0', true);
}