$( document ).ready(function() {
    console.log( "ready!" );
});
$("#log").submit(function(e) {
      console.log(1);
      var form = $(this);
      var url = "api/payment";

      $.ajax({
             type: "POST",
             url: url,
             data: form.serialize(),
             success: function(data)
             {
                 alert(data);
             }
           });
 
      e.preventDefault();
});
