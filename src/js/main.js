;
'use strict';

(function () {

  window.onload = toggleBtn;

  console.log('WooHoo :D');

  function toggleBtn() {
    const collapseMenu = document.getElementById('collapse-menu'),
          expandMenu = document.getElementById('expand-menu'),
          headerView = document.getElementById('header');

    collapseMenu.onclick = function (e) {
      headerView.className = 'header collapsed';
    };

    expandMenu.onclick = function (e) {
      headerView.className = 'header expanded';
    };
  }

})();