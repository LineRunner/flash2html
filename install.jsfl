﻿function run(){
	var configURI = fl.configURI+'Commands/';
	var scriptURI = fl.scriptURI.slice(0, fl.scriptURI.lastIndexOf("/") + 1);

    FLfile.remove(configURI + 'flash2html');
	FLfile.createFolder(configURI + 'flash2html');
	FLfile.copy(scriptURI + "psd2div.css.jsfl", configURI + 'flash2html/psd2div.css.jsfl');
	FLfile.copy(scriptURI + "psd2div.less.jsfl", configURI + 'flash2html/psd2div.less.jsfl');
	FLfile.copy(scriptURI + "psd2div.less2.jsfl", configURI + 'flash2html/psd2div.less2.jsfl');
	FLfile.copy(scriptURI + "psd2css3d.jsfl", configURI + 'flash2html/psd2css3d.jsfl');

}

run();
