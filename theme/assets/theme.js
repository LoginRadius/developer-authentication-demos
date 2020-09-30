//$('.message a').click(function(){
//  $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
//});

function toggleForm(type) {
  var loginpage = document.getElementsByClassName("login-form")[0];
  var registerpage = document.getElementsByClassName("register-form")[0];
  if (type == "login") {
    loginpage.style.display = "block";
    registerpage.style.display = "none"
  } else if (type == "register") {
    loginpage.style.display = "none";
    registerpage.style.display = "block"
  }
}

function actionEvent() {
  console.log('test');
  location.href = 'internal-narendra.hub.loginradius.com/auth.aspx?return_url=localhost:5500';
}