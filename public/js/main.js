$(document).ready(function(){
  $('.add-like').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'POST',
      url: '/posts/like/'+id,
      success: function(response){
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});



$(document).ready(function(){
  $('.delete-post').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'POST',
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
