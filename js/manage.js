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

function driveDownload(e) {
  e.value = e.value.replace(/drive\.google\.com.*?\/d\/(.*?)(\/.*?)?$/, "drive.google.com/uc?id=$1&export=download")
}

$('#addDownload').click(() => {
  let input = `
  <div class="flex items-center mb-3 download">
    <div class="inline-flex w-1/4">
      <input class="input" oninput="preview()" name="download[name][]" autocomplete="off" placeholder="Name">
    </div>
    <div class="inline-flex w-2/3 ml-3">
      <input class="input" oninput="preview()" name="download[url][]" type="url" autocomplete="off" placeholder="URL">
    </div>
    <button class="delete h-12 w-1/12 text-2xl ml-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-300 hover:to-orange-300 text-white rounded" type="button">
      <i class="far fa-times"></i>
    </button>
  </div>`;
  $('#download').append(input);
});

$('#addLauncher').click(() => {
  let input = `
  <div class="flex items-center mb-3 launcher">
    <div class="inline-flex w-1/4">
      <input class="input" oninput="preview()" name="launcher[name][]" autocomplete="off" placeholder="Name">
    </div>
    <div class="inline-flex w-2/3 ml-3">
      <input class="input" oninput="preview()" name="launcher[url][]" type="url" autocomplete="off" placeholder="URL">
    </div>
    <button class="delete h-12 w-1/12 text-2xl ml-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-300 hover:to-orange-300 text-white rounded" type="button">
      <i class="far fa-times"></i>
    </button>
  </div>`;
  $('#launcher').append(input);
});

$(document).on('click', '.delete', (e) => {
  e.preventDefault();
  e.target.closest('.flex').remove();
  preview();
});

const preview = () => {
  let download = [], launcher = [];
  $("input[name='download[name][]'").each((id, e) => {
    let url = $("input[name='download[url][]'")[id].value;
    download.push(url ? `[${e.value}](${url})` : e.value)
  })
  $("input[name='launcher[name][]'").each((id, e) => {
    let url = $("input[name='launcher[url][]'")[id].value;
    launcher.push(url ? `[${e.value}](${url})` : e.value)
  })
  let content = `
### Version
${$("input[name=version]").val() || "Version"} - ${$("input[name=update]").val() || "Updated Date"}

### Download
${download.join("\n")}

${launcher.length ? `### Launcher\n${launcher.join("\n")}` : ""}

### Note
${$("textarea[name=note]").val()}

##### [FAQ](https://discord.com/channels/675231240068136960/683330171608367120)

### Update Note
${$("textarea[name=updateNote]").val()}`;
  $("#preview").html(marked(content, { gfm: true, breaks: true }))
}

preview();