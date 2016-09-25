;
'use strict';

function addClass(o, c) {
  var re;
  re = new RegExp('(^|\\s)' + c + '(\\s|$)', 'g');
  if (re.test(o.className)) {
    return;
  }
  o.className = (o.className + ' ' + c).replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
}

function removeClass(o, c) {
  var re;
  re = new RegExp('(^|\\s)' + c + '(\\s|$)', 'g');
  o.className = o.className.replace(re, '$1').replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
}

function hasClass(o, c) {
  var re;
  re = new RegExp('(^|\\s)' + c + '(\\s|$)', 'g');
  return re.test(o.className);
}

(function () {

  window.onload = toggleBtn;

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

// product page
window.addEventListener('load', function () {
  var section = document.querySelector('.product-section');

  if (section) {

    var steps = Array.prototype.slice.call(section.querySelectorAll('.how-it-works-details li'));
    var stepsContainer = section.querySelector('.how-it-works-details ol');
    var stepsDetails = Array.prototype.slice.call(section.querySelectorAll('.how-it-works-details .step-details'));
    stepsContainer.addEventListener('mouseleave', function(e){
      for (var n = 0; n < stepsDetails.length; n++) {
        removeClass(stepsDetails[n], 'active');
      }
      addClass(section.querySelector('.how-it-works-details .default'), 'active');
    });
    for (var i = 0; i < steps.length; i++) {
      steps[i].addEventListener('mouseenter', function(e){
        var index = steps.indexOf(e.target);
        var det = section.querySelector('.how-it-works-details .step-' + (index + 1));
        for (var n = 0; n < stepsDetails.length; n++) {
          removeClass(stepsDetails[n], 'active');
        }
        if (det) {
          addClass(det, 'active');
        }
      });

    }

    section.querySelector('.show-more').addEventListener('click', function (e) {
      e.preventDefault();
      e.target.style.display = 'none';
      var tds = section.querySelectorAll('tr.hidden');
      for (var i = 0; i < tds.length; i++) {
        tds[i].className = removeClass(tds[i], 'hidden');
      }
    })
  }

});