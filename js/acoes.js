//javaScript Document

$(document).ready(function(){

     $("#listUsers").click(function(){       
        $("#lowbody").load("Usuarios-min.html", function(){});
        });

     //esconde botao alerta
     $("#alertOK").css('display', 'none');
     
     //Agora carrega os dados do apartamento selecionado
     $("#getCondominio").on("change", function(event){
        var id_cond = $("#getCondominio").val();
        $.getJSON('/php/service.php?acao=consultaAp&idcondominio='+id_cond, function (data){
            preencheSelectAp(data);
         });
            
        $.getJSON('/php/service.php?acao=listUser&id_cond2='+id_cond, function (data){
            preencheSelectuser(data);
        });
     });

     $("#btnescolher").on("click", function(event){
        var idusuVotado = $("#votaSindico").val();
     });


    $("#btncadastrarpost").on("click", function(event){
        var titlepost = $("#titulopostagem").val();
        var textpost = $("#comment").val();
        var idcondpost = $("#getCondominio").val();
        var idapusupost = $("#getUsuariopost").val();

        cadastrarpost(titlepost,textpost, idcondpost, idapusupost);
    });

    $("#btncadastrar").on("click", function(event){
        var nomeusu = $("#fullname").val();
        var cpfusu = $("#personid").val();
        var loginusu = $("#userLogin").val();
        var senhausu = $("#userPass").val();
        var emailusu = $("#userEmail").val();
        var telefoneusu = $("#userTel").val();
        var tipusu = $("#ESindicos").val();
        var dtnascusu = $("#dateborn").val();
        var idcond = $("#getCondominio").val();
        var idapusu = $("#getApartamento").val();
     
        cadastrar(nomeusu, cpfusu, loginusu, senhausu, emailusu, telefoneusu, tipusu, dtnascusu, idcond, idapusu);
    });

     //Ações quando abrir o menu lateral
     $("#openNav").on("click", function(event) {
         document.getElementById("mySidenav").style.width = "250px";
         document.getElementById("main").style.marginLeft = "250px";
         document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
         document.getElementById("fullbody").style.backgroundColor = "rgba(0,0,0,0.4)";
         document.getElementById("lowbody").style.backgroundColor = "rgba(0,0,0,0.4)";

        $("#addUser").click(function(){
            $("#lowbody").load("CadastroUsuario-min.html", function(event){
                 closeNav();

                 $("#alerta").css("display", "none"); 
                 $("#userPass2").change(function(event){
                    var passVal = $("#userPass2").val()
                    var pass = $("#userPass").val()
                    passAtivo(pass, passVal);
                 });
            });

             //carrega  os dados dos condominios depois do load
            $.getJSON('/php/service.php?acao=consultaCondominio', function(data){
                    preencheSelectCondminio(data);
            });
         
        });

        $("#newOrder").click(function(){
            $("#lowbody").load("CadastrarContaPagar-min.html");
            closeNav();
         });

        $("#postMsg").click(function(){
             $("#lowbody").load("CadastrarPostagens-min.html");
             closeNav();
            $.getJSON('/php/service.php?acao=consultaCondominio', function(data){
                    preencheSelectCondminio(data);
            });
        });

         $("#posts").click(function(){
             $("#lowbody").load("Postagens-min.html");
             closeNav();
        });

        $("#users").click(function(){
             $("#lowbody").load("Usuarios-min.html", function(event){
               closeNav();
                $.getJSON("http://webpuc.gigaup.com.br/php/service.php?acao=listUser&id_cond2=1", function(data){
                     listaUsers(data);
                 });
              
             });    
         });

        $("#count").click(function(){
             $("#lowbody").load("Contas-min.html", function(event){
               closeNav();
               //listaUsers();
             });    
         });

        $("#fatura").click(function(){
             $("#lowbody").load("Faturas-min.html", function(event){
               closeNav();
               //listaUsers();
             });    
         });

        $("#newfatura").click(function(){
             $("#lowbody").load("CadastrarFatura-min.html", function(event){
               closeNav();
               //listaUsers();
             });    
         });

        $("#newSindico").click(function(){
             $("#lowbody").load("CriarVotacao-min.html", function(event){
               closeNav();
               //listaUsers();
             });    
         });

        $("#votar").click(function(){
             $("#lowbody").load("Votacao-min.html", function(event){
                closeNav();
                $.getJSON('/php/service.php?acao=listaSindicos', function(data){
                    preencherSelectVotacao(data);
                });
               
               //listaUsers();
             });    
         });

     //aboutus
        $("#aboutus").click(function(){
             $("#lowbody").load("Sobre.html");
            closeNav();
        });
    });

    //Ações quando fecha o menu lateral
    $("#closeNav").on("click", function (event) {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
        document.getElementById("main").style.zIndex = "-1";
        document.body.style.backgroundColor = "white";
        document.getElementById("fullbody").style.backgroundColor = "rgba(0,0,0,0)";
        document.getElementById("lowbody").style.backgroundColor = "rgba(0,0,0,0)";
    });




      function closeNav() {
          document.getElementById("mySidenav").style.width = "0";
          document.getElementById("main").style.marginLeft= "0";
          document.getElementById("main").style.zIndex = "-1";
          document.body.style.backgroundColor = "white";
          document.getElementById("fullbody").style.backgroundColor = "rgba(0,0,0,0)";
          document.getElementById("lowbody").style.backgroundColor = "rgba(0,0,0,0)";
      }


//Enviar dados por requisição assincrona
    function listaUsers(data){
          $.each(data, function(i, item){

            $('#user-table').empty();

            var newRow = $("<tr value="+item.id_usuario+">");
            var cols = "";
            cols += '<td>'+item.id_usuario+'</td>';
            cols += '<td>'+item.login+'</td>';
            cols += '<td>'+item.nome+'</td>';
            cols += '<td>'+item.email+'</td>';
            cols += '<td>'+item.cpf+'</td>';
          
            cols += '<td class="actions">';
            cols += '<button class="btn btn-large btn-danger" onclick="RemoveTableRow(this,'+item.id_usuario+')" type="button">Remover</button>';
            cols += '</td>';
          
            newRow.append(cols);
          
            $("#user-table").append(newRow);
          });

        RemoveTableRow = function(handler, valueRow) {
            deleteUser(valueRow, handler);
            
        return false;
      };      
    }

    function deleteUser(idDeletar, handler){

         $.ajax({
            method: "POST",
            url: "/php/service.php?acao=deletarUser",
            data: {iduserDelete : idDeletar} 
        }).done(function(msg){
           if(msg=="ok"){
            alert("Usuário excluido com sucesso");
               var tr = $(handler).closest('tr'); 
               tr.fadeOut(400, function(){ 
                    tr.remove(); 
                });  
                
           }else{
            alert("Algum problema impediu a exclusão");
           }
        });
    }

    function preencherSelectVotacao(data){
        $.each(data, function(i, item){
          $('<option>').val(item.id_usuario).text(item.nome+' / '+ item.razaosocial).appendTo('#votaSindico');   
        });
    }

    function preencheSelectCondminio(data){
        $.each(data, function(i, item){
            $('<option>').val(item.id_condominio).text(item.razaosocial).appendTo('#getCondominio'); 
        });   
    }

    function preencheSelectuser(data){
         $.each(data, function(i, item){
                $('<option>').val(item.id_usuario).text(item.nome).appendTo('#getUsuariopost'); 
            });
    }

    function preencheSelectAp(data){
        if(data != null){
            $.each(data, function(i, item){
                $('<option>').val(item.id_apartamento).text("Bloco"+item.id_bloco+" Apto"+item.id_apartamento).appendTo('#getApartamento'); 
            });
        }
        else{
            alert("Erro - function preencheSelectAp");
        }
    }

    function passAtivo(password, passValidate){

            if(password != passValidate){
                alert("As senhas não conferem favor verificar");
                $("#alerta").css("display","true");        
            }
            else {
                $("#alerta").css("display", "none"); 
            }
        }   

    function cadastrar(nomeusu, cpfusu, loginusu, senhausu, emailusu, telefoneusu, tipusu, dtnascusu, idcondusu, idapusu){
        $.ajax({
            method: "POST",
            url: "/php/service.php?acao=inserir",
            data: {nome : nomeusu, cpf : cpfusu, login : loginusu, senha : senhausu, email : emailusu, telefone : telefoneusu, tipoUsuario : tipusu,
             dtnasc :  dtnascusu, idcond : idcondusu, idapto : idapusu} 
        })
        .done(function(msg){
            if(msg == "ok"){
                alert("Inserido com sucesso");
            }else{
                alert("Erro ao processar sua solicitação");
            }
        });
    }   

    function cadastrarpost(titlepost,textpost ,idcondpost, idapusupost){
        $.ajax({
            method: "POST",
            url: "/php/service.php?acao=inserirpost",
            data: {title : titlepost, text : textpost, idcond : idcondpost, idusu : idapusupost} 
        })
        .done(function(msg){
            if(msg == "ok"){
                alert("Inserido com sucesso");
            }else{
                alert("Erro ao processar sua solicitação");
            }
        });
    }
});
