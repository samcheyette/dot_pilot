/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}



var shapes = {name:'shape', feats:['triangle', 'square']};
var sizes = {name:'size', feats:['big', 'small']};
var colors = {name:'color', feats:['red', 'blue']};
var filling = {name:'filling', feats:['striped', 'not_striped']};
var dimen = {name:"dimen", feats:["wide", "tall"]}

var dims = [shapes, sizes, colors, filling, dimen];
var trial = 0;
var post_q = false;


var add_dim = function(obs, dim) {
	var new_objs = [];
	var len = obs.length;
	for (var o=0; o < len; o++) {
		var new_o = clone(obs[o]);
		for (var f=0; f < dim.feats.length; f++) {
			new_o[dim.name] = dim.feats[f];
			new_objs[new_objs.length] = clone(new_o);
		}
	}
	return(new_objs);
}

var objs = [{}];
var len_d = dims.length;
for (var d=0; d<len_d;d++) {
	dim = dims[d];
	objs = add_dim(objs, dim);
}

//shuffle up the images
shuffled=_.shuffle(objs);

//randomly choose 1 obj to be a blicket
var blicket = objs[Math.floor(Math.random() * objs.length)];

//pop one off the top of the shuffled list
console.log(shuffled);
var stimuli = shuffled.shift();
console.log(blicket);


// END OF STIMULI XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


var psiTurk = PsiTurk(uniqueId, adServerLoc);

var mycondition = condition;  
var mycounterbalance = counterbalance;

var bl_str = "";
for (var d=0; d<dims.length; d++) {
	var nm = "blicket " + dims[d].name;
	var bl_dm = blicket[dims[d].name];
	bl_str = bl_str + bl_dm + ', ';

}

