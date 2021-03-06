/* Copyright (c) 4D, 2012
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* The Software shall be used for Good, not Evil.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

/**
Author: Redwan Hilali
Email: redwan.hilali@4d.com
**/

var
	actions;
actions = {};

function findCommand(f)
{
	if(os.isWindows)
	{
		return 'cmd /c cd "'+ f +'" && dir /b /S "*.waSolution"'
	}
	else if(os.isMac)
	{
		return 'sudo find '+ f + ' -iname "*.waSolution"';
	}
}

actions.open = function open() {
    "use strict";
	
	if(  studio.extension.isPrefFileExisting( ) )
	{
		var folders = JSON.parse(studio.extension.getPref('folders'));
		var solutions = [];
		for ( var f in folders )
		{
			var results = SystemWorker.exec(findCommand(folders[f]));
			solutions = solutions.concat(results.output.toString().split("\n"));
		}
	  
	    studio.extension.showModalDialog("solutionsList.html", {sols:solutions}, {
	        title: "Wakanda Available Solutions",
	        dialogwidth: 870,
	        dialogheight: 580,
	        resizable: false
	    }, '');
	 
	 }
	 
	 else
	 {
	 	actions.settings();
	 }   

    return true;
};

actions.settings = function settings() {
	"use strict";
	
	 studio.extension.showModalDialog("settings.html", {}, {
	        title: "Wakanda Settings",
	        dialogwidth: 870,
	        dialogheight: 580,
	        resizable: false
	    }, '');
	
	return true;
};

actions.saveSettings = function saveSettings() 
{
	"use strict";
	
//	var folders = studio.extension.storage.returnValue.folders;
	studio.alert(folders);
//	studio.extension.setPref("folders", folders);
	
	
}

actions.startSolution = function startSolution( inMessage )
{
	"use strict";
	
	studio.sendCommand("startWakandaServer") ; //admin.openSolution(studio.extension.storage.getItem( "selectedSolution")));
	
}


exports.handleMessage = function handleMessage(message) {
	"use strict";
	var
		actionName;

	actionName = message.action;

	if (!actions.hasOwnProperty(actionName)) {
		studio.alert("I don't know about this message: " + actionName);
		return false;
	}
	actions[actionName](message);
};

