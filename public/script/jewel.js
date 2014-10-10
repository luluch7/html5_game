var jewel = (function() {

	var scriptQueue = [],
		numResourcesLoaded = 0,
		numResources = 0,
		executeRunning = false;


	function executeScriptQueue() {
		var next = scriptQueue[0],
			first, script;
		if (next && next.loaded) {
			executeRunning = true;
			// remove the first element in the queue
			scriptQueue.shift();
			first = document.getElementsByTagName("script")[0];
			script = document.createElement("script");
			script.onload = function() {
				if (next.callback) {
					next.callback();
				} //end of next.callback if statement

				// try to execute more scripts
				executeScriptQueue();

			}; // end of script.onload function
			script.src = next.src;
			first.parentNode.insertBefore(script, first);
		} else { 
			executeRunning = false;
		} // end of next && next.loaded if statement


	}// end of executeScriptQueue

	function load(src, callback) {
		var image, queueEntry;
		numResources++;

		// add this resource to the execution queue
		queueEntry = {
			src: src,
			callback: callback,
			loaded: false
		};
		scriptQueue.push(queueEntry); //pushing to scriptQueue array

		image = new Image();
		image.onload = image.onerror = function() {
			numResourcesLoaded++;
			queueEntry.loaded = true;

			if(!executeRunning) {
				executeScriptQueue();
			}
		};// end of image.onerror
		image.src = src;

	}// end of load


	function setup() {
		console.log("Success!"); // debugging purposes
	}// end of setup

	return {
		load: load,
		setup: setup
	}; // end of return






})(); // this will auto execute on load of game