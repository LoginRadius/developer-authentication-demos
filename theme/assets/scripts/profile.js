(function () {
  if (!utility.checkSession()) {
    window.location.replace("index.html");
  };

  var token = localStorage.getItem("lr-session-token");
  var profileURL = domainName + "/api/profile";
  var formID = 'update_profile_form';


  function setProfileCard(response) {
    if (typeof (response.data.FullName) != "undefined" && response.data.FullName != null) {
      utility.setInnerText('profile_name', response.data.FullName);
    }
    utility.setInnerText('profile_email', response.data.Email[0].Value);
    utility.setInnerText('profile_lastlogin', new Date(response.data.LastLoginDate).toDateString());
    utility.setInnerText('profile_about', response.data.About);
  }

  function updateProfileFormValues(response) {
    utility.setFieldValue('profile_form_first_name', response.data.FirstName);
    utility.setFieldValue('profile_form_last_name', response.data.LastName);
    utility.setFieldValue('profile_form_about', response.data.About);
  }

  function fetchProfile() {
    var errorCallback = function () {
      utility.clearSession();
    }
    var successCallback = function (response) {
      if (response.status == "success") {
        setProfileCard(response);
        updateProfileFormValues(response);
      } else if (response.status == "error") {
        utility.clearSession();
      }
    }

    var URL = profileURL + "?token=" + token;
  
    apiService.getRequest(URL, successCallback, errorCallback);
  }

  function updateProfile() {

    var URL = profileURL + "?token=" + token;
    var successCallback = function(response) {
      // $("#lr-loading").hide();
      setProfileCard(response);
      if (response.status == 'error') {
        toast.create({
          title: "",
          text: response.message,
          timeout: 3000
        });
      } else if (response.status == 'success') {
        toast.create({
          title: "",
          text: response.message,
          timeout: 3000
        });
      }
    }
    
    var errorCallback = function(response) {
      // $("#lr-loading").hide();
      toast.create({
        title: "",
        text: response,
        timeout: 3000
      });
    }

    var data = {
      token: localStorage.getItem("lr-session-token"),
      firstname: utility.getFieldValue('profile_form_first_name'),
      lastname: utility.getFieldValue('profile_form_last_name'),
      about:utility.getFieldValue('profile_form_about'),
    }
    apiService.postRequest(URL, JSON.stringify(data), successCallback, errorCallback);
  }



  fetchProfile();

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById(formID).addEventListener("submit", function (e) {
      e.preventDefault();
      updateProfile();
    });
  });



})();