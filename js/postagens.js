// JavaScript Document
$(document).ready(function()
{
    atualizarLista();
});

//Listagem da página
function atualizarLista(){
    
    //Coloca o GIF de carregando na pagina
    //$('#carregar').css('display','block');
    
    //Inicia uma requisição assíncrona
    $.ajax({
        //Tipo de dado que vai retornar
        dataType: 'json',
        //URL do serviço passando por GET no nome do serviço usado
        url: 'service.php?acao=listarpost',
        //Se retornar um código 200 de sucesso
        success: function success(data) {
            console.log("cccc");
            //Remover o carregamento
            //$('#carregar').css('display','none');
            
            //Limpar tabela
            $('#post_table').empty();               
            
            //Varrer a lista de dados que veio no json
            $.each(data.listagem, function (index, value) {

                //Colocar no HTML o dados usando o tempalte ITEMLISTA
                $('#post_table').append(itemLista(value.id_postagem,value.id_usuario,value.id_condominio,value.titulo,value.textopost));

            });
        }
    });
}

//Template de Listagem
function itemLista(id_postagem,id_usuario,id_condominio,titulo,textopost){
    //Formata o HTML de cada registro da tabela 
    return "<tr><td>"+id_postagem+"</td><td>"+id_usuario+"</td><td>"+id_condominio+"</td><td>"+titulo+"</td><td>"+textopost+"</td></tr>";
}