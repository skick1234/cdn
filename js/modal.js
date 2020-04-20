var waitForLoad = function() {
  if (typeof jQuery != "undefined") $('#modal').modal('show');
  else window.setTimeout(waitForLoad, 500);
};
window.setTimeout(waitForLoad, 500);