psiTurk.recordTrialData(["blicket",bl_str]);

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
	var startTime = 0;
	var stim = null;
	var listen = false;
	var last_trial = false;
    var impq = false;

	var gs = function gradientString(colors, step) {
	    var gradient = '45-' + colors[0],
	        stripe = false,
	        len = colors.length,
	        i;
	    
	    for (i = 0; i < 100/step; i += 1) {
	        gradient += '-' + colors[i % len] + ':' + i * step + '-' + colors[(i+1) % len] + ':' + i * step;
	    }
	    
	    return gradient;
	}

    var create_obj = function(object, place){
		//var c = place.rect(10, 10, 50, 50);
    	if (object.size == "big") {
    		var height = 100;
    		var width = 50;
    		var x_start = 50;
    		var y_start = 0;
    		//var string_shape = "m0 0";

    	} else {
    		//var string_shape = "m25 0";
    		var height = 50;
    		var width = 25;
    		var x_start = 50;
    		var y_start = 25;

    	}


    	if (object.shape == "square") {
    		var obj = place.rect(x_start, y_start, width, height);
    		//obj.glow()
    		//string_shape = string_shape + " h" + height.toString();
    		//string_shape = string_shape + " v" + width.toString();
    		//string_shape = string_shape + " h-" + height.toString();
    		//string_shape = string_shape + " v-" + width.toString();
    	} else {
    		//string_shape = string_shape + " h" + height.toString();
    		//string_shape = string_shape + " h" + height.toString();
    		//string_shape = string_shape + " v" + width.toString();
    		var obj = place.ellipse(x_start + width/2, y_start + height/2, width/2.2, height/2.2);
    		//string_shape = string_shape + " v" + width.toString();
    	}
		//var obj = place.path(string_shape);

		if (new String(object.color).valueOf() == new String("blue").valueOf()) {
			obj.attr("fill", "blue");
			if (object.filling == "striped") {
				obj.attr("fill", gs(["black", "blue"], 5));

			}

		} else {
			obj.attr("fill", "red");
			if (object.filling == "striped") {
				obj.attr("fill", gs(["black", "red"], 5));

			}

		}


		if (object.dimen == "wide") {
			obj.rotate(90);
		}

		//obj.attr("fill", "fff");

		//obj.attr("type", "rect");




    }
	
	var next = function(){

		if (trial == 0) {
			create_obj(blicket, bl_place);

		} else {
			//string_shape2 = "m0 0";
	    	//string_shape2 = string_shape2 + " h100";
	    	//string_shape2 = string_shape2 + " v100";
	    	//string_shape2 = string_shape2 + " h-100";
	    	//string_shape2 = string_shape2 + " v-100";
	    	//var obj = stage.path(string_shape2);
	    	var obj = stage.rect(0, 0, 160, 160);
	    	obj.attr("fill", "white");
	    	obj.attr("stroke", "white");

			create_obj(blicket, bl_place);
			create_obj(stimuli, stage);
		}

        listen=true;
        startTime= new Date().getTime();


        
	};

	var response_handler = function(e){
        if (!listen) return;
        var keyCode = e.keyCode;
        var response = "";
		sub.onclick=function(){
			var r = $("#reason").val();
			console.log(r.length);
			if (last_trial == true) {
				if (r.length < 3) {
					alert("You're missing an answer!"); 
				} else {
					finish();

				}

			}

		};

        switch (keyCode) {
            case 89:
                // Y
                response = "Y";
                break;
            case 78:
                // N
                response = "N";
                break;
            case 13:
                 //Enter
		         response = "Enter";
		        break;
		
            default:
                response = "";
                break;
        }
        if ((response == "Y" || response == "N") && !last_trial && !(trial==0)) {
                listen = false;
                var rt =  new Date().getTime() - startTime;
                var st_str = "";
				for (var d=0; d<dims.length; d++) {
					//var nm = "blicket " + dims[d].name;
					var st_dm = stimuli[dims[d].name];
					st_str = st_str + st_dm + ', ';

				}

				psiTurk.recordTrialData(["stimulus",st_str, response, rt]);
		        if (shuffled.length == 1) {
					last_trial = true;
					//post_q = true;
		        	//finish();
		        }
                stimuli = shuffled.shift();

                next();
        } else if ((trial==0) && (response == "Enter")) {
                listen = false;
                var rt =  new Date().getTime() - startTime;	
				trial++;


				middle_body.innerHTML="Is this a blicket?";
				//middle_body.style.display = 'inline';
				bottom_head.style.display = 'inline';
                next();
        } else if   (shuffled.length == 0 && 
        			(response == "Y" || response == "N") && 
        			(post_q == false)) {
				bottom_head.style.display = 'none';
				post_q = true;
				canvas.style.display = 'none';


				mb_text = "You've now completed the main part of the experiment. ";
				mb_text = mb_text + "The final task: tell us in words what you think the rule is for 'being a blicket'? "
				mb_text = mb_text + "You may also leave any comments about the task you have in this same box."
				middle_body.innerHTML=mb_text;
				middle_body.style.font = '20px arial';
				spek.style.display = 'inline';
				//spek.innerHTML = mb_text;
				next();

        }

        //else if   (shuffled.length == 0 && 
        			//(response == "Enter") && 
        			//(post_q == true)) {

        	//	finish();

        //}
	};


    $("body").focus().keydown(response_handler);




	var finish = function() {
        var rez = $("#reason").val();
        psiTurk.recordTrialData(["Response", rez]);
        //finish();
		psiTurk.saveData({
            success: function(){
                psiTurk.completeHIT();
            }, 
            error: function(){var foo=bar;}});
	};

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	psiTurk.showPage('stage.html');

	var top_head = document.getElementById('top_head');
	var bottom_head = document.getElementById('bottom_head');
	var middle_body = document.getElementById('middle_body');
	var mb_text = "You are now going to see some other objects, which ";
	mb_text = mb_text + "vary in shape, size, stripeness, and color. "
	mb_text = mb_text + "Based on their features, it is your job to determine whether "
	mb_text = mb_text + "they are also blickets. \n"
	mb_text = mb_text + "Press enter to begin."
	middle_body.innerHTML=mb_text;
	middle_body.style.font = '24px arial';
	bottom_head.style.font = '24px arial';
	top_head.style.font = '24px arial';

	//middle_body.style.display = 'none';
	bottom_head.style.display = 'none';
	var subm = document.getElementById('sub');

	var spek = document.getElementById('special_k');
	var stage = Raphael(document.getElementById('canvas'),160,160);
	stage.canvas.style.borderColor = "white";
	var bl_place = Raphael(document.getElementById('blicket'),160,160);
	bl_place.canvas.style.borderColor = "white";
	next();

	
	
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

