function Parameter(min, max, init, units, unitLabel, label) {
	/** Constructor for Parameter object */

		this.min = min;
		this.max = max;
		this.init = init;  // Default value when page is initially loaded.
		this.units = units;
		this.unitLabel = unitLabel;
		this.label = label;
		this.slider = null;
		this.textbox = null;
	}
	Parameter.prototype.addSlider = function(slider) {
		this.slider = slider;
	}
	Parameter.prototype.getValue = function() {
		/** returns value in the units of this parameter */
		return this.slider.slider("option", "value") / 10;  // We divide by 10 here to compensate for the 10's from lines 64-66.
	}
	Parameter.prototype.value = function() {
		/** returns value in SI units */
		return this.getValue() * this.units;
	}
	Parameter.prototype.getStep = function(width) {
		return (this.max - this.min) / (3/5 * width) * 10;  // We multiply by 10 here to compensate for the 10's from lines 64-66.
	}
	Parameter.prototype.addTextbox = function(index) {
		this.textbox = $("#textbox" + index);
	}
	Parameter.prototype.setTextbox = function() {
		this.textbox.html("&nbsp;&nbsp;&nbsp;&nbsp;" + round(this.getValue(), 4) + this.unitLabel);
}

function write() {
	/** Method to create initial page. */

	var W = $("#graph").attr("width");
	var H = $("#graph").attr("height");
	var canvas = document.getElementById("graph");
	if (canvas.getContext) {  // Reposition origin to bottom-left
		var graph = canvas.getContext("2d");
		graph.scale(1, -1);
		graph.translate(0, -H);
	}
	$("#xAxisTable").html('<tr>' +  // Create x-axis labels
	                      '    <td class="center-cell">&minus;<em>&pi;</em></td>' +
	                      '    <td class="center-cell" width="' + (W - 10) + '">0</td>' +
	                      '    <td class="center-cell">+<em>&pi;</em></td>' +
	                      '</tr>');

	var p = 1e-12;  // 1 picometer in meters
	var m = 9.10938188e-31;  // Mass of electron in kilograms
	var c = 299792458.0;  // Speed of light in m/s

	var n = 6;  // Number of parameters
	var controls = [  // Create controls for each parameter
	                             //  min max init units unitLabel                 label
					   new Parameter(0,  1,  0.5, p,    " pm",                    "Width of slits"),
					   new Parameter(0,  10, 5,   p,    " pm",                    "Distance between slits"),
					   new Parameter(0,  10, 1,   m,    "<em>m<sub>e</sub></em>", "Mass of particles"),
					   new Parameter(0,  1,  0.9, c,    "<em>c</em>",             "Velocity of particles"),
					   new Parameter(-1, 1,  0,   1,    " A",                     "Current through solenoid"),
					   new Parameter(0,  10, 5,   p,    " pm",                    "Radius of solenoid")
				   ];

	var table = $("#sliderTable");
	for (var i = 0; i < n - 2; i++)  // Create a row in the table for each control, with a label, a slider, and a value
		table.html(table.html() + '<tr>'
		                        + '    <td class="right-cell">' + controls[i].label + ':&nbsp;&nbsp;&nbsp;&nbsp;</td>'
		                        + '    <td width="' + (3/5 * W) + '"><div class="slider" id="slide' + i + '"></div></td>'
		                        + '    <td width="' + (1/5 * W) + '" id="textbox' + i + '"></td>'
		                        + '</tr>');

	$(".slider").slider({"range": "min", "animate": "fast"});  // Turn slider-divs into actual sliders
	$(".slider").bind("slidestop", function(event, ui) {  // Rewrite textbox and redraw graph whenever a slider is moved
		var index = $(this).attr("id").charAt($(this).attr("id").length - 1);
		controls[index].setTextbox();
		draw(controls);
	});
	for (var i = 0; i < n; i++) {
		controls[i].addSlider($("#slide" + i).slider("widget"));  // Assign sliders to controls
		$("#slide" + i).slider("option", {  // Adjust the range, step, and start-value of the sliders
			  "min": controls[i].min  * 10,  // These 10's are necessary due to a bug in jQuery where sliders can't deal with non-integer start values.
			  "max": controls[i].max  * 10,
			"value": controls[i].init * 10,
			 "step": controls[i].getStep(W)
		});
		controls[i].addTextbox(i);  // Assign textboxes to controls
		controls[i].setTextbox();
	}

	draw(controls);
}

function draw(controls) {
	/** Method to draw graph on canvas. Called after every slider-change. */

	var W = $("#graph").attr("width");
	var H = $("#graph").attr("height");

	var hbar = 6.62606896e-34 / (2 * Math.PI);  // Reduced Planhk's constant
	var q = 1.602176e-19;  // Charge of the electron in coulombs

	var a    = controls[0].value();  // Width of slits
	var b    = controls[1].value();  // Distance between slits
	var mass = controls[2].value();  // Mass of particles
	var vel  = controls[3].value();  // Velocity of particles
	var j    = controls[4].value();  // Current through solenoid
	var r    = controls[5].value();  // Radius of solenoid

	var k = mass * vel / hbar;  // Wavenumber

	var data = [];
	for (var i = 0; i < W; i++) {

		var x = (i - W / 2) * (2 * Math.PI / W);
		var u = (a * k / 2) * x;
		var v = (b / a) * u;
		var y = Math.pow(Math.sin(u) / u, 2) * Math.pow(Math.cos(v), 2);

		data[i] = [i, H * y];  // Add point (x, y) to the list of points to be graphed
	}

	var canvas = document.getElementById("graph");
	if (canvas.getContext) {
		var graph = canvas.getContext("2d");
		graph.fillStyle = "#FFFFFF";
		graph.fillRect(0, 0, W, H);
		graph.strokeStyle = "#D19405";
		graph.beginPath();
		graph.moveTo(data[0][0], data[0][1]);
		for (var i = 1; i < W; i++)
			graph.lineTo(data[i][0], data[i][1]);
		graph.stroke();
	}
}

function round(number, digits) {
	/** Rounds the given number to the given number of digits. */
	var tens = Math.pow(10, digits);
	return Math.round(number * tens) / tens;
}