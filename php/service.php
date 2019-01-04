<?php
	require_once('config.php');

	if(!empty($_GET['acao'])){

		//Guardando a ação solicitada
		$acao = $_GET['acao'];


		//Chaveando para qual regra de negocio vou atuar
		switch ($acao) {
			case 'inserir':
				//busca todas as variáveis;
				$n = (isset($_POST['nome']))? $_POST['nome']: '';
				$c = (isset($_POST['cpf']))? $_POST['cpf']: '';
				$l = (isset($_POST['login']))? $_POST['login']: '';
				$s = (isset($_POST['senha']))? $_POST['senha']: '';
				$e = (isset($_POST['email']))? $_POST['email']: '';
				$tel  = (isset($_POST['telefone']))? $_POST['telefone']: '';
				$tu   = (int) (isset($_POST['tipoUsuario']))? $_POST['tipoUsuario']: '';
				$dt   = (isset($_POST['dtnasc']))? $_POST['dtnasc']: '';
				$cond = (isset($_POST['idcond']))? $_POST['idcond']: '';
				$ap   = (isset($_POST['idapto']))? $_POST['idapto']: '';
				//chama a função inserir usuário
				
				insertUser($n, $c, $l, $s, $e, $tu, $tel, $dt, $cond, $ap);
				break;

			case 'inserirpost':

				//busca todas as variáveis;
				$titles = (isset($_POST['title']))? $_POST['title']: '';
				$texts = (isset($_POST['text']))? $_POST['text']: '';
				$idconds = (isset($_POST['idcond']))? $_POST['idcond']: '';
				$idusus = (isset($_POST['idusu']))? $_POST['idusu']: '';
				
				//chama a função inserir usuário
				insertUserpost($titles, $texts, $idconds, $idusus);
				break;
			
			case 'consultaCondominio':
				//$resultado = $pdo->select("SELECT * FROM CONDOMINIO WHERE RAZAOSOCIAL LIKE '$parametro%' ORDER BY RAZAOSOCIAL ASC");
			    echo (getCondominio());
				break;

			case 'consultaAp':
				$cond = (isset($_GET['idcondominio'])) ? $_GET['idcondominio']: '';
			    echo(getApto($cond));   
				break;

			case 'listUser':
				 $cond_2 = (isset($_GET['id_cond2'])) ? $_GET['id_cond2']: '';
				 echo(listaUsuarios($cond_2));
				break;	
			case 'listaSindicos':
				echo (getSindicosVotacao());
				break;

			case 'login':
			//Pegando as variaveis que estao vindo via POST e salvando em variaveis PHP
				$email = $_POST['InputEmail'];
				$senha = $_POST['InputPassword'];
				$senhacode = base64_encode($senha);
				$pdo = conectar();
				$sSQL = "SELECT * FROM  USUARIO WHERE email = '".$email."' AND senha = '".$senhacode."'";
				$stm = $pdo->prepare($sSQL);
				$stm->execute();
				//Checando se executou com sucesso
				if ($stm->fetchColumn() > 0)
				{
					echo "ok";
				}
				else
				{
					echo "erro";
				}
				break;

			case 'deletarUser':
				$idDelete = (isset($_POST['iduserDelete']))? $_POST['iduserDelete']: '';
				deleteUser($idDelete);
				break;

			case "listarpost":
							
				$pdo = conectar();
				$sSQL = "SELECT * FROM POSTAGEM";
				$stm = $pdo->prepare($sSQL);
				$stm->execute();

				$return = array();
					
				while($dados = mysqli_fetch_array($stm)){
					array_push($return, array('id_postagem'=>$dados['id_postagem'],'id_usuario'=>$dados['id_usuario'],'id_condominio'=>$dados['id_condominio'],'titulo'=>$dados['titulo'],'textopost'=>$dados['textopost']));
				}
				http_response_code(200);
				echo json_encode(array('listagem'=>$return));
			
			break;

			default:
				 echo "Serviço não existe";
			break;
		}
	}
	else{

		echo "Sem ação definida!";
	}

	function getSindicosVotacao(){
			$pdo = Conectar();
	        $querysql = "SELECT * FROM USUARIO USU, CONDOMINIO COND WHERE USU.id_condominio = COND.id_condominio AND USU.tipoUsuario = 1";
	        $exe = $pdo->prepare($querysql);
	        $exe->execute();
	        $linha = $exe->fetchAll(PDO::FETCH_ASSOC);
	        $json = json_encode($linha);
	        echo ($json);
	        $pdo = null;
	}

	function deleteUser($idDelete_){
		try{
			$pdo = conectar();
			$deletesql = "DELETE FROM USUARIO WHERE id_usuario = ?";
			$stm = $pdo->prepare($deletesql);
			$stm->bindParam(1, $idDelete_);
			$ok = ($stm->execute());
			if(!$ok){
				print_r($stm->errorInfo());
			}else
			 echo 'ok';
			}
			catch(Exception $e){
	          	echo 'Error'.$e->getMessage();
	        	return null;
	    	}
	}

	function insertUser($nome, $cpf, $login, $senha, $email, $tipoUsuario, $telefone, $dtnasc, $idcond_, $idapto){ 

    	$senhacode = base64_encode($senha);
	    
	    if (empty($nome) || empty($cpf) || empty($senha) || empty($email)):
	          return "falha, campos pendentes";
	      else:
	        try{  
		        $pdo = conectar();
		        $insertsql = "INSERT INTO USUARIO(nome, cpf, login, senha, email, tipoUsuario, telefone, datanasc, id_condominio, id_apartamento) VALUES(?,?,?,?,?,?,?,?,?,?)";
		        $stm = $pdo->prepare($insertsql);
		        $stm->bindParam(1, $nome);
	        	$stm->bindParam(2, $cpf);
	            $stm->bindParam(3, $login);
	            $stm->bindParam(4, $senhacode);
	            $stm->bindParam(5, $email);
	            $stm->bindParam(6, $tipoUsuario);
	            $stm->bindParam(7, $telefone, PDO::PARAM_INT);
	            $stm->bindParam(8, $dtnasc);
	            $stm->bindParam(9, $idcond_);
	            $stm->bindParam(10, $idapto, PDO::PARAM_INT);
	          	$ok = ($stm->execute());
	          	if(!$ok){
	          		print_r($stm->errorInfo());
	          		echo ($valor_id);
	          	}else
	          	echo 'ok';
	        }
	        catch(Exception $e){
	          	echo 'Error'.$e->getMessage();
	        	return null;
	    	}
	    endif;
		$pdo = null;
	}

	function insertUserpost($titles, $texts, $idconds, $idusus)
	{ 

	    if (empty($titles) || empty($texts)):
	          return "falha, campos pendentes";
	      else:
	        try{  
		        $pdo = conectar();
		        $insertsql = "INSERT INTO POSTAGEM (id_usuario, id_condominio, titulo, textopost) VALUES (?,?,?,?)";
		        $stm = $pdo->prepare($insertsql);
		        $stm->bindParam(1, $idusus);
	        	$stm->bindParam(2, $idconds);
	            $stm->bindParam(3, $titles);
	            $stm->bindParam(4, $texts);
	          	$ok = ($stm->execute());
	          	if(!$ok)
	          	{
	          		print_r($stm->errorInfo());
	          		echo ($valor_id);
	          	}
	          	else
	          	echo 'ok';
	        }
	        catch(Exception $e){
	          	echo 'Error'.$e->getMessage();
	        	return null;
	    	}
	    endif;
		$pdo = null;
	}

	function listaUsuarios($condo_id){
			$pdo = Conectar();
	        $querysql = "SELECT * FROM USUARIO USU, CONDOMINIO COND WHERE USU.id_condominio = COND.id_condominio AND USU.id_condominio=?";
	        $exe = $pdo->prepare($querysql);
	        $exe->bindValue(1, $condo_id);
	        $exe->execute();
	        $linha = $exe->fetchAll(PDO::FETCH_ASSOC);
	        $json = json_encode($linha);
	        echo ($json);
	        $pdo = null;
	}	

	function getCondominio(){
	    try{
	        $pdo = Conectar();
	        $querysql = "SELECT razaosocial, id_condominio FROM CONDOMINIO";
	        $exe = $pdo->prepare($querysql);
	        $exe->execute();
	        sleep(1); 
	        $linha = $exe->fetchAll(PDO::FETCH_ASSOC);
	        $json = json_encode($linha);
	        echo ($json);
	      }
	      catch (Exception $e){
	          echo 'Erro: '.$e->getMessage();
	          return null;
	      }
	 
	      $pdo = null;
  	}
 

	function getApto($condominio){
	 	$pdo = Conectar();
      	$querysql = "SELECT id_apartamento, id_bloco FROM CONDOMINIODETALHE WHERE id_condominio = ?";
      	$exe = $pdo->prepare($querysql);
      	$exe->bindValue(1, $condominio);
      	$exe->execute();
      	sleep(1);
      	$linha = $exe->fetchALL(PDO::FETCH_ASSOC);
      	$json = json_encode($linha);
      	echo ($json);
      	$pdo = null;
     }

?>