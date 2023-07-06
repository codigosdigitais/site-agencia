<?php

class Conteudo extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('model_conteudo');
    }

    # Index - Redireciona para Home (vazio)
    public function index($page=0) {
		redirect(base_url());
	}
  
    # A Agência
    public function aagencia($page=0) {
        $this->_site(array ('view_aagencia'));
    }

    # Marketing Digital
    public function marketingdigital($page=0) {
        $this->_site(array ('view_marketingdigital'));
    }

    # Inbound Marketing
    public function inboundmarketing($page=0) {
        $this->_site(array ('view_inboundmarketing'));
    }
  
    # Desenvolvimento de Sites
    public function desenvolvimentodesites($page=0) {
        $this->_site(array ('view_desenvolvimentodesites'));
    }

    # Desenvolvimento de Sistemas
    public function desenvolvimentodesistemas($page=0) {
        $this->_site(array ('view_desenvolvimentodesistemas'));
    }

    # Desenvolvimento de Aplicativos
    public function desenvolvimentodeaplicativos($page=0) {
        $this->_site(array ('view_desenvolvimentodeaplicativos'));
    }

    # Cases
    public function cases($page=0) {
        $this->_site(array ('view_casesdesucesso'));
    }

    # Porque nos contratar?
    public function porquenoscontratar($page=0) {
        $this->_site(array ('view_porquenoscontratar'));
    }            

    # Atendimento
    public function atendimento($page=0) {
        $this->_site(array ('view_atendimento'));
    }      
}