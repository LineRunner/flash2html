﻿var fileURI, doc, timeline, lib;

function run() {
	doc = fl.getDocumentDOM();
	timeline = doc.getTimeline();
	lib = doc.library;
	fileURI = doc.pathURI.slice(0, doc.pathURI.lastIndexOf("/") + 1);

	var _tlData = cookTimeline(timeline);

	exportHtml(_tlData.html);
	exportLess(_tlData.css);
}


function cookTimeline(timeline) {
	var _html = '';
	var _css = '';
	var _uniqueImg = '';
	for (var _len = timeline.layers.length, j = _len - 1; j >= 0; j--) {
		var _layer = timeline.layers[j];
		if (_layer.layerType == 'normal') {
			var elements = _layer.frames[0].elements;
			for (var i in elements) {
				var _ele = elements[i];
				var _dom = null;
				switch (_ele.elementType) {
					case 'instance':
						switch (_ele.instanceType) {
							case 'symbol':
								_dom = createDom(_ele, 'div');
								break;
							case 'bitmap':
								_uniqueImg = {
									width: _ele.width,
									height: _ele.height,
									url: exportImg(_ele.libraryItem).url
								};
								break;
						}
						break;
					case 'shape':
						break;
					case 'text':
						switch (_ele.textType) {
							case 'input':
								_dom = createDom(_ele, 'input');
								break;
							default:
								_dom = createDom(_ele, 'p');
								break;
						}
						break;
				}

				if (_dom) {
					_html += _dom.html;
					_css += _dom.css;
				}
			}
		}
	}

	return {
		html: _html,
		css: _css,
		img: _uniqueImg
	};
}

function createDom(ele, type) {
	var _a = Math.round(ele.colorAlphaPercent) / 100;
	var _r = Math.round(ele.rotation);
	var _sx = Math.round(ele.scaleX * 100) / 100;
	var _sy = Math.round(ele.scaleY * 100) / 100;
	var _kx = Math.round(ele.skewX);
	var _ky = Math.round(ele.skewY);

	if (!isNaN(_r)) {
		ele.rotation = 0;
	} else {
		ele.skewX = 0;
		ele.skewY = 0;
	}
	ele.scaleX = 1;
	ele.scaleY = 1;

	var _w = Math.round(ele.width);
	var _h = Math.round(ele.height);
	var _x = Math.round(ele.x);
	var _y = Math.round(ele.y);
	var _tx = Math.round(ele.transformX);
	var _ty = Math.round(ele.transformY);

	if (!isNaN(_r)) {
		ele.rotation = _r;
	} else {
		ele.skewX = _kx;
		ele.skewY = _ky;
	}
	ele.scaleX = _sx;
	ele.scaleY = _sy;

	var _class = '',
		_html = '',
		_css = '',
		_style = '';

	switch (type) {
		case 'div':
		case 'input':
		case 'p':
			_class = ele.name;
			break;
	}

	switch (type) {
		case "div":
			var _tlData = cookTimeline(ele.libraryItem.timeline);
			break;
	}

	_style += 'position:absolute;' + 'left:' + _x + 'px;' + 'top:' + _y + 'px;';

	switch (type) {
		case "div":
			if (_tlData.img) {
				_style +=
					"width:" + Math.round(_tlData.img.width) + "px;" +
					"height:" + Math.round(_tlData.img.height) + "px;";
				if (_class != '') {
					_style += "background:url('../" + _tlData.img.url + "');";
				} else {
					_style += "background:url('" + _tlData.img.url + "');";
				}
			}
			break;
		case "input":
		case "p":
			_style +=
				"width:" + _w + "px;" +
				"height:" + _h + "px;" +
				'color:' + ele.getTextAttr('fillColor') + ';' +
				'font-size:' + ele.getTextAttr('size') + 'px;' +
				'text-align:' + ele.getTextAttr('alignment') + ';';
			break;
	}

	if (_a < 1) {
		_style +=
			"opacity:" + _a + ";";
	}

	var _tf = "";
	if (!isNaN(_r)) {
		if (_r != 0) {
			_tf += " rotate(" + _r + "deg)";
		}
	} else if (!isNaN(_kx) && !isNaN(_ky)) {
		//_tf += "skew(" + _kx + "deg," + _ky + "deg) ";
	}

	if (_sx !== 1 || _sy !== 1) {
		_tf += " scale(" + _sx + "," + _sy + ")";
	}

	if (_tf !== "") {
		_style +=
			"transform-origin:" + (_tx - _x) + "px " + (_ty - _y) + "px;" +
			"-webkie-transform-origin:" + (_tx - _x) + "px " + (_ty - _y) + "px;" +
			"transform:" + _tf + ";" +
			"-webkie-transform:" + _tf + ";";
	}

	switch (type) {
		case "div":
			if (_class != '') {
				_html = '<div class="' + _class + '">' + _tlData.html + '</div>';
			} else {
				if (_style == '') {
					_html = '<div>' + _tlData.html + '</div>';
				} else {
					_html = '<div style="' + _style + '">' + _tlData.html + '</div>';
				}
			}
			_css += _tlData.css;
			break;
		case "input":
			if (_class != '') {
				_html = '<input type="text" class="' + _class + '"/>';
			} else {
				if (_style == '') {
					_html = '<input type="text" />';
				} else {
					_html = '<input type="text" style="' + _style + '"/>';
				}
			}
			break;
		case "p":
			if (_class != '') {
				_html = '<p class="' + _class + '">' + ele.getTextString() + '</p>';
			} else {
				if (_style == '') {
					_html = '<p>' + ele.getTextString() + '</p>';
				} else {
					_html = '<p style="' + _style + '">' + ele.getTextString() + '</p>';
				}
			}
			break;
	}

	if (_class != '' && _style != '') {
		_css = '.' + _class + '{' + _style + _css + '}';
	}

	return {
		html: _html,
		css: _css
	};
}

