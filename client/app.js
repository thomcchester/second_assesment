var oldInfo;
$(document).ready(function(){
  $('.oldDB').empty();
  pullOld();
  $('.animal-submit').on('click', animalSubmit);

});

function randomNumber(min, max){
return (Math.floor(Math.random() * (1 + max - min) + min)).toString();
}

//14 not because it wasnt a string


function animalSubmit(event){
  event.preventDefault();
  var animal={};
  $.each($("#zoo-form").serializeArray(), function(i, field){
      animal[field.name] = field.value;
    });
  animal.animal_quantity=randomNumber(1,100); //15 FINALLY FIGURED THAT OUT, IT WASNT CALLED ANIMAL_QUANTITY!!!!!!
  console.log(animal);
  $.ajax({
    type:"POST",
    url:"/animal",
    data: animal,
    success: function(data){
      pullOld();
    }
  });
}

function pullOld(){
  $(".oldDB").empty();
  $.ajax({
    type:"GET",
    url:"/oldAnimal",
    success: function(data){
      oldInfo=data;
      postingOld(oldInfo);

    }
  });
}

function postingOld(data){
  for(var i=0; i<data.length; i++){
    $('.oldDB').append("<p>"+data[i].animal_name+"   "+data[i].animal_quantity+"  </p>");
  }
}
