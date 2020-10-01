(function (root, factory) {
  try {
    // commonjs
    if (typeof exports === "object") {
      module.exports = factory();
      // global
    } else {
      root.toast = factory();
    }
  } catch (error) {
    console.log(
      "Isomorphic compatibility is not supported at this time for toast."
    );
  }
})(this, function () {
  // We need DOM to be ready
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("DOMContentLoaded", init);
  }

  var toast = {};

  // Create toast object
  toast = {
    // In case toast creation is attempted before dom has finished loading!
    create: function () {
      console.error(
        [
          "DOM has not finished loading.",
          "\tInvoke create method when DOMs readyState is complete"
        ].join("\n")
      );
    }
  };
  var autoincrement = 0;

  // Initialize library
  function init() {
    // Toast container
    var container = document.createElement("div");
    container.id = "cooltoast-container";
    document.body.appendChild(container);

    // @Override
    // Replace create method when DOM has finished loading
    toast.create = function (options) {
      var toast = document.createElement("div");
      toast.id = ++autoincrement;
      toast.id = "toast-" + toast.id;
      toast.className = "cooltoast-toast";

      // title
      if (options.title) {
        var h4 = document.createElement("h4");
        h4.className = "cooltoast-title";
        h4.innerHTML = options.title;
        toast.appendChild(h4);
      }

      // text
      if (options.text) {
        var p = document.createElement("p");
        p.className = "cooltoast-text";
        p.innerHTML = options.text;
        toast.appendChild(p);
      }

      // icon
      if (options.icon) {
        var img = document.createElement("img");
        img.src = options.icon;
        img.className = "cooltoast-icon";
        toast.appendChild(img);
      }

      // click callback
      if (typeof options.callback === "function") {
        toast.addEventListener("click", options.callback);
      }

      // toast api
      toast.hide = function () {
        toast.className += " cooltoast-fadeOut";
        toast.addEventListener("animationend", removeToast, false);
      };

      // autohide
      if (options.timeout) {
        setTimeout(toast.hide, options.timeout);
      }
      // else setTimeout(toast.hide, 2000);

      if (options.type) {
        toast.className += " cooltoast-" + options.type;
      }

      toast.addEventListener("click", toast.hide);

      function removeToast() {
        document.getElementById("cooltoast-container").removeChild(toast);
      }

      document.getElementById("cooltoast-container").appendChild(toast);
      return toast;
    };
  }

  return toast;
});
