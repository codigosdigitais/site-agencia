<?php

class MY_Controller extends MX_Controller {

    protected $dados = array();

    public function __construct() {
        parent::__construct();

        $this->load->model('inicial/model_inicial');

        // Configurações de Keywords, descriptions e titles
        $this->dados['title'] = $this->header($this->uri->segment(1), 'title');
        $this->dados['description'] = $this->header($this->uri->segment(1), 'description');
        $this->load->vars($this->dados);

    }

    public function _externo($view){
        $this->load->view($view);
    }

    public function _site($view) {      
        $this->load->view('view_topo');              
        if (is_array($view)) {
            foreach ($view as $valor) {
                $this->load->view($valor);
            }
        } else {
			$this->load->view($view);
        }     
        $this->load->view('view_rodape'); 		
		
    }

    public function _404($view) {
        $this->load->model('inicial/model_inicial');
        $this->load->vars($this->dados);

        $this->load->view('view_topo');
        ;
        if (is_array($view)) {
            foreach ($view as $valor) {
                $this->load->view($valor);
            }
        } else {
            $this->load->view($view);
        }
        $this->load->view('view_rodape');
    }

    public function header($area=null, $setor=null){
        switch($area){
            case null:
                $dados['title'] = "Códigos Digitais – Agência Digital";
                $dados['description'] = "A Códigos Digitais – Agência Digital, nasceu de uma proposta de atender demandas variadas de desenvolvimento de sites, sistemas corporativos, trabalhos em marketing digital, e mídias online.";
            break; 

            default:
                $dados['title'] = "Códigos Digitais – Agência Digital";
                $dados['description'] = "A Códigos Digitais – Agência Digital, nasceu de uma proposta de atender demandas variadas de desenvolvimento de sites, sistemas corporativos, trabalhos em marketing digital, e mídias online.";
            break; 

            case 'a-agencia':
                $dados['title'] = "Códigos Digitais – Uma trajetória de sucesso";
                $dados['description'] = "A Códigos Digitais – Agência Digital, nasceu de uma proposta de atender demandas variadas de desenvolvimento de sites, sistemas corporativos, trabalhos em marketing digital, e mídias online.";
            break;

            case 'marketing-digital':
                $dados['title'] = "Códigos Digitais – Marketing Digital";
                $dados['description'] = "Potencialize os resultados de seu negócio: Em dias de competitividade em alta, é necessário que sua empresa tenha uma agência parceira que assuma toda estrutura de marketing digital, nós, analisamos e executamos o que é realmente relevante para ajudar você a crescer e conquistar seu espaço diante da imensa concorrência, e fazemos toda a gestão de suas redes sociais, campanhas de mídia, Google Ads, e e-mail marketing.";
            break;            

            case 'inbound-marketing':
                $dados['title'] = "Códigos Digitais – Inbound Marketing";
                $dados['description'] = "Atraia clientes em potencial, conheça: Inbound Marketing: O Inbound Marketing é um conjunto de estratégias que têm o objetivo de atrair potenciais clientes e guiá-los até o momento da compra. Afinal, muitas das pessoas que podem se interessar pelo seu produto ou serviço, ainda não sabem que a sua empresa existe, às vezes, sequer imaginam que precisam do que você vende.";
            break;        

            case 'desenvolvimento-de-sites':
                $dados['title'] = "Códigos Digitais – Desenvolvimento de Sites";
                $dados['description'] = "Criar seu site é o primeiro passo para o sucesso: Antigamente você tinha que estar na lista telefônica para existir. Hoje você precisa estar na internet! Quem quer continuar relevante perante ao mercado, tão competitivo – diga-se de passagem, deve marcar presença em meio a tantos www.";
            break;

            case 'desenvolvimento-de-sistemas':
                $dados['title'] = "Códigos Digitais – Desenvolvimento de Sistemas: Front-End e Back-End";
                $dados['description'] = "Desenvolvimento Front-End e Back-End: O desenvolvimento front-end é responsável por dar vida à interface do sistema. Trabalha com a parte da aplicação que interage diretamente com o usuário através do layout e navegação. Por isso, é importante que o desenvolvimento seja sempre focado na experiência do usuário. Trabalhamos com as seguintes tecnologias: HTML, CSS e JavaScript, onde utilizamos as bibliotecas Bootstrap 3 e 4 para o desenvolvimento da interface.";
            break;

            case 'desenvolvimento-app':
                $dados['title'] = "Códigos Digitais – Desenvolvimento de Aplicativos";
                $dados['description'] = "O desenvolvimento de aplicativos para mobile é um dos nichos que mais cresce no mercado de tecnologia. Para muitas empresas, os APPs tornaram-se um diferencial competitivo, uma forma de se destacar dentro de sua área de atuação. Dessa forma, é fundamental contar com um apoio especializado quando o assunto é desenvolvimento de app. Afinal, existem inúmeros detalhes que devem ser minuciosamente pensados para que o seu aplicativo seja um sucesso.";
            break;

            case 'porque-nos-contratar':
                $dados['title'] = "Códigos Digitais – Porque nos contratar?";
                $dados['description'] = "Bons motivos para contratar a Códigos Digitais: Somos uma agência full-service especializada em desenvolvimento de sites, sistemas corporativos, marketing digital utilizando-se de mídias digitais: Instagram, Facebook e Google Ads. Nossa agência dispõe de profissionais especializados em diversas áreas, desta forma, ter vários profissionais para atender diversas necessidades.";
            break;   

            case 'atendimento':
                $dados['title'] = "Códigos Digitais – Atendimento";
                $dados['description'] = "Pronto para fazer sua empresa crescer? Entre em contato conosco e saiba como sua empresa pode crescer ainda mais.";
            break;   





        }

        return $dados[$setor];
    }



}