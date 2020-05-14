var waitData = function() {
  if (typeof jQuery != "undefined" && typeof gameData != "undefined") {
    downloadModal(gameData);
    gameData = null;
  }
  else window.setTimeout(waitData, 500);
};

window.setTimeout(waitData, 500);

function downloadModal(gameData) {
  $("#gameData").remove();
  $(".download-btn").click(function(event) {
    event.preventDefault();
    let e = $(this);
    let game = gameData.filter(obj => obj.id == e.data('id'))[0];
    $('#download-name').html(game.name);
    let download = $('<ul/>');
    game.download.forEach(obj => {
      download.append(
        $('<li/>').append(
          $('<a/>').attr('href', obj.url).text(obj.name)
        )
      );
    });
    let content = $('<div/>').append("Download").append(download);
    if (game.launcher) {
      let launcher = $('<ul/>');
      game.launcher.forEach(obj => {
        launcher.append(
          $('<li/>').append(
            $('<a/>').attr('href', obj.url).text(obj.name)
          )
        );
      });
      content.append("Launcher").append(launcher);
    }
    $('#download-content')
      .text(`Version: ${game.version} - ${game.update}`)
      .append(content);
  });
}