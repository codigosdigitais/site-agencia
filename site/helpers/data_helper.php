<?php


function print_rp($var){
	echo "<PRE>";
	print_r($var);
	echo "</PRE>";
}

function format_data($data){

    $data_explod = explode("-", $data);
    $data_final = $data_explod[2]."/".$data_explod[1]."/".$data_explod[0];
    return $data_final;

}

function data_banco($data){

    $data_explod = explode("/", $data);
    $data_final = $data_explod[2]."-".$data_explod[1]."-".$data_explod[0];
    return $data_final;

}

function format_hora($hora){

    $data_explod = explode(":", $hora);
    $data_final = $data_explod[0].":".$data_explod[1]."hs";
    return $data_final;

}

function data_blog($data, $sigla_messes = array() ){

    $data_explod = explode(" ", $data);
    $data_ex = explode("-", $data_explod[0]);
    $data_final = $data_ex[2]." ".$sigla_messes[$data_ex[1]].", ".$data_ex[0];
    return $data_final;

}
function data_blog2($data){

    setlocale( LC_ALL, "pt_BR");
    $data_final = date("d M, Y", strtotime($data));
    return $data_final;

}

/**
* Metodo que configura numero de registro por pagina
*/
function numRegister4PagePaginate()
{
   return 10;
}
/**
* Metodo que cria link de paginacao
*/
function createPaginate( $_modulo, $_total )
{
   $ci = &get_instance();
   $ci->load->library('pagination');
   $config['base_url']    = base_url($_modulo);
   $config['total_rows']  = $_total;
   $config['per_page']    = numRegister4PagePaginate();
   $config["uri_segment"] = 3;
   $config['first_link']  = 'Primeiro';
   $config['last_link']   = 'Último';
   $config['next_link']   = 'Próximo';
   $config['prev_link']   = 'Anterior';
   $ci->pagination->initialize($config);
   return $ci->pagination->create_links();
}
function createPaginateAutor( $_modulo, $_total )
{
   $ci = &get_instance();
   $ci->load->library('pagination');
   $config['base_url']    = base_url($_modulo);
   $config['total_rows']  = $_total;
   $config['per_page']    = numRegister4PagePaginate();
   $config["uri_segment"] = 4;
   $config['first_link']  = 'Primeiro';
   $config['last_link']   = 'Último';
   $config['next_link']   = 'Próximo';
   $config['prev_link']   = 'Anterior';
   $ci->pagination->initialize($config);
   return $ci->pagination->create_links();
}

function formataData ($data_post){
    $data = explode("/", $data_post);
    $data_final = $data[2].$data[1].$data[0];
    return $data_final;
}