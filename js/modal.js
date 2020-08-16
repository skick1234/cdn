var waitToModal = function() {
  if (typeof jQuery != "undefined" && typeof $('#modal').modal != "undefined") $('#modal').modal('show');
  else window.setTimeout(waitToModal, 500);
};
window.setTimeout(waitToModal, 500);