function checkName(name) {
	var _a = name.split("/");
	for (var _len = _a.length, i = _len - 1; i >= 0; i--) {
		var _t = _a[i];
		var _n1 = _t.indexOf("Asset");
		if (_n1 >= 0) {
			_a.splice(i, 1);
		} else {
			var _n2 = _t.lastIndexOf(".");
			_t = _n2 >= 0 ? _t.slice(0, _n1) : _t;
			_t = _t.replace(/[\.\s]/g, "_");
			_a[i] = _t;
		}
	}
	var _name = _a.pop();

	return {
		path: _a,
		name: _name
	};
}

function exportImg(libItem) {
	//fl.trace(libItem.originalCompressionType+','+libItem.compressionType);
	var URI = 'images';
	var aURL, rURL;
	var _data = checkName(libItem.name);

	for (var i in _data.path) {
		URI += '/' + _data.path[i];
		FLfile.createFolder(fileURI + URI);
	}

	var _name = _data.name;
	switch (libItem.compressionType) {
		case 'photo':
			rURL = URI + '/' + _name + '.jpg';
			aURL = fileURI + rURL;
			break;
		case 'lossless':
			rURL = URI + '/' + _name + '.png';
			aURL = fileURI + rURL;
			break;
	}
	libItem.exportToFile(aURL, 100);

	return {
		name: libItem.name,
		url: rURL
	};
}

function exportHtml(text) {
	var _fileURL = fileURI + 'index.html';
	var _text = '<!DOCTYPE html><html><head lang="en"><meta charset="UTF-8"><title></title><style>body,div,ul,li,img,p,a,h1,h2,h3,input,span{margin:0px;padding:0px;border:0px;}html,body{background:' + doc.backgroundColor + '}</style><link rel="stylesheet" href="css/main.less"/></head><body>' + text + '</body></html>';
	FLfile.write(_fileURL, _text);
}

function exportLess(text) {
	var _folderURI = fileURI + 'css';
	var _fileURL = _folderURI + '/main.less';
	var _text = text;
	FLfile.createFolder(_folderURI);
	FLfile.write(_fileURL, _text);
}


run();