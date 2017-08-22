$(document).ready(function()
{
  $('#genericModal')
  .on('show.bs.modal', function (event)
  {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var template = button.data("template");

    $(".modal-content").html('<div style="text-align:center; margin:0 auto; padding:40px;">Loading please wait...<br />If this message is displayed more than 10 seconds, try to close and open this dialog again</div>');
    $.ajax(
    {
      type:"POST",
      url:"/template." + template + "-modal.php",
      error:function(msg)
      {
        $(".modal-content").html('<div style="margin-right:auto; margin-left:auto; text-align:center">Impossible to load the content... please try again</div>');
      },
      success:function(data){
        $(".modal-content").html(data);
      }
    });
  })
  .on("hidden.bs.modal", function()
  {
    $(".modal-content").html("");
  });

  $("body").on("click", "#genericModal button[type=submit]", function(event)
  {
    var obj = $("#genericModal");

    // Récupérer le template de la modal
    var template = $(this).data('template');

    // empecher la double submition
    // $(obj).find("button[type=submit]").attr("disabled", "disabled");

    // Enlever les classes indiquant des erreurs sur les input
    $(obj).find(".has-error").removeClass("has-error");

    // Enlever les classes sur la notification SAUF .notification
    $(obj).parent().find(".notification").attr("class", "notification");

    // Récupération des checkboxes
    var about_contact_us = [];
    $('#about_contact_us input[type=checkbox]:checked').each(function() {
      about_contact_us.push($(this).val());
    });

    // Récupérer les valeurs des champs du formulaire
    var data_form =
    {
      'ecole_contact_us'        : $(obj).find('form input[id=ecole_contact_us]').val(),
      'pays_contact_us'         : $(obj).find('form select[id=pays_contact_us] option:selected').val(),
      'nom_contact_us'          : $(obj).find('form input[id=nom_contact_us]').val(),
      'fonction_contact_us'     : $(obj).find('form input[id=fonction_contact_us]').val(),
      'email_contact_us'        : $(obj).find('form input[id=email_contact_us]').val(),
      'tel_contact_us'          : $(obj).find('form input[id=tel_contact_us]').val(),
      'commentaire_contact_us'  : $(obj).find('form textarea[id=commentaire_contact_us]').val(),
      'about_contact_us'        : about_contact_us.join(';')
    };

    console.log(about_contact_us);

    $.ajax({
      type : "POST",
      url  : "assets/ajax/ajax." + template + "-check.php",
      data : data_form
    })
    .done(function(rval)
    {
      data = JSON.parse(rval);

      if (data.success)
      {
        // Message de confirmation
        $(obj).find(".notification").addClass("bg-success").html(data.message).fadeIn(800);

        // Masquer le formulaire
        $(obj).find('form, .modal-footer').slideUp(600);

      }
      else if (typeof data.errors != 'undefined')
      {
        var errors       = data.errors;
        var errorMessage = "";

        for (var fieldName in errors)
        {
          // Préparation du message d'erreur
          errorMessage += errors[fieldName] + "<br />";

          // Ajouter la classe has-error sur les input
          $(obj).find("#" + fieldName).parents(".form-group").addClass("has-error");
        }

        // Afficher le message d'erreur
        $(obj).find(".notification").addClass("bg-danger").html(errorMessage).fadeIn(200);

        // Réactivation du bouton submit
        $(obj).find("button[type=submit]").removeAttr("disabled");
      }
      else if (data.warning)
      {
        // Afficher le message d'alerte
        $(obj).find(".notification").addClass("bg-warning").html(data.message);

        // Réactivation du bouton submit
        $(obj).find("button[type=submit]").removeAttr("disabled");
      }
    });

    event.preventDefault();
  });
});