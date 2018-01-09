//Add like for main page
$(document).ready(function(){
  $('.add-like').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    const urlRedirect = $target.attr('return-url');
    console.log(urlRedirect);
    $.ajax({
      type:'POST',
      url: '/posts/like/'+id,
      success: function(response){
        if(urlRedirect){
          window.location.href=urlRedirect;
        }else{
          window.location.href='/';
        }
      },
      error: function(err){
        console.log(err);
      },
      already: function(response){
        console.log('already');
      }
    });
  });
});

//Add dislike for main page
$(document).ready(function(){
  $('.add-dislike').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    const urlRedirect = $target.attr('return-url');
    $.ajax({
      type:'POST',
      url: '/posts/dislike/'+id,
      success: function(response){
        console.log('good');
        if(urlRedirect){
          window.location.href=urlRedirect;
        }else{
          window.location.href='/';
        }
      },
      error: function(err){
        console.log(err);
      },
      already: function(response){
        console.log('already');
        // req.flash('danger', "You already disliked this!")
      }
    });
  });
});




$(document).ready(function(){
  $('.delete-post').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('delete-id');
    console.log(id);
    $.ajax({
      type:'DELETE',
      url: '/posts/delete/'+id,
      success: function(response){
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});


