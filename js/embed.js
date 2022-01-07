var waitForLoad_embed = function () {
    if (typeof jQuery != "undefined" && typeof $(".mdb-select").materialSelect != "undefined") run_embed()
    else window.setTimeout(waitForLoad_embed, 500)
}

window.setTimeout(waitForLoad_embed, 500)
function textCounter(field, field2, maxlimit) {
    var countfield = document.getElementById(field2)
    if (field.value.length > maxlimit) {
        field.value = field.value.substring(0, maxlimit)
        return false
    } else {
        countfield.innerText = `Description ${field.value.length ? `(${maxlimit - field.value.length}/2048)` : ""}`
    }
}

function run_embed() {
    $(".mdb-select").materialSelect()
    var converter = new showdown.Converter()

    var switches = {
        title: false,
        url: false,
        icon: false,
        useVars: false,
    }

    var fields = 0

    var source = ""

    var embed = {
        title: "",
        author: {
            name: "",
            url: "",
            icon: "",
        },
        description: "",
        url: "",
        thumb_url: "",
        color: "#00FFFF",
        fields: [],
        footer: "From Skick with <3",
    }

    function resetEmbed() {
        $(".embed-inner").html("")
        $(".embed-footer").remove()
        $(".embed-thumb").remove()
    }

    function updateEmbed(embed) {
        resetEmbed()

        // add basic embed generation to source
        source = "embed=discord.Embed("

        if (embed.url) {
            $(".embed-inner").append(
                '<div class="embed-title"><a href="' + embed.url + '">' + embed.title + "</a></div>",
            )

            // update source
            if (switches.useVars) {
                source += "title=" + embed.title + ", url=" + embed.url
            } else {
                source += 'title="' + embed.title + '", url="' + embed.url + '"'
            }
        } else if (embed.title.length === 0) {
            source += ""
        } else {
            $(".embed-inner").append('<div class="embed-title">' + embed.title + "</div>")

            // update source
            if (switches.useVars) {
                source += "title=" + embed.title
            } else {
                source += 'title="' + embed.title + '"'
            }
        }

        if (embed.description) {
            $(".embed-inner").append(
                '<div class="embed-description">' +
                    converter.makeHtml(embed.description.replace(/\n/g, "<br />")) +
                    "</div>",
            )

            if (embed.title.length > 0 || embed.url.length > 0) {
                source += ", "
            }

            // update source
            if (switches.useVars) {
                source += "description=" + embed.description
            } else {
                source += 'description="' + embed.description + '"'
            }
        }

        if (embed.color) {
            $(".side-colored").css("background-color", embed.color)

            if (embed.title.length > 0 || embed.url.length > 0) {
                source += ", "
            }

            // update source
            source += "color=0x" + embed.color.substr(1)
        }

        // finished the basic setup
        source += ")\n"

        if (embed.author.name) {
            // add author to source
            source += "embed.set_author("

            $(".embed-title").before(
                '<div class="embed-author"><a class="embed-author-name" href="' +
                    embed.author.url +
                    '">' +
                    embed.author.name +
                    "</a></div>",
            )

            // update source
            if (switches.useVars) {
                source += "name=" + embed.author.name
            } else {
                source += 'name="' + embed.author.name + '"'
            }

            if (embed.author.url) {
                source += ", "

                if (switches.useVars) {
                    source += "url=" + embed.author.url
                } else {
                    source += 'url="' + embed.author.url + '"'
                }
            }

            if (embed.author.icon) {
                $(".embed-author-name").before('<img class="embed-author-icon" src="' + embed.author.icon + '" />')

                source += ","

                // update source
                if (switches.useVars) {
                    source += "icon_url=" + embed.author.icon
                } else {
                    source += ', icon_url="' + embed.author.icon + '"'
                }
            }

            // finish author
            source += ")\n"
        }

        if (embed.thumb_url) {
            // add thumbnail
            source += "embed.set_thumbnail("

            $(".card.embed .card-block").append('<img class="embed-thumb" src="' + embed.thumb_url + '" />')
            $(".embed-thumb").height($(".embed-thumb")[0].naturalHeight)

            // update source
            if (switches.useVars) {
                source += "url=" + embed.thumb_url
            } else {
                source += 'url="' + embed.thumb_url + '"'
            }

            // finish thumbnail
            source += ")\n"
        }

        if (embed.fields.length > 0) {
            $(".embed-inner").append('<div class="fields"></div>')
        }

        if (embed.image) {
            $(".embed-inner").append('<img class="embed-image" src="' + embed.image + '" />')
        }

        for (
            var _iterator = embed.fields,
                _isArray = Array.isArray(_iterator),
                _i = 0,
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
            ;

        ) {
            var _ref

            if (_isArray) {
                if (_i >= _iterator.length) break
                _ref = _iterator[_i++]
            } else {
                _i = _iterator.next()
                if (_i.done) break
                _ref = _i.value
            }

            var field = _ref

            $(".embed-inner .fields").append(
                '\n        <div class="field ' +
                    (field.inline && "inline") +
                    '">\n          <div class="field-name">' +
                    field.name +
                    '</div>\n          <div class="field-value">' +
                    converter.makeHtml(field.value) +
                    "</div>\n        </div>\n      ",
            )

            // add field
            if (switches.useVars) {
                source +=
                    "embed.add_field(name=" +
                    field.name +
                    ", value=" +
                    field.value +
                    ", inline=" +
                    ((field.inline && "True") || "False") +
                    ")\n"
            } else {
                source +=
                    'embed.add_field(name="' +
                    field.name +
                    '", value="' +
                    field.value +
                    '", inline=' +
                    ((field.inline && "True") || "False") +
                    ")\n"
            }
        }

        if (embed.footer) {
            $(".card.embed").append('<div class="embed-footer"><span>' + embed.footer + "</span></div>")

            // add footer
            if (switches.useVars) {
                source += "embed.set_footer(text=" + embed.footer + ")\n"
            } else {
                source += 'embed.set_footer(text="' + embed.footer + '")\n'
            }
        }

        // add send function
        source += "await self.bot.say(embed=embed)\n"

        // code
        $(".source").text(source)
        hljs.highlightBlock($(".source")[0])
    }

    // run once on startup
    updateEmbed(embed)

    // function generateInputFields(fields) {
    //   // generate inputs for fields
    //   $('.input-fields').html('');
    //   var _loop = function _loop(i) {
    //     $('.input-fields').append(
    //       '<div class="row">\n' +
    //       '<div class="col-sm-4 md-form mt-0">\n' +
    //       '<input class="form-control" id="field-' + i + '-name" name="fieldName" type="text"/>\n' +
    //       '</div>\n' +
    //       '<div class="col-sm-4 md-form mt-0">\n' +
    //       '<input class="form-control" id="field-' + i + '-value" name="fieldValue" type="text"/>\n' +
    //       '</div>\n' +
    //       '<div class="col-sm-2 md-form mt-0">\n' +
    //       '<div class="form-check">\n' +
    //       '<input class="form-check-input" name="fieldInline" id="field-' + i + '-inline" type="checkbox">\n' +
    //       '<label class="form-check-label">Inline</label>\n' +
    //       '</div>\n' +
    //       '</div>\n' +
    //       '<div class="col-sm-2 md-form mt-0">\n' +
    //       '<button id="field-' + i + '-delete" class="btn btn-danger">Delete</button>\n' +
    //       '</div>\n' +
    //       '</div>'
    //     );

    //     $('#field-' + i + '-delete').click(function(e) {
    //       e.preventDefault();
    //       deleteField(i);
    //     });
    //   };

    //   for (var i = 0; i < fields; i++) {
    //     _loop(i);
    //   }
    //   $('.input-fields').append('<button id="add-field" class="btn btn-secondary">Add field</button>');
    //   $('#add-field').click(function(e) {
    //     addField();
    //   });
    // }

    // generateInputFields(fields);

    // function updateFieldName(index, value) {
    //   embed.fields[index].name = value;
    //   updateEmbed(embed);
    // }

    // function updateFieldValue(index, value) {
    //   embed.fields[index].value = value;
    //   updateEmbed(embed);
    // }

    // function updateFieldInline(index, value) {
    //   embed.fields[index].inline = value;
    //   updateEmbed(embed);
    // }

    // function deleteField(index) {
    //   embed.fields.splice(index, 1);
    //   updateEmbed(embed);
    //   fields -= 1;
    //   generateInputFields(fields);
    // }

    // function addField() {
    //   embed.fields.push({
    //     inline: true
    //   });
    //   fields += 1;
    //   generateInputFields(fields);
    // }

    function updateTitle(value) {
        embed.title = value || ""
        updateEmbed(embed)
    }

    function updateUrl(value) {
        embed.url = value || ""
        updateEmbed(embed)
    }

    function updateThumb(value) {
        embed.thumb_url = value || false
        updateEmbed(embed)
    }

    function updateImage(value) {
        embed.image = value || false
        updateEmbed(embed)
    }

    function updateDescription(value) {
        embed.description = value || ""
        updateEmbed(embed)
    }

    function updateColor(value) {
        embed.color = value || false
        updateEmbed(embed)
    }

    function updateAuthorName(value) {
        embed.author.name = value || ""
        updateEmbed(embed)
    }

    function updateAuthorUrl(value) {
        embed.author.url = value || ""
        updateEmbed(embed)
    }

    function updateAuthorIcon(value) {
        embed.author.icon = value || ""
        updateEmbed(embed)
    }

    function updateFooter(value) {
        embed.footer = "From Skick with <3"
        updateEmbed(embed)
    }

    // checking helpers
    function addWarning(item, type, message) {
        item.addClass("is-invalid")
        item.removeClass("is-valid")
        if ($("#" + type + "-feedback").length === 0) {
            item.after('<div class="invalid-feedback" id="' + type + '-feedback">' + message + "</div>")
        }
    }

    function addSuccess(item, type) {
        item.removeClass("is-invalid")
        item.addClass("is-valid")
        $("#" + type + "-feedback").remove()
    }

    $("#title").keyup(function () {
        var item = $("#title")
        var title = item.val()

        // update
        updateTitle(title)
    })

    $("#url").keyup(function () {
        var item = $("#url")
        var url = item.val()

        if (url.substr(0, 4) !== "http" && url.length !== 0 && !switches.useVars) {
            addWarning(item, "url", "not a valid url")
        } else {
            addSuccess(item, "url")
            // update
            updateUrl(url)
        }
    })

    $("#icon").keyup(function () {
        var item = $("#icon")
        var icon = item.val()

        if (icon.substr(0, 4) !== "http" && icon.length !== 0 && !switches.useVars) {
            addWarning(item, "icon", "not a valid url")
        } else {
            addSuccess(item, "icon")
            // update
            updateThumb(icon)
        }
    })

    $("#image").keyup(function () {
        var item = $("#image")
        var image = item.val()

        if (image.substr(0, 4) !== "http" && image.length !== 0 && !switches.useVars) {
            addWarning(item, "icon", "not a valid url")
        } else {
            addSuccess(item, "icon")
            // update
            updateImage(image)
        }
    })

    $("#description").keyup(function () {
        var item = $("#description")
        var description = item.val()
        addSuccess(item, "description")
        // update
        updateDescription(description)
    })

    $("#color").change(function () {
        updateColor($("#color").val())
    })

    $("#authorName").keyup(function () {
        var item = $("#authorName")
        var author_name = item.val()

        addSuccess(item, "authorName")
        // update
        updateAuthorName(author_name)
    })

    $("#authorURL").keyup(function () {
        var item = $("#authorURL")
        var author_url = item.val()

        if (author_url.substr(0, 4) !== "http" && author_url.length !== 0 && !switches.useVars) {
            addWarning(item, "authorURL", "not a authorURL url")
        } else {
            addSuccess(item, "authorURL")
            // update
            updateAuthorUrl(author_url)
        }
    })

    $("#authoriconURL").keyup(function () {
        var item = $("#authoriconURL")
        var author_icon = item.val()

        if (author_icon.substr(0, 4) !== "http" && author_icon.length !== 0 && !switches.useVars) {
            addWarning(item, "authoriconURL", "not a valid url")
        } else {
            addSuccess(item, "authoriconURL")
            // update
            updateAuthorIcon(author_icon)
        }
    })

    $("#useVars").click(function () {
        switches.useVars = !switches.useVars
        updateEmbed(embed)
    })
}
