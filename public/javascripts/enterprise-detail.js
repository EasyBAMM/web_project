window.onload = function () {
  var buttonUpdate = document.querySelector(".header-update");
  var buttonDelete = document.querySelector(".header-delete");
  var buttonApply = document.querySelector(".main-button");

  buttonUpdate.addEventListener("click", function () {
    alert("게시글을 수정하시겠습니까?");
  });

  buttonDelete.addEventListener("click", function () {
    alert("게시글을 삭제하시겠습니까?");
  });

  buttonApply.addEventListener("click", function (e) {
    var result = confirm(
      "정말 지원하시겠습니까? 지원 시 수정 및 변경이 불가합니다."
    );
    if (result) {
      alert(
        "사전에 등록된 자소서가 있을 시, \n등록이 완료됩니다. 좋은 결과 있길 기대합니다!"
      );
    } else {
      e.preventDefault();
    }
  });
};
