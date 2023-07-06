<?php

class Inicial extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('model_inicial');
    }

    public function index() {
        $this->_site(array('view_inicial'));
    }

    # Leds - Envio
    public function leds(){

        # Dados do formulário
        $area       = $this->input->post('area');
        $name       = $this->input->post('name');
        $city       = $this->input->post('city');
        $message    = $this->input->post('message');
        $emails     = $this->input->post('email');
        $phone      = $this->input->post('phone');
        $formtype   = $this->input->post('form-type');

        # Inicial PHP Mailer
        $this->load->library('php_mailer');
        $email = new PHPMailer();

        # Configurações
        $email->CharSet = 'utf-8';
        $email->SetFrom("dontreply@codigosdigitais.com.br", "Códigos Digitais");
        $email->AddAddress("atendimento@codigosdigitais.com.br", "Códigos Digitais");
        $email->Subject = "Quero falar de negócios | ".strtoupper($name);
        $email->MsgHTML("
            <strong>Quero falar de negócios</strong> - ".$name."<br><br>
            <strong>Area</strong> - ".$area."<br>   
            <strong>Nome</strong> - ".$name."<br>   
            <strong>Cidade</strong> - ".$city."<br>   
            <strong>Telefone</strong> - ".$phone."<br>   
            <strong>E-mail</strong> - ".$emails."<br>   
            <strong>Descrição do negócio</strong> - ".$message."<br>   
            <strong>Formulário</strong> - ".$formtype."<br>   
        ");

        # Enviando e-mail
        $email->send();

        # Retorno de sucesso (rdMailForm)
        echo "MF000";
        
    }

     public function erro() {
        $dados['js'] = array(
            "site/modules/{$this->router->class}/js/erro"
        );
        $dados['css'] = array(
            "site/modules/{$this->router->class}/css/erro"
        );
        $this->load->vars($dados);
        $this->_404('view_404');
    }

    /**
     * Efetua o redimencionamento
     *
     * @param type $nome_imagem
     * @param type $largura
     * @param type $altura
     */

     
    public function imagem($nome_imagem, $largura = NULL, $altura = NULL, $fit = 'outside', $scala = 'any') {
        $this->load->library('WideImage/WideImage');
        $this->wideimage
                ->load("admin/assets/uploads/{$nome_imagem}")
                ->resize($largura, $altura, $fit, $scala)
                ->output('png');
    }


    public function wide_image($nome_imagem, $largura = NULL, $altura = NULL, $fit = 'outside', $scala = 'any') {
        $this->load->library('WideImage/WideImage');
        $this->wideimage
                ->load("admin/assets/uploads/{$nome_imagem}")
                ->resize($largura, $altura, $fit, $scala)
                ->output('png');
    }

    public function wide_image2($nome_imagem, $largura = NULL, $altura = NULL, $fit = 'outside', $scala = 'any') {
        $this->load->library('WideImage/WideImage');
        $this->wideimage
                ->load("admin/assets/uploads/{$nome_imagem}")
                ->resize($largura, $altura, $fit, $scala)
                ->output('png');
    }    

    /**
     * Efetua o redimencionamento com base na altura
     *
     * @param type $nome_imagem
     * @param type $largura
     * @param type $algura
     */
    public function wide_image_altura($nome_imagem, $altura) {
        $this->load->library('WideImage/WideImage');
        $this->wideimage
                ->load("admin/assets/uploads/{$nome_imagem}")
                ->resize(NULL, $altura, 'inside', 'down')
                ->output('png');
    }

    /**
     * Efetua o redimencionamento com base na largura
     *
     * @param type $nome_imagem
     * @param type $largura
     * @param type $algura
     */
    public function wide_image_largura($nome_imagem, $largura) {
        $this->load->library('WideImage/WideImage');
        $this->wideimage
                ->load("admin/assets/uploads/{$nome_imagem}")
                ->resize($largura, NULL, 'outside')
                ->output('png');
    }

    /**
     * Efetua o redimencionamento no modo de preenchimento
     *
     * @param type $nome_imagem
     * @param type $largura
     * @param type $altura
     */
    public function wide_image_fill($nome_imagem, $largura, $altura) {
        $this->load->library('WideImage/WideImage');
        $this->wideimage
                ->load("admin/assets/uploads/{$nome_imagem}")
                ->resize($largura, $altura, 'fill')
                ->output('png');
    }


    public function wide_image_corta($nome_imagem, $largura, $altura)
    {
        $this->load->library('WideImage/WideImage');
        $this->wideimage
                ->load("admin/assets/uploads/{$nome_imagem}")
                ->resize($largura, $altura, 'outside')
                ->resizeCanvas($largura, $altura, 'center', 'center')
                ->output('png');
    }


}