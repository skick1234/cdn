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
  game.download.forEach(obj => download.push(`<a rel="noreferrer" target="_blank" href="${obj.url}">${obj.name}</a>`));
  if (game.launcher) game.launcher.forEach(obj => launcher.push(`<a rel="noreferrer" target="_blank" href="${obj.url}">${obj.name}</a>`));
  return `
#### Version
${game.version} - ${game.update}

### Download
${download.join("\n")}

${game.launcher ? `#### Launcher\n${launcher.join("\n")}` : ""}

### Note
${game.note}

### Update Note
${game.updateNote}

##### [FAQ](https://discord.com/channels/675231240068136960/683330171608367120)
`
}

const dlModal = document.querySelector('.download-modal');
const dlCloseButton = document.querySelectorAll('.download-modal-close');
const dlModalClose = () => {
  dlModal.classList.remove('opacity-100');
  dlModal.classList.add('opacity-0');
  setTimeout(() => {
    dlModal.classList.remove('duration-500');
    dlModal.style.display = 'none';
  }, 500);
}
const dlOpenModal = () => {
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