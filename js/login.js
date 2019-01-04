// JavaScript Document
$(document).ready(function()
{

    //Enviar dados
    $("#btacessar").on("click",function(event){
        
        $("#InputEmail").removeClass("campoSelecionado");
        $("#InputPassword").removeClass("campoSelecionado");
        
        var email = $('#InputEmail').val();
        var senha = $('#InputPassword').val();       
        
        if(email != "" && senha != ""){
             logar(email,senha);
        }else{
            
            if(email == ""){ $("#InputEmail").addClass("campoSelecionado"); }
            
            if(senha == ""){ $("#InputPassword").addClass("campoSelecionado"); }
            
            alert("Você deve preencher o email e a senha!");
        }


    });

});

    function logar(email,senha) 
    {

        $.ajax({
          method: "POST",
          url: "php/service.php?acao=login",
          data: {InputEmail: email, InputPassword: senha}
        })

        .done(function(msg) 
        {
            if(msg == "ok")
            {
                window.location.replace("/Home.html");
            }
            else
            {
                alert("Email e Senha não conferem.");    
            }
            
        });
    } 