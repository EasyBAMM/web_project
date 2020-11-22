window.onload = function () {
  var buttonCheck = document.getElementById("button-check-applicant");
  var buttonGoback = document.getElementById("button-goback");

  buttonCheck.addEventListener("click", function () {
    alert(
      "지원자 확인은 '등록하기' 이후, \n'채용정보수정' 페이지에서 확인하실 수 있습니다."
    );
  });

  buttonGoback.addEventListener("click", function () {
    window.location.href = "/";
  });
};
