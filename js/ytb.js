/* Light YouTube Embeds by @labnol */
/* Web: http://labnol.org/?p=27941 */

function createYoutubeThumb() {
    var div,
        n,
        v = document.getElementsByClassName("youtube-player")
    for (n = 0; n < v.length; n++) {
        div = document.createElement("div")
        div.setAttribute("data-id", v[n].dataset.id)
        div.innerHTML = labnolThumb(v[n].dataset.id)
        div.onclick = labnolIframe
        v[n].appendChild(div)
    }
}

function labnolThumb(id) {
    var thumb =
            '<img class="lazyload" data-srcset="https://i.ytimg.com/vi_webp/ID/default.webp 120w, https://i.ytimg.com/vi_webp/ID/mqdefault.webp 240w, https://i.ytimg.com/vi_webp/ID/hqdefault.webp">',
        play = '<div class="play"></div>'
    return thumb.replace(/ID/g, id) + play
}

function labnolIframe() {
    var iframe = document.createElement("iframe")
    var embed = "https://www.youtube.com/embed/ID?autoplay=1"
    iframe.setAttribute("src", embed.replace("ID", this.dataset.id))
    iframe.setAttribute("frameborder", "0")
    iframe.setAttribute("allowfullscreen", "1")
    this.parentNode.replaceChild(iframe, this)
}

var waitToYoutube = function () {
    if (typeof jQuery != "undefined") createYoutubeThumb()
    else window.setTimeout(waitToYoutube, 500)
}

window.setTimeout(waitToYoutube, 500)
