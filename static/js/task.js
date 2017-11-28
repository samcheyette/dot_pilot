/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// END OF STIMULI XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


var psiTurk = PsiTurk(uniqueId, adServerLoc);

var mycondition = condition;  
var mycounterbalance = counterbalance;

var NUM_APPROX = 10;
var NUM_COUNT = 5;
var NUM_TEST = 3;
NUM_TEST = Math.round(NUM_TEST * 60); 

var minX = 5;
var maxX = 50;

var max_pay = 0.1;

var ap_in = "<p>You will now do several trials where a number of X's "
ap_in = ap_in + "appear on the screen for <b>only one second</b>. "
ap_in = ap_in + "You will have to guess how many there are. "
ap_in = ap_in + "Press enter when you're ready to start.</p>"

var count_in = "<p>You will now do several trials where a number of X's " 
count_in = count_in + "appear on the screen. You need to <b>count</b> them as "
count_in = count_in + "quickly as possible. But make sure you get the number "
count_in = count_in + "correct, otherwise you will have to re-do the trial. "
count_in = count_in + "Press enter when you're ready to start.</p>"

var test_in = "<p>You will now be given three minutes to guess the number of "
test_in = test_in + "X's on the screen as quickly and accurately "
test_in = test_in + "possible. You will <b> earn a bonus of 10 cents </b> on any trial "
test_in = test_in + "if you are accurate. But keep in mind that you "
test_in = test_in + "can keep doing trials until the full three minutes are up. "
test_in = test_in + "Press enter when you're ready to start.</p>"

var approx = {NAME:'approx', NUM:NUM_APPROX, INST:ap_in};
var count = {NAME:'count', NUM:NUM_COUNT, INST:count_in};
var test = {NAME:'test', NUM:NUM_TEST, INST:test_in};
var begin=true;
var approx_time = 1500;

var all_trials = 0;

var order = [approx, count, test];
var order_idx = 0;
var part = order[order_idx];
var wait_for_ent=true;
var total_bonus = 0;


var pages = [
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages); 

var instructionPages = [ 
	"instructions/instruct-ready.html"
];


/******************
* Main Experiment *
*******************/

