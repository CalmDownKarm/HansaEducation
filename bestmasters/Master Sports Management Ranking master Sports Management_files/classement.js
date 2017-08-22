$(document).ready(function()
{
  $("body").on("change", "input[name=filtre-specialite]", function()
  {
    var val = $(this).val();

    switch(val)
    {
      case 'tous':
        $(".program-list tbody > tr").show();
      break;
      case 'informations':
        $(".program-list tbody > tr.pack1, .program-list tbody > tr.pack2").show();
        $(".program-list tbody > tr:not(.pack1, .pack2)").hide();
      break;
      case 'video':
        $(".program-list tbody > tr.video").show();
        $(".program-list tbody > tr:not(.video)").hide();
      break;
      case 'mb':
        $(".program-list tbody > tr.mb").show();
        $(".program-list tbody > tr:not(.mb)").hide();
      break;
    }
  });

  var countryFilter = 
  {
    countryList : [],
    getCountries : function() 
    {
      var that = this;
      this.countryList = [];
      $(".country_text").each(function() 
      {
        that.countryList[ $(this).text() ] = $(this).text();
      });
    },
    init : function()
    {
      var that = this;
      // récupérer la liste des pays chargés
      this.getCountries();
      // ajout le bind event
      $("#filtre-pays").on("input", function() 
      {
        var saisie = $(this).val();
        if ( that.countryList.hasOwnProperty( saisie ) )
        {
          $('.country_text:not(:contains("' + saisie + '"))').closest("tr").addClass("hidden");
        }
        else
        {
          $(".program-list .hidden").removeClass("hidden");
        }
      });
    }
  }

  var open = 0;

    $( "#showFiltre" ).click(function() {
      if (open==0) {
         $(".barFiltre").addClass("show");
         open=1;
      }

      else { 
         $(".barFiltre").removeClass("show");
         open=0; 
      } 
   });

  countryFilter.init();
});