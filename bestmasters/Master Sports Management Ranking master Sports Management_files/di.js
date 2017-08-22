$(document).ready(function()
{
  $('#diModal')
  .on('show.bs.modal', function (event)
  {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var idp = button.data("programme");

    $(".modal-content").html('<div style="text-align:center; margin:0 auto; padding:40px;">Loading please wait...<br />If this message is displayed more than 10 seconds, try to close and open this dialog again</div>');
    $.ajax(
    {
      type:"POST",
      data:{idp : idp},
      url:"/template.di-modal.php",
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

  $("body").on("change", "#diModal form #status", function()
  {
    var element = $(this);
    var val     = $(element).find("option:selected").val();

    // Affichage des input correspondants a chaque profil
    switch(val)
    {
      case "1":
        $("#study_field").parents(".form-group").show();
        $("#study_level").parents(".form-group").show();
        $("#current_company").parents(".form-group").hide();
        $("#last_degree").parents(".form-group").hide();
      break;
      case "2":
        $("#study_field").parents(".form-group").hide();
        $("#study_level").parents(".form-group").hide();
        $("#current_company").parents(".form-group").show();
        $("#last_degree").parents(".form-group").show();
      break;
      case "3":
        $("#study_field").parents(".form-group").hide();
        $("#study_level").parents(".form-group").hide();
        $("#current_company").parents(".form-group").show();
        $("#last_degree").parents(".form-group").hide();
      break;
      case "4":
        $("#study_field").parents(".form-group").hide();
        $("#study_level").parents(".form-group").hide();
        $("#current_company").parents(".form-group").hide();
        $("#last_degree").parents(".form-group").show();
      break;
      default:
      break;
    }
  });

  $("body").on("click", "#diModal button[type=submit]", function(event)
  {
    var obj = $("#diModal");

    // empecher la double submition
    $(obj).find("button[type=submit]").attr("disabled", "disabled");

    // Enlever les classes indiquant des erreurs sur les input
    $(obj).find(".has-error").removeClass("has-error");

    // Enlever les classes sur la notification SAUF .notification
    $(obj).parent().find(".notification").attr("class", "notification");

    // Récupérer les valeurs des champs du formulaire
    var data_form =
    {
      'title'            : $(obj).find('form select[id=title] option:selected').val(),
      'first_name'       : $(obj).find('form input[id=first_name]').val(),
      'last_name'        : $(obj).find('form input[id=last_name]').val(),
      'email'            : $(obj).find('form input[id=email]').val(),
      'birthdate'        : $(obj).find('form input[id=birthdate]').val(),
      'status'           : $(obj).find('form select[id=status] option:selected').val(),
      'current_company'  : $(obj).find('form input[id=current_company]').val(),
      'last_degree'      : $(obj).find('form input[id=last_degree]').val(),
      'study_level'      : $(obj).find('form select[id=study_level] option:selected').val(),
      'study_field'      : $(obj).find('form select[id=study_field] option:selected').val(),
      'postcode'         : $(obj).find('form input[id=postcode]').val(),
      'town'             : $(obj).find('form input[id=town]').val(),
      'country'          : $(obj).find('form select[id=country]').val(),
      'nationality'      : $(obj).find('form select[id=nationality]').val(),
      'mobile_number'    : $(obj).find('form input[id=mobile_number]').val(),
      'linkedin_profile' : $(obj).find('form input[id=linkedin_profile]').val(),
      'other_profile'    : $(obj).find('form input[id=other_profile]').val(),
      'address_1'        : $(obj).find('form input[id=address_1]').val(),
      'address_2'        : $(obj).find('form input[id=address_2]').val(),
      'address_3'        : $(obj).find('form input[id=address_3]').val(),
      'agree'            : $(obj).find('form input[id=agree]:checked').val(),
      'id_programme'     : $(obj).find('form input[id=id_programme]').val()
    };

    $.ajax({
      type : "POST",
      url  : "/assets/ajax/ajax.di-check.php",
      data : data_form
    })
    .done(function(rval)
    {
      data = JSON.parse(rval);

      if (data.success)
      {
        // Message de confirmation
        $(obj).find(".notification").addClass("bg-success").html(data.message).fadeIn(200);

        // Fermeture du modal
        $(obj).find("#di-form").slideUp(200);

        // Changement du bouton sur Liste spé OU Page programme
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
        $(obj).find(".notification").addClass("bg-warning").html(data.message).fadeIn(200);

        // Réactivation du bouton submit
        $(obj).find("button[type=submit]").removeAttr("disabled");
      }
    });

    // Remonte en haut
    $(obj).animate({scrollTop:0}, 500);

    event.preventDefault();
  });
});