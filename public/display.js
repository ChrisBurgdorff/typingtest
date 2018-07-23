var start = new Date().getTime(),
    elapsed = '0.0';

window.setInterval(function()
{
    var minutes;
	var seconds;
	var totalTime;
	var time = new Date().getTime() - start;
    elapsed = Math.floor(time / 100) / 10;
	elapsed = Math.floor(elapsed);
    //if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
    //document.title = elapsed;
	if (elapsed >= 60) {
		minutes = Math.floor(elapsed / 60);
		seconds = elapsed % 60;
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		totalTime = minutes + ":" + seconds
	} else {
		totalTime = elapsed;
	}
    $("#timer").text("Elapsed Time: " + totalTime);
}, 100);