window.onload = function(){
    var buttonUpdate = document.querySelector('.header-update');
    var buttonDelete = document.querySelector('.header-delete');

    buttonUpdate.addEventListener('click', function(){
        alert("게시글을 수정하시겠습니까?");
    });
   
    buttonDelete.addEventListener('click', function(){
        alert("게시글을 삭제하시겠습니까?");
    });
};