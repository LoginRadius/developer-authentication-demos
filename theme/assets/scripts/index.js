

(function(){

  var login_url = 'https://' + commonOptions.appName + '.hub.loginradius.com/auth.aspx?action=login&return_url=' + domainName + '';
  var registration_url = 'https://' + commonOptions.appName + '.hub.loginradius.com/auth.aspx?action=register&return_url=' + domainName + '';

  document.getElementById("lr_register_btn").setAttribute("href", registration_url);
  document.getElementById("lr_login_btn").setAttribute("href", login_url);


})();


let paramsObj = {};

if (params) {
  paramsObj = JSON.parse('{"' + decodeURI(params.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
  if (paramsObj.action_completed === "register") {

    $("#messages").text("Registered Successfully, Check your Mailbox").attr("class", "success-message").delay(2500).fadeOut(300);
  }
}


var access_token = utility.getUrlParameter("token");

if (access_token != "" && access_token != null) {
  utility.setCookie("lr-session-token", access_token, "No Days")
  localStorage.setItem("lr-session-token", access_token);
}

if (utility.checkSession()) {
  window.location.href = domainName + "/profile.html";
};

utility.checkSession();
