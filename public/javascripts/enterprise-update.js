window.onload = function () {
  var buttonCheck = document.getElementById("button-check-applicant");
  var buttonGoback = document.getElementById("button-goback");
  var formTag = document.querySelector(".form-wrap");

  buttonCheck.addEventListener("click", function () {
    formTag.action = "/enterprise-applicant";
    formTag.submit();
  });

  buttonGoback.addEventListener("click", function () {
    history.back();
  });
};
