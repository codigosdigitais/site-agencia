<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
| -------------------------------------------------------------------
| DATABASE CONNECTIVITY SETTINGS
| -------------------------------------------------------------------
| This file will contain the settings needed to access your database.
|
| For complete instructions please consult the 'Database Connection'
| page of the User Guide.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
|	['hostname'] The hostname of your database server.
|	['username'] The username used to connect to the database
|	['password'] The password used to connect to the database
|	['database'] The name of the database you want to connect to
|	['dbdriver'] The database type. ie: mysql.  Currently supported:
				 mysql, mysqli, postgre, odbc, mssql, sqlite, oci8
|	['dbprefix'] You can add an optional prefix, which will be added
|				 to the table name when using the  Active Record class
|	['pconnect'] TRUE/FALSE - Whether to use a persistent connection
|	['db_debug'] TRUE/FALSE - Whether database errors should be displayed.
|	['cache_on'] TRUE/FALSE - Enables/disables query caching
|	['cachedir'] The path to the folder where cache files should be stored
|	['char_set'] The character set used in communicating with the database
|	['dbcollat'] The character collation used in communicating with the database
|				 NOTE: For MySQL and MySQLi databases, this setting is only used
| 				 as a backup if your server is running PHP < 5.2.3 or MySQL < 5.0.7
|				 (and in table creation queries made with DB Forge).
| 				 There is an incompatibility in PHP with mysql_real_escape_string() which
| 				 can make your site vulnerable to SQL injection if you are using a
| 				 multi-byte character set and are running versions lower than these.
| 				 Sites using Latin-1 or UTF-8 database character set and collation are unaffected.
|	['swap_pre'] A default table prefix that should be swapped with the dbprefix
|	['autoinit'] Whether or not to automatically initialize the database.
|	['stricton'] TRUE/FALSE - forces 'Strict Mode' connections
|							- good for ensuring strict SQL while developing
|
| The $active_group variable lets you choose which connection group to
| make active.  By default there is only one group (the 'default' group).
|
| The $active_record variables lets you determine whether or not to load
| the active record class
*/

//$active_record = FALSE;
$active_group = $_SERVER['HTTP_HOST'] == 'server02:8081' ? 'localhost' : 'default';

$ip=ip2long($_SERVER['SERVER_ADDR']);
$ipHigh=ip2long('192.168.25.255');
$ipLow=ip2long('192.168.25.0');
$local = array('127.0.0.1','::1');
if(($ip <= $ipHigh && $ipLow <= $ip) ||  in_array($_SERVER['SERVER_ADDR'], $local)){
	$active_group = 'localhost';
}else{
	$active_group = 'default';
}
//$active_group = 'default';


//echo $active_group;

$db['default']['hostname'] = 'localhost';
$db['default']['username'] = 'codigosd_site';
$db['default']['password'] = 'm$pJbcRdeg!1';
$db['default']['database'] = 'codigosd_site';
$db['default']['dbdriver'] = 'mysqli';
$db['default']['dbprefix'] = '';
$db['default']['pconnect'] = TRUE;
$db['default']['db_debug'] = TRUE;
$db['default']['cache_on'] = FALSE;
$db['default']['cachedir'] = '';
$db['default']['char_set'] = 'utf8';
$db['default']['dbcollat'] = 'utf8_general_ci';
$db['default']['swap_pre'] = '';
$db['default']['autoinit'] = TRUE;
$db['default']['stricton'] = FALSE;


$db['localhost']['hostname'] = 'localhost';
$db['localhost']['username'] = 'root';
$db['localhost']['password'] = '';
$db['localhost']['database'] = 'marmoraria';
$db['localhost']['dbdriver'] = 'mysqli';
$db['localhost']['dbprefix'] = '';
$db['localhost']['pconnect'] = TRUE;
$db['localhost']['db_debug'] = FALSE;
$db['localhost']['cache_on'] = FALSE;
$db['localhost']['cachedir'] = '';
$db['localhost']['char_set'] = 'utf8';
$db['localhost']['dbcollat'] = 'utf8_general_ci';
$db['localhost']['swap_pre'] = '';
$db['localhost']['autoinit'] = TRUE;
$db['localhost']['stricton'] = FALSE;



/*

  echo '<pre>';
  print_r($db['default']);
  echo '</pre>';

  echo 'Connecting to database: ' .$db['default']['database'];
  $dbh=mysql_connect
  (
    $db['default']['hostname'],
    $db['default']['username'],
    $db['default']['password'])
    or die('Cannot connect to the database because: ' . mysql_error());
    mysql_select_db ($db['default']['database']);

    echo '<br />   Connected OK:'  ;
    die( 'file: ' .__FILE__ . ' Line: ' .__LINE__); 
*/
/* End of file database.php */

/* Location: ./application/config/database.php */