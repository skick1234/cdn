var waitToModal = function() {
  if (typeof jQuery != "undefined") window.setTimeout($('#modal').modal('show'), 1000);
  else window.setTimeout(waitToModal, 500);
};
window.setTimeout(waitToModal, 500);