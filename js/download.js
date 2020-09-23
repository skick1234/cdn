var waitData = function () {
  if (typeof jQuery !== "undefined" && typeof gameData != "undefined") {
    downloadModal(gameData);
    gameData = null;
  }
  else window.setTimeout(waitData, 500);
};

waitData();
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if ('target' in node) { node.setAttribute('target', '_blank'); }
});

function downloadModal(gameData) {
  $("#gameData").remove();
  $(".download-btn").click(function (event) {
    event.preventDefault();
    let e = $(this);
    let game = gameData.filter(obj => obj.id == e.data('id'))[0];
    $('#download-name').text(game.name);
    $('#download-content').html(DOMPurify.sanitize(marked(content(game), {
      gfm: true,
      breaks: true
    })));
    dlOpenModal();
  });
}

const content = game => {
  let download = [], launcher = [];
  game.download.forEach(obj => download.push(obj.url ? `<a rel="noreferrer" target="_blank" href="${obj.url}">${obj.name}</a>` : obj.name));
  if (game.launcher) game.launcher.forEach(obj => launcher.push(obj.url ? `<a rel="noreferrer" target="_blank" href="${obj.url}">${obj.name}</a>` : obj.name));
  return `
### Version
${game.version} - ${game.update}

### Download
${download.join("\n").replace(/\(OD\)/g, "(OneDrive)").replace(/\(GD\)/g, "(Google Drive)")}

${game.launcher ? `### Launcher\n${launcher.join("\n")}` : ""}

### Note
${game.note}

##### [FAQ](https://linkneverdie.com/thread/nhung-dieu-co-ban-can-tuan-thu-truoc-khi-tai-game-cai-game-va-choi-game-la-gi-76)

${game.updateNote ? `### Update Note\n${game.updateNote}` : ""}`
}

const dlModal = document.querySelector('.download-modal');
const dlCloseButton = document.querySelectorAll('.download-modal-close');
const dlModalClose = () => {
  document.body.classList.remove("overflow-hidden");
  dlModal.classList.remove('opacity-100');
  dlModal.classList.add('opacity-0');
  setTimeout(() => {
    dlModal.classList.remove('duration-500');
    dlModal.style.display = 'none';
  }, 500);
}
const dlOpenModal = () => {
  document.body.classList.add("overflow-hidden");
  dlModal.style.display = 'flex';
  dlModal.classList.add('duration-500');
  setTimeout(() => {
    dlModal.classList.remove('opacity-0');
    dlModal.classList.add('opacity-100');
  }, 100)
}
for (let i = 0; i < dlCloseButton.length; i++) {
  const elements = dlCloseButton[i];
  elements.onclick = (e) => dlModalClose();
  dlModal.style.display = 'none';
  window.onclick = function (event) {
    if (event.target == dlModal) dlModalClose();
  }
}