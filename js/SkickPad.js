var Skick = function () {
	this.appName = "SkickPad";
	this.$textarea = $("textarea");
	this.$box = $("#code");
	this.$code = $("#code code");
	this.$language = $("#lang");
	this.configureShortcuts();
	this.configureButtons();
};

// set title (browser window)
Skick.prototype.setTitle = function (ext) {
	var title = ext ? this.appName + " - " + ext : this.appName;
	document.title = title;
};

// show the light key
Skick.prototype.lightKey = function () {
	this.configureKey(["new", "save"]);
};

// show the full key
Skick.prototype.fullKey = function () {
	this.configureKey(["new", "duplicate", "raw"]);
};

// enable certain keys
Skick.prototype.configureKey = function (enable) {
	$("#tools .function").each(function () {
		var $this = $(this);
		for (var i = 0; i < enable.length; i++) {
			if ($this.hasClass(enable[i])) {
				$this.addClass("enabled");
				return true;
			}
		}
		$this.removeClass("enabled");
	});
};

// setup a new, blank document
Skick.prototype.newDocument = function (hideHistory) {
	this.$language.prop('disabled', false);
	this.$box.hide();
	this.doc = new Skick_document();
	if (!hideHistory) {
		window.history.pushState(null, this.appName, "/pad");
	}
	this.setTitle();
	this.lightKey();
	this.$textarea.val("").show("fast", function () {
		this.focus();
	});
};

// load an existing document
Skick.prototype.loadDocument = function (key) {
	var _this = this;
	_this.doc = new Skick_document();
	_this.doc.load(key, function (ret) {
		if (ret) {
			if (ret.lang) _this.$language.val(ret.lang);
			else _this.$language.val("c-like");
			_this.$language.prop('disabled', true);
			_this.$code.html(ret.value);
			_this.setTitle(ret.key);
			window.history.pushState(
				null,
				_this.appName + "-" + ret.key,
				"/pad/" + ret.key
			);
			_this.fullKey();
			_this.$textarea.val("").hide();
			_this.$box.show();
			_this.$box.removeClass().addClass(_this.$language.val());
			hljs.initHighlighting();
		} else {
			_this.newDocument();
		}
	});
};

// duplicate the current document
Skick.prototype.duplicateDocument = function () {
	if (this.doc.locked) {
		var currentData = this.doc.data;
		this.newDocument();
		this.$textarea.val(currentData);
	}
};

// lock the current document
Skick.prototype.lockDocument = function () {
	var _this = this;
	this.doc.save(this.$textarea.val(), this.$language.val(), function (
		err,
		ret
	) {
		if (!err && ret) {
			_this.$code.html(ret.value.trim());
			_this.setTitle(ret.key);
			window.history.pushState(
				null,
				_this.appName + "-" + ret.key,
				"/pad/" + ret.key
			);
			_this.fullKey();
			_this.$textarea.val("").hide();
			_this.$box.show();
		}
	});
};

// configure buttons and their shortcuts
Skick.prototype.configureButtons = function () {
	var _this = this;
	this.buttons = [
		{
			$where: $("#tools .save"),
			shortcut: function (evt) {
				return evt.ctrlKey && evt.keyCode === 83;
			},
			action: function () {
				if (_this.$textarea.val().replace(/^\s+|\s+$/g, "") !== "") {
					_this.lockDocument();
				}
			},
		},
		{
			$where: $("#tools .new"),
			shortcut: function (evt) {
				return evt.ctrlKey && evt.keyCode === 32;
			},
			action: function () {
				_this.newDocument(!_this.doc.key);
			},
		},
		{
			$where: $("#tools .duplicate"),
			shortcut: function (evt) {
				return _this.doc.locked && evt.ctrlKey && evt.keyCode === 68;
			},
			action: function () {
				_this.duplicateDocument();
			},
		},
		{
			$where: $("#tools .raw"),
			shortcut: function (evt) {
				return evt.ctrlKey && evt.shiftKey && evt.keyCode === 82;
			},
			action: function () {
				window.location.href = "/pad/raw/" + _this.doc.key;
			},
		},
	];
	for (var i = 0; i < this.buttons.length; i++) {
		this.configureButton(this.buttons[i]);
	}
};

// handles the button-click
Skick.prototype.configureButton = function (options) {
	options.$where.click(function (evt) {
		evt.preventDefault();
		if (!options.clickDisabled && $(this).hasClass("enabled")) {
			options.action();
		}
	});
};

// enables the configured shortcuts
Skick.prototype.configureShortcuts = function () {
	var _this = this;
	$(document.body).keydown(function (evt) {
		var button;
		for (var i = 0; i < _this.buttons.length; i++) {
			button = _this.buttons[i];
			if (button.shortcut && button.shortcut(evt)) {
				evt.preventDefault();
				button.action();
				return;
			}
		}
	});
};

// represents a single document
var Skick_document = function () {
	this.locked = false;
};

// escape HTML-characters
Skick_document.prototype.htmlEscape = function (s) {
	return s
		.replace(/&/g, "&amp;")
		.replace(/>/g, "&gt;")
		.replace(/</g, "&lt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
};

// load a document from the server
Skick_document.prototype.load = function (key, callback) {
	var _this = this;
	$.ajax("/documents/" + key, {
		type: "get",
		dataType: "json",
		success: function (res) {
			_this.locked = true;
			_this.key = key;
			_this.data = res.data;
			callback({
				value: res.data,
				lang: res.lang,
				key: key,
			});
		},
		error: function (err) {
			callback(false);
		},
	});
};

// sends the document to the server
Skick_document.prototype.save = function (data, language, callback) {
	if (this.locked) return false;

	this.data = this.htmlEscape(data);
	var _this = this;
	$.ajax("/documents", {
		type: "post",
		data: JSON.stringify({
			data: _this.data.trim(),
			lang: language
		}),
		contentType: "application/json; charset=utf-8",
		success: function (res) {
			new Skick().loadDocument(res.key);
		},
		error: function (res) {
			try {
				callback($.parseJSON(res.responseText));
			} catch (e) {
				callback({ message: "Something went wrong!" });
			}
		},
	});
};

// after page is loaded
$(function () {
	$("textarea").keydown(function (evt) {
		// allow usage of tabs
		if (evt.keyCode === 9) {
			evt.preventDefault();
			var myValue = "    ";
			if (document.selection) {
				this.focus();
				sel = document.selection.createRange();
				sel.text = myValue;
				this.focus();
			} else if (this.selectionStart || this.selectionStart == "0") {
				var startPos = this.selectionStart;
				var endPos = this.selectionEnd;
				var scrollTop = this.scrollTop;
				this.value =
					this.value.substring(0, startPos) +
					myValue +
					this.value.substring(endPos, this.value.length);
				this.focus();
				this.selectionStart = startPos + myValue.length;
				this.selectionEnd = startPos + myValue.length;
				this.scrollTop = scrollTop;
			} else {
				this.value += myValue;
				this.focus();
			}
		}
	});

	var app = new Skick();
	var path = window.location.pathname;
	if (path === "/pad/" || path === "/pad") {
		app.newDocument(true);
	} else {
		app.loadDocument(path.substring(5, path.length));
	}
	let languages = document.getElementById("lang");
	hljs.listLanguages().forEach((lang) => {
		let opt = document.createElement("option");
		opt.text = hljs.getLanguage(lang).name;
		opt.value = lang;
		if (lang == "c-like") opt.selected = true;
		languages.add(opt);
	});
});
