var waitFLoad = function() {
  if (typeof jQuery != "undefined") $('#modal').modal('show');
  else window.setTimeout(waitFLoad, 500);
};
window.setTimeout(waitFLoad, 500);