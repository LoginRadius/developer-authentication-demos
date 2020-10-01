// eslint-disable-next-line no-unused-vars
var apiService = (function () {
  function getRequest(url, callback, errorCallback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {
      var response = JSON.parse(xhr.responseText);
      document.querySelector('body').classList.add("loaded") ;
      if (xhr.readyState == 4 && xhr.status == "200") {
        callback(response);
      } else {
        errorCallback(response);
      }
    }
    xhr.send();
  }

  function postRequest(url, data, callback, errorCallback) {
  console.log("data ", data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
      var response = JSON.parse(xhr.responseText);
      document.querySelector('body').classList.add("loaded") ;
      if (xhr.readyState == 4 && xhr.status == "201" || xhr.status == 200) {
        callback(response);
      } else {
        errorCallback(response);
      }
    }
    xhr.send(data);
  }

  function putRequest(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
      var response = JSON.parse(xhr.responseText);
      if (xhr.readyState == 4 && (xhr.status == "201" || xhr.status == 200)) {
        callback(response);
      } else {
        callback(response);
      }
    }
    xhr.send(data);
  }


  function patchRequest(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("PATCH", url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
      var response = JSON.parse(xhr.responseText);
      if (xhr.readyState == 4 && xhr.status == "201") {
        callback(response);
      } else {
        callback(response);
      }
    }
    xhr.send(data);
  }

  return {
    getRequest: getRequest,
    postRequest: postRequest,
  };
})();