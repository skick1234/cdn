function getId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ?
    match[2] :
    null;
}

function embed(e) {
  let id = getId(e.value);
  if (id) {
    e.value = "https://www.youtube.com/embed/" + id;
  }
}

function run_add() {
  $('.datepicker').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit: 'dd/m/yyyy',
    max: true
  });

  $('#addDownload').click(() => {
    let id = $('.download').length;
    let input = `<div class="input-group mb-2 download"><input autocomplete="off" type="text" class="form-control col-md-2" name="download[${id}][name]" value="" placeholder="Title"><input autocomplete="off" type="url" class="form-control col-md-10" name="download[${id}][url]" value="" placeholder="URL"><div class="input-group-append"><button class="btn btn-outline-danger delete" type="button">&#x2715;</button></div></div>`;
    $('#download').append(input);
  });

  $('#addLauncher').click(() => {
    let id = $('.launcher').length;
    let input = `<div class="input-group mb-2 launcher"><input autocomplete="off" type="text" class="form-control col-md-2" name="launcher[${id}][name]" value="" placeholder="Title"><input autocomplete="off" type="url" class="form-control col-md-10" name="launcher[${id}][url]" value="" placeholder="URL"><div class="input-group-append"><button class="btn btn-outline-danger delete" type="button">&#x2715;</button></div></div>`;
    $('#launcher').append(input);
  });

  $(document).on('click', '.delete', (e) => {
    e.preventDefault();
    e.target.closest('.input-group').remove();
  });
}

var waitForLoad_add = function() {
  if (typeof jQuery != "undefined") run_add();
  else window.setTimeout(waitForLoad_add, 500);
};

waitForLoad_add();
