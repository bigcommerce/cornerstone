// add the line below to disable check
/* eslint-disable */

export default function timer(){
	var $j = jQuery.noConflict();
	
	$j(document).ready(function() {
		return shippingTimeCountDown1();
	});
	function pad(n, len) { // leading 0's
		var s = n.toString();
		return (new Array((len - s.length + 1)).join('0')) + s;
	};
	
	function dst() {
		var today = new Date;
		var yr = today.getFullYear();
		var dst_start = new Date("March 14, " + yr + " 02:00:00"); // 2nd Sunday in
																	// March can't
																	// occur after
																	// the 14th
		var dst_end = new Date("November 07, " + yr + " 02:00:00"); // 1st Sunday in
																	// November
																	// can't occur
																	// after the 7th
		var day = dst_start.getDay(); // day of week of 14th
		dst_start.setDate(14 - day); // Calculate 2nd Sunday in March of this
										// year
		day = dst_end.getDay(); // day of the week of 7th
		dst_end.setDate(7 - day); // Calculate first Sunday in November of this
									// year
		if (today >= dst_start && today < dst_end) { // does today fall inside of
														// DST period?
			return true; // if so then return true
		}
		return false; // if not then return false
	};
	
	function deadlineDown(targetHrs, targetMins) {
		var days = 0;
		var hrs = 0;
		var mins = 0;
		var secs = 0;
		var orderday = "unknown";
		var str = "unknown";
		var dateChgHrs = 0;
	
		//var now calculationss now use UTC time
		var now = new Date();
	
		var nowTotalSecs = (now.getUTCHours() * 3600) + (now.getUTCMinutes() * 60)
				+ now.getUTCSeconds();
	
		//check if in daylight savings time, adjust targetHrs for UTC time
		(dst() ? targetHrs += 4 : targetHrs += 5);
	
		var targetTotalSecs = targetHrs * 3600 + targetMins * 60 - nowTotalSecs;
		var toolate = false;
	
		//Put this in a variable for convenience
		var weekday = now.getUTCDay();
		(dst() ? dateChgHrs = 4 : dateChgHrs = 5);
		if (now.getUTCHours() <= dateChgHrs) {
			(weekday > 0 ? weekday -= 1 : weekday = 6);
		}
	
	
		// check if past shipment cutoff
		toolate = (targetTotalSecs <= 0) ? true : false;
	
		// adjust for next day or after weekend shipments.
		switch (weekday) {
		case 0:
			orderday = "Sunday";
			targetTotalSecs += (24 * 3600);
			break;
		case 1:
			orderday = "Monday";
			if (toolate) {
				targetTotalSecs += 24 * 3600;
			}
			break;
		case 2:
			orderday = "Tuesday";
			if (toolate) {
				targetTotalSecs += 24 * 3600;
			}
			break;
		case 3:
			orderday = "Wednesday";
			if (toolate) {
				targetTotalSecs += 24 * 3600;
			}
			break;
		case 4:
			orderday = "Thursday";
			if (toolate) {
				// 24h offset now, used to be 23h
				targetTotalSecs += 24 * 3600;
			}
			break;
		case 5:
			orderday = "Friday";
			if (toolate) {
				targetTotalSecs += 72 * 3600;
			}
			break;
		case 6:
			orderday = "Saturday";
			targetTotalSecs += (48 * 3600);
			break;
		default:
			orderday = "Unknown";
		}
	
		days = Math.floor(targetTotalSecs / 86400);
		hrs = Math.floor((targetTotalSecs % 86400) / 3600);
		mins = Math.floor(((targetTotalSecs % 86400) % 3600) / 60);
		secs = ((targetTotalSecs % 86400) % 3600) % 60;
		if (days != 0) {
			str = days + ' days ' + pad(hrs, 2) + ' hrs ' + pad(mins, 2)
					+ ' mins <small>' + pad(secs, 2) + ' secs</small>';
		} else if (hrs != 0) {
			str = pad(hrs, 2) + ' hrs ' + pad(mins, 2) + ' mins <small>'
					+ pad(secs, 2) + ' secs</small>';
		} else {
			str = pad(mins, 2) + ' mins <small>' + pad(secs, 2) + ' secs</small>';
		}
		return str;
	};
	
	function shippingTimeCountDown1() {
		if (document.getElementById('shipping-time1')) {
			var timerRunning = setInterval(function countDown() {
				var targetHrs1 = 17; // hrs is the cut-off point
				var targetMins1 = 30;
				var str1 = deadlineDown(targetHrs1, targetMins1);
				document.getElementById('shipping-time1').innerHTML = str1;
			}, 1000);
		}
	};
	
	function shippingTimeCountDown2() {
		if (document.getElementById('shipping-time2')) {
			var timerRunning = setInterval(function countDown() {
				var targetHrs2 = 17; // hrs is the cut-off point
				var targetMins2 = 30;
				var str2 = deadlineDown(targetHrs2, targetMins2);
				document.getElementById('shipping-time2').innerHTML = str2;
			}, 1000);
		}
	};
	
	
}