<?php

/**
 * Create URL Title retirando acentos
 *
 * Takes a "title" string as input and creates a
 * human-friendly URL string with either a dash
 * or an underscore as the word separator.
 *
 * @access	public
 * @param	string	the string
 * @param	string	the separator: dash, or underscore
 * @return	string
 */
if ( ! function_exists('url_title'))
{

    function url_title($str, $separator = 'dash', $lowercase = FALSE)
    {
        if ($separator == 'dash')
        {
            $search = '_';
            $replace = '-';
        }
        else
        {
            $search = '-';
            $replace = '_';
        }

        $trans = array (
            '&\#\d+?;' => '',
            '&\S+?;' => '',
            '\s+' => $replace,
            '[^a-z0-9\-\._]' => '',
            $replace.'+' => $replace,
            $replace.'$' => $replace,
            '^'.$replace => $replace,
            '\.+$' => ''
        );

        $str = retira_acentos(strip_tags($str));

        foreach ($trans as $key => $val)
        {
            $str = preg_replace("#".$key."#i", $val, $str);
        }

        if ($lowercase === TRUE)
        {
            $str = strtolower($str);
        }

        // Retira todos os caracteres que nÃ£o sejam letras, numeros e o -
        $str = preg_replace("[^A-Za-z0-9-]", "", $str);

        return trim(stripslashes(strtolower($str)));
    }

}

/**
 * Retira acentuação de uma string
 *
 * @param type $string
 * @return type
 */
function retira_acentos($string)
{
    $acentos = array
        (
        'A' => '/À|Á|Â|Ã|Ä|Å|Â|À|Á|Ä|Ã/',
        'a' => '/à|á|â|ã|ä|å|á|à|â|ã|ä/',
        'C' => '/Ç|Ç/',
        'c' => '/ç|ç/',
        'E' => '/È|É|Ê|Ë|Ê|È|É|Ë/',
        'e' => '/è|é|ê|ë|é|è|ê|ë/',
        'I' => '/Ì|Í|Î|Ï|Î|Í|Ì|Ï/',
        'i' => '/ì|í|î|ï|î|í|ì|ï/',
        'N' => '/Ñ|Ñ/',
        'n' => '/ñ|ñ/',
        'O' => '/Ò|Ó|Ô|Õ|Ö|Ô|Õ|Ò|Ó|Ö/',
        'o' => '/ò|ó|ô|õ|ö|ó|ò|ô|õ|ö/',
        'U' => '/Ù|Ú|Û|Ü|Û|Ù|Ú|Ü/',
        'u' => '/ù|ú|û|ü|ú|ù|û|ü/',
        'Y' => '/Ý|Ý/',
        'y' => '/ý|ÿ|ý|ÿ/',
        'a.' => '/ª|ª/',
        'o.' => '/º|º/',
        '' => '/\/|,|%|\'|"|#|\(|\)/',
        '' => '/&#39;/'
    );

    return preg_replace($acentos, array_keys($acentos), $string);
}

function formata_data($data){

    $data_explod = explode("-", $data);
    $data_final = $data_explod[2]."/".$data_explod[1]."/".$data_explod[0];
    return $data_final;

}

function searchForId($id, $array) {
   foreach ($array as $key => $val) {
       if ($val['id'] === $id) {
           return $key;
       }
   }
   return null;
}