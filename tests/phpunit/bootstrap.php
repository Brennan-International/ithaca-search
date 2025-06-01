<?php
/**
 * PHPUnit bootstrap file.
 *
 * @file
 * @package Starter_Plugin
 */

/**
 * Our autoloader.
 */
require_once dirname( __DIR__ ) . '../../vendor/autoload.php';

$_tests_dir = getenv( 'WP_TESTS_DIR' );

// Forward custom PHPUnit Polyfills configuration to PHPUnit bootstrap file.
$_phpunit_polyfills_path = getenv( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH' );
if ( false !== $_phpunit_polyfills_path ) {
	define( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH', $_phpunit_polyfills_path );
}

require 'vendor/yoast/phpunit-polyfills/phpunitpolyfills-autoload.php';

// Give access to tests_add_filter() function.
require_once "{$_tests_dir}/includes/functions.php";

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin(): void {
	require dirname( __DIR__ ) . '../../../woocommerce/woocommerce.php';
	require dirname( __DIR__ ) . '../../../advanced-custom-fields/acf.php';
	require dirname( __DIR__ ) . '../../plugin.php';
}

tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );


// Start up the WP testing environment.
require "{$_tests_dir}/includes/bootstrap.php";


$env = parse_ini_file( dirname( __DIR__ ) . '/.env' );

update_option( 'algolia-write-key', $env['ALGOLIA_WRITE_KEY'] );
update_option( 'algolia-application-id', $env['ALGOLIA_APPLICATION_ID'] );

update_option( 'active_plugins', array(
	"commercial-algolia/plugin.php",
	"woocommerce/woocommerce.php",
	'advanced-custom-fields/acf.php',
) );
