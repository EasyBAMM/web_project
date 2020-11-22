window.onload = function(){
    var buttonCheck = document.getElementById('button-check-applicant');
    var buttonGoback = document.getElementById('button-goback');

    buttonCheck.addEventListener('click', function(){
        window.location.href='/';
    });
   
    buttonGoback.addEventListener('click', function(){
        window.location.href='/';
    });
};