var Trial = function() {
	psiTurk.showPage('stage.html');


	data = []; //contains the trial number, RT of space bar press, RT of number input, subject input, exact number of Xs, accuracy of subject input, subject's score,
	//type of cue  (small or big), approx number of dots (small or big)
	function cueBig() {
		cueBigsquare = new createjs.Shape();
		cueBigsquare.graphics.beginFill("blue").drawRect(450, 200, 50, 50);
		stage.addChild(cueBigsquare);
		stage.update();
		return cueBigsquare;
	}

	function cueSmall() {
		cueSmallsquare = new createjs.Shape();
		cueSmallsquare.graphics.beginFill("red").drawRect(450, 200, 50, 50);
		stage.addChild(cueSmallsquare);
		stage.update();
		return cueSmallsquare;
	}

	function createX(x, y) {
		var X = new createjs.Text("X", "40px Arial", "black");
		X.x = x;
		X.y = y;
		//stage.addChild(X);
		//stage.update();
		return X;
	}

	function getrandom() {
		var xval = Math.floor(Math.random() * ((myCanvas.width-100) - 100 + 1) ) + 100;
		var yval = Math.floor(Math.random() * ((myCanvas.height-100) - 100 + 1) ) + 100;
		return [xval, yval];
	}

	function accuracy(answer, numX) {
		var acc = Math.abs(numX - answer); //the closer to 0, the better
		return acc;
	}

	function score(n_resp, n_true, RT) {
		//some function that gives more points for lower RT and accuracy
		//s = RT.toString();
		var diff = Math.abs(n_resp - n_true);
		var s = 0.0;
		if (diff == 0) {
			s = max_pay;
		}
		return s;
	}

	function placement(numX) {
		for (var i = 0; i < numX; i++) {
			var positions = getrandom();
			var X = createX(positions[0], positions[1]);
			stage.addChild(X);
			stage.update();
		}
	}

	function numX(low, high) {
		var numX = Math.floor(Math.random() * (high - low + 1) ) + low;
		return numX;
	}

	var trials = 0;
	function runSmallTrial() {

		stage.removeAllChildren();
		stage.update();

		if (((part.NAME == "test") | (trials < NUMTRIALS)) & !(begin)) {
			console.log(trials)
			console.log(part.NAME)
		    instruct_test.style.display = "none";

		    //trials = new Date();
			trials=trials+1;
			all_trials=all_trials+1;
			var square = cueSmall();
			var listen = true;

			//if ((trials > 0) & (part.NAME == "test")) {
				//date = new Date();
				//instruct_test.style.display = "inline";
			//	var tr = "time remaining: "
				//tr = tr + Math.round((new Date() - test_trials)/1000);
				//instruct_test.innerHTML = tr;
			//}

			setTimeout(function() {continueSmallTrial(square, part.NAME)}, 400);
		
			if ((trials > 0) & part.NAME == "test") {
				var time_lapsed = Math.round((new Date() - test_trials)/1000);
				var time_remain = Math.max(NUM_TEST - time_lapsed, 0);

				if (time_remain <= 0) {
					finish();
				}

			}

		}

		else { 
			if (begin) {
				begin = false;
				instruct_test.innerHTML = part.INST;
				input.style.display="none";
				instruct_test.style.display = "inline";
				wait_for_ent=true;
				wait_for_enter();

			}
			else if (part.NAME == 'test') {
				finish();
			}
			else {
				trials = 0;
				order_idx = order_idx + 1;
				part = order[order_idx];
				NUMTRIALS = part.NUM;

				instruct_test.innerHTML = part.INST;
				input.style.display="none";
				instruct_test.style.display = "inline";
				wait_for_ent=true;

				wait_for_enter();
			}



			//finish();
		}

		function wait_for_enter() {
			console.log("wait for enter")
			var keys = {};
			this.document.onkeydown = keydown;
			this.document.onkeyup = keyup;

			function keydown(event) {
				keys[event.keyCode] = true;
				}

			function keyup(event) {
				delete keys[event.keyCode];
					}
			function handleTick(event) {

				if (keys[13] & (!listen & wait_for_ent)){
					wait_for_ent=false;

					if (part.NAME == "test" & trials == 0) {

						test_trials = new Date();

					}
					runSmallTrial();
				}
			}
			createjs.Ticker.on("tick", handleTick);

		}
	//console.log(data);
	}



	function continueSmallTrial(square, which_part) {

		var keys = {};
		this.document.onkeydown = keydown;
		this.document.onkeyup = keyup;

		function keydown(event) {
			keys[event.keyCode] = true;
		}

		function keyup(event) {
			delete keys[event.keyCode];
		}
		stage.removeChild(square);
		stage.update();

		var start_time1 = new Date();

		var nX = numX(minX, maxX);
		placement(nX);
		var xonscreen = true;
		var end_time1 = 0;
		var end_time2 = 0;
		var start_time2 = 0;
		var listen = true;
		var time_lapsed = 0;
		var time_remain = 0;

		function handleTick(event) {
			if ((trials > 0) & part.NAME == "test") {
				var time_lapsed = Math.round((new Date() - test_trials)/1000);
				var time_remain = Math.max(NUM_TEST - time_lapsed, 0);

				if (time_remain <= 0) {
					finish();
				}

			}

			if (xonscreen) {
				if (!(part.NAME == "approx")) {
					spc_remind.style.display="inline";

				}
			} else {
				spc_remind.style.display="none";

			}
			if ((xonscreen | boxonscreen) & part.NAME == "test") {
				date = new Date();
				instruct_test.style.display = "inline";
				var tr = "Time remaining: "
				tr = tr + time_remain;
				instruct_test.innerHTML = tr;
			}
			if (keys[13] & !xonscreen & listen) {

					if ((input.value != "") & (!isNaN(input.value))) {

						var start_time2 = new Date();

						end_time2 = new Date() - start_time2;
						input.style.display="none";
						stage.removeAllChildren();
						//stage.update();
						var theAccuracy = accuracy(input.value, nX);
						
						var theScore = score(input.value, nX, end_time1);
						var time_out = 100;
						if (part.NAME == "test") {
							displ.text = "Bonus: $" + theScore;
							total_bonus = total_bonus + theScore;
							//displ.text.fontcolor = "#B0F050";
							//displ.text.color = "green";
							
							displ.x = 400;
							displ.y = 250;
							time_out = 900;
						} else {
							displ.text = "";

						}
       				 	psiTurk.recordTrialData(["Response", all_trials,trials, 
       				 						part.NAME,
       				 						end_time1, end_time2, input.value,
       				 							 nX, theAccuracy, theScore, 
       				 							 total_bonus]);


						//data.push([trials, end_time1, end_time2, input.value, nX, theAccuracy, theScore, "small cue", "small number"]); //end_time2 and answer not working
						//end_time2 shows up as NaN
						//answer shows up as "" even if you comment out the following line
						//xonscreen = true;
						input.value = "";
						//answer = ""; //isn't clearing the text box properly
						stage.addChild(displ);
						stage.update();
						listen = false;
						setTimeout(runSmallTrial, time_out); //fix?
						
						}

	

					}

			else if (part.NAME == "test" | part.NAME == "count") {
				if (part.NAME == "test" & (trials > 0)) {
					date = new Date();
					instruct_test.style.display = "inline";
					var tr = "Time remaining: "
					tr = tr + time_remain;
					instruct_test.innerHTML = tr;
				}

				if (keys[32] & xonscreen & listen) {
					spc_remind.style.display="none";

					xonscreen = false;
					//listen = true;
					var boxonscreen = true;
					end_time1 = new Date() - start_time1;
					stage.removeAllChildren();
					stage.update();

					input.style.display="inline";
					input.focus();
					input.select();

					var start_time2 = new Date();
					//keys[32]=false;
					}

				//find a way to pass start_time2 through to this if statement
				
				}
			   else if (part.NAME == "approx") {



			   		var t_dif = (new Date() - start_time1);
					if (xonscreen &  (t_dif > approx_time)) {
						xonscreen = false;
						end_time1 = t_dif;
						stage.removeAllChildren();
						stage.update();
						input.style.display="inline";
						input.focus();
						input.select();
						var start_time2 = new Date();
					}
				}

				else {
					console.log("why on earth are you here?");
					assert(false);
				}


			}
		if (listen) {
			createjs.Ticker.on("tick", handleTick);
		}
	}

	//};




	var finish = function() {
        //var rez = $("#reason").val();
        //console.log(data);
        //psiTurk.recordTrialData(["Response", data]);
        //finish();

		psiTurk.saveData({
            success: function(){
                psiTurk.completeHIT();
            }, 
            error: function(){var foo=bar;}});
	};

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";


	var canvas = document.getElementById("myCanvas");
	var stage = new createjs.Stage(canvas);
	var displ = new createjs.Text("Score", "28px Arial");
	var input = document.getElementById("box");
	var instruct_test = document.getElementById("instruct_test");
	instruct_test.style.display = "none";
	instruct_test.style.textAlign="center";
	var spc_remind = document.getElementById("spc_remind");
	spc_remind.style.display = "none";

	var listen = true;
	var part = order[order_idx];
	var NUMTRIALS = part.NUM;

	runSmallTrial();

	
	
};

/****************
* Questionnaire *
****************/

var Quest = function() {

	record_responses = function() {

		$('input').each( function(i, val) {
			psiTurk.recordTrialData([this.id, this.value]);
		});
		$('select').each( function(i, val) {
			psiTurk.recordTrialData([this.id, this.value]);		
		});

	};

	//psiTurk.showPage('postquestionnaire.html');
	currentview = new Trial();

    
	
};

var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, 
    	function() { currentview = new Quest(); } 
    );
});

