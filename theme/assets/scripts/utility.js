var utility = (function () {

  return {
    setCookie: function (cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getUrlParameter: function (sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
        }
      }
    },
    checkSession: function () {
      var accesstoken = localStorage.getItem("lr-session-token");
      if (accesstoken != "" && accesstoken != null) {
        var redirectURL = domainName + "/profile.html";
        return true;
      } else {
        return false;
      }
    },
    clearSession: function() {
      localStorage.removeItem("lr-session-token");
      localStorage.removeItem("lr-user-uid");
      utility.setCookie("lr-session-token", '', 0);
      window.location.replace("index.html");
    },
    setInnerText:function(ID, val) {
      var ele = document.getElementById(ID);
      if (val) {
        ele.innerText = val;
      } else {
        ele.innerText = "";
      }
    },
    setFieldValue:function(ID, val) {
      var ele = document.getElementById(ID);
      if (val) {
        ele.val = val;
      }
    },
    getFieldValue:function(ID) {
      var ele = document.getElementById(ID);
      return ele.value;
    },
    toJSONString: function() {

    }
  }

})();