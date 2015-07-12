template = {};
sub = '';

function randomString(length) {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
    return result;
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

// Loads the input file and starts introduction
function initialize()
{	
	// get active template & load data into global variable
	$.getJSON("templates/active.txt", function(input) {
		document.title = input.active + " IAT";
		$.getJSON("templates/"+input.active+"/input.txt", function(data) { 
			template = data;
			$.get("core/instruct0.html", function(data) {
				$("#instructions").html(data);
			});
		});
	});
	
}

function loadInstructions(stage)
{
	switch(stage)
	{
		case 'one':
			if (!(document.getElementById('agree').checked)){
				alert("You must agree with the terms before proceeding.");
				$.get("core/instruct0.html", function(data) {
					$("#instructions").html(data);
				});
			}else{
				$.get("core/instruct1.html", function(data) {
						$("#instructions").html(data);
					});
			}
			break;
		case 'two':
			sub = $("#subID").val().trim();
			sub2 = $("#subID_confirm").val().trim();
				if((sub != "") && (sub2 != "") && (sub == sub2) && isValidEmailAddress(sub)) {
					$.get("core/instruct2.html", function(data) {
						$("#instructions").html(data);
					});
				
				}else if (sub == "" || sub2 == ""){
					alert("Please fill out all fields.");
					$.get("core/instruct1.html", function(data) {
						$("#instructions").html(data);
						$("#subID").val(sub);
						$("#subID_confirm").val(sub2);
					});
				}
				else if (sub != sub2) {
					alert("Emails do not match.");
					$.get("core/instruct1.html", function(data) {
						$("#instructions").html(data);
						$("#subID").val(sub);
						$("#subID_confirm").val(sub2);
					});
				}else if (!isValidEmailAddress(sub)){
					alert("Please enter a valid email address.");
					$.get("core/instruct1.html", function(data) {
						$("#instructions").html(data);
						$("#subID").val(sub);
						$("#subID_confirm").val(sub2);
					});
				}
			break;
		case 'three':
			$.get("core/instruct3.html", function(data) {
				$("#instructions").html(data);
			});
			break;

		case 'four':
			$.get("core/instruct4.html", function(data) {
				$("#instructions").html(data);
				
				$("#clabel1").html(template.cat1.label);
		        $("#clabel2").html(template.cat2.label);
		        $("#clabelA").html(template.catA.label);
		        $("#clabelB").html(template.catB.label);
		        if (template.cat1.itemtype == "txt")
		            { $("#citems1").html(template.cat1.items.join(", ")); }
		        else if (template.cat1.itemtype == "img")
		            { $("#citems1").html("Images of "+template.cat1.label); }
		        if (template.cat2.itemtype == "txt")
		            { $("#citems2").html(template.cat2.items.join(", ")); }
		        else if (template.cat2.itemtype == "img")
		            { $("#citems2").html("Images of "+template.cat2.label); }
		        if (template.catA.itemtype == "txt")
		            { $("#citemsA").html(template.catA.items.join(", ")); }
		        else if (template.catA.itemtype == "img")
		            { $("#citemsA").html("Images of "+template.catA.label); }
		        /*if (template.catB.itemtype == "txt")
		            { $("#citemsB").html(template.catB.items.join(", ")); }*/
		        else if (template.catB.itemtype == "img")
		            { $("#citemsB").html("Images of "+template.catB.label); }
			});
			break;
		case 'IAT':
			$.get("core/IAT.html", function(data) {
				$('body').html(data);
				document.onkeypress = keyHandler; 
				startIAT();
			});
			break;
	}
}

// Initialize variables, build page & data object, display instructions
function startIAT()
{
	currentState = "instruction";
	session = 1;
	instruct_num = 1;
	roundnum = 0;
	loopnum = 0;
	total_errors = 0;
	total_non_resp = 0;
	pause = false;
	sum_resp_time = 0;
	
	// default to show results to participant
	if (!('showResult' in template))
	{
	    template.showResult = "show";
	}
	
	buildPage();
	roundArray = initRounds();
    instructionPage();
    
}

// Adds all images to page (initially hidden) so they are pre-loaded for IAT
function buildPage()
{
	if (template.catA.itemtype == "img")
	{
		for (i in template.catA.items)
		{
			var itemstr = '<img id="'+template.catA.datalabel+i+'" class="IATitem" src="templates/'+template.name+'/img/'+template.catA.items[i]+'">';
			$("#exp_instruct").after(itemstr);
		}
	}
	if (template.catB.itemtype == "img")
	{
		for (i in template.catB.items)
		{
			var itemstr = '<img id="'+template.catB.datalabel+i+'" class="IATitem" src="templates/'+template.name+'/img/'+template.catB.items[i]+'">';
			$("#exp_instruct").after(itemstr);
		}
	}
	if (template.cat1.itemtype == "img")
	{
		for (i in template.cat1.items)
		{
			var itemstr = '<img id="'+template.cat1.datalabel+i+'" class="IATitem" src="templates/'+template.name+'/img/'+template.cat1.items[i]+'">';
			$("#exp_instruct").after(itemstr);
		}
	}
	if (template.cat2.itemtype == "img")
	{
		for (i in template.cat2.items)
		{
			var itemstr = '<img id="'+template.cat2.datalabel+i+'" class="IATitem" src="templates/'+template.name+'/img/'+template.cat2.items[i]+'">';
			$("#exp_instruct").after(itemstr);
		}
	}
}

// Round object
function IATround()
{
	this.starttime = 0;
	this.endtime = 0;
	this.itemtype = "none";
	this.category = "none";
	this.catIndex = 0;
	this.correct = 0;
	this.errors = 0;
	this.non_resp = 0;
}

// Create array for each session & round, with pre-randomized ordering of images
function initRounds()
{
    var roundArray = [];
    // for each session
    for (var i=0; i<6; i++)
    {
        roundArray[i] = [];
        var numSpartan;
        var numImp;
        var numUnimp;
        switch (i)
        {
            case 0:
            case 1:
            	numSpartan = 7;
            	numImp = 7;
            	numUnimp = 10;
                numrounds = 24;
                break;
            case 2:
            	numSpartan = 21;
            	numImp = 21;
            	numUnimp = 30;
                numrounds = 72;
                break;
            case 3:
            	numSpartan = 7;
            	numImp = 10;
            	numUnimp = 7;
                numrounds = 24;
            	break
            case 4:
            	numSpartan = 21;
            	numImp = 21;
            	numUnimp = 30;
            	numrounds = 72;
                break;
            
        }
		prevIndexA = -1; prevIndex1 = -1;
        for (var j = 0; j<numrounds; j++)
        {

            var round = new IATround();


            // randomly choose category
            var randNum = Math.random();

            if (randNum < 0.25){
            	if (numSpartan > 0){
            		round.category = template.catA.datalabel;
            		numSpartan--;
            	}else if (numImp > 0){
            		round.category = template.cat1.datalabel;
            		numImp--;
            	}else if (numUnimp > 0){
            		round.category = template.cat2.datalabel;
            		numUnimp--;
            	}
            } else if (randNum < 0.5 ){
            	if (numImp > 0){
            		round.category = template.cat1.datalabel;
            		numImp--;
            	}else if (numSpartan > 0){
            		round.category = template.catA.datalabel;
            		numSpartan--;
            	}else if (numUnimp > 0){
            		round.category = template.cat2.datalabel;
            		numUnimp--;
            	}
            } else {
            	if (numUnimp > 0){
            		round.category = template.cat2.datalabel;
            		numUnimp--;
            	}else if (numSpartan > 0){
            		round.category = template.catA.datalabel;
            		numSpartan--;
            	}else if (numImp > 0){
            		round.category = template.cat1.datalabel;
            		numImp--;
            	}
            }







            //if (j % 2 == 0) { round.category = template.catA.datalabel; }
				//else { round.category = (Math.random() < 0.5 ? template.cat1.datalabel : template.cat2.datalabel); }
        	// pick a category
        	if (round.category == template.catA.datalabel) 
        	{ 
				round.itemtype = template.catA.itemtype;
				if (i < 3) { round.correct = 1; }
				else { round.correct = 2; }
				
				// pick an item different from the last
				do 
					{ round.catIndex = Math.floor(Math.random()*template.catA.items.length); }
	        	while (prevIndexA == round.catIndex)
	        	prevIndexA = round.catIndex;
        		
        	}
        	/*else if (round.category == template.catB.datalabel)
        	{ 
				round.itemtype = template.catB.itemtype;
				if (i < 4) { round.correct = 2; }
				else { round.correct = 1; }
				// pick an item different from the last
				do
	        	    { round.catIndex = Math.floor(Math.random()*template.catB.items.length); }
	        	while (prevIndexA == round.catIndex)
	        	prevIndexA = round.catIndex;
        	}*/
        	else if (round.category == template.cat1.datalabel)
        	{ 
				round.itemtype = template.cat1.itemtype;
        		round.correct = 1;
				// pick an item different from the last
				do
	        	    { round.catIndex = Math.floor(Math.random()*template.cat1.items.length); }
	        	while (prevIndex1 == round.catIndex)
	        	prevIndex1 = round.catIndex;
        	}
        	else if (round.category == template.cat2.datalabel)
        	{ 
				round.itemtype = template.cat2.itemtype;
        		round.correct = 2;
				// pick an item different from the last
				do
	        	    { round.catIndex = Math.floor(Math.random()*template.cat2.items.length); }
	        	while (prevIndex1 == round.catIndex)
	        	prevIndex1 = round.catIndex;
        	}	
        	
        	roundArray[i].push(round);
        }

        var nSpart = 0;
    	var nImp = 0;
    	var nUnimp = 0;
    	for (var k=0; k < roundArray[i].length; k++){
    		if (roundArray[i][k].category == template.catA.datalabel){
    			nSpart++;
    		} else if (roundArray[i][k].category == template.cat1.datalabel){
    			nImp++;
    		} else if (roundArray[i][k].category == template.cat2.datalabel) {
    			nUnimp++;
    		}
    	}

    	console.log("Spartan: "+nSpart);
    	console.log("Important: "+nImp);
    	console.log("Unimportant: "+nUnimp);
    }
    
    return roundArray;
}

// insert instruction text based on stage in IAT
function instructionPage()
{	
	switch (instruct_num)
    {
		case 1:
			$("#left_cat").html(template.cat1.label+'<br>or<br>'+template.catA.label);
			$("#right_cat").html(template.cat2.label);
			break;
        case 2: 
        	$("#left_cat").html(template.cat1.label+'<br>or<br>'+template.catA.label);
			$("#right_cat").html(template.cat2.label);
			break; 

        case 3:
			$("#left_cat").html(template.cat1.label+'<br>or<br>'+template.catA.label);
			$("#right_cat").html(template.cat2.label);
            break;
        case 4:
        	$("#left_cat").html(template.cat1.label+'<br>or<br>'+template.catA.label);
			$("#right_cat").html(template.cat2.label);
            break;
        case 5:
        	$("#left_cat").html(template.cat1.label);
			$("#right_cat").html(template.cat2.label+'<br>or<br>'+template.catA.label);
            break;
        case 6:
        	$("#left_cat").html(template.cat1.label);
			$("#right_cat").html(template.cat2.label+'<br>or<br>'+template.catA.label);
        	break
        case 7:
        	$("#left_cat").html(template.cat1.label);
			$("#right_cat").html(template.cat2.label+'<br>or<br>'+template.catA.label);
        	break;
        case 8:
        	$("#left_cat").html(template.cat1.label);
			$("#right_cat").html(template.cat2.label+'<br>or<br>'+template.catA.label);
        	break;
        case 9:
        	break;
    }
	if (instruct_num == 9)
	{
		$("#left_cat").html("");
		$("#right_cat").html("");
		$("#exp_instruct").html("<img src='core/spinner.gif'>");
		$.post("core/fileManager.php", { 'op':'checkdb', 'template':template.name }, 
 			function(checkdb) {
				if(checkdb == "success")
				{
				WriteDatabase();
				}
				else
				{
				WriteFile();
				}
			});	
		if(template.showResult == "show")
		{
		    calculateIAT();
		}
		else
		{
			var avg_resp_time = sum_resp_time / 192;
		    resulttext = "<div style='text-align:center;padding:20px'><p>Thanks for participating!</p>"+
        "<p>We will be back in touch with you in about 6 weeks to tell you more about this study and what your performance on this measures reflects about your motivation.  Thanks again.</p>"+
        "<p>Total errors: "+total_errors+"</p><p>Average Response Time: "+Math.round((avg_resp_time/1000) * 100)/100+" seconds</p></div>";
		    $("#picture_frame").html(resulttext);
        $('#under_instruct').hide();
		}
	}
	else
	{
			pause = true;
			$.get("core/gInstruct"+(instruct_num)+".html", function(data) { $('#exp_instruct').html(data); });
			$('#under_instruct').hide();
	}
}

// Calculates estimate of effect size to present results to participant
function calculateIAT()
{
    // calculate mean log(RT) for first key trial
	compatible = 0;
	for (i=1; i<roundArray[3].length; i++)
	{
		score = roundArray[3][i].endtime - roundArray[3][i].starttime;
		if (score < 300) { score = 300; }
		if (score > 3000) { score = 3000; }
		compatible += Math.log(score);
	}
	compatible /= (roundArray[3].length - 1);
	
	// calculate mean log(RT) for second key trial
	incompatible = 0;
	for (i=1; i<roundArray[6].length; i++)
	{
		score = roundArray[6][i].endtime - roundArray[6][i].starttime;
		if (score < 300) { score = 300; }
		if (score > 3000) { score = 3000; }
		incompatible += Math.log(score);
	}
    incompatible /= (roundArray[6].length - 1);
    
    // calculate variance log(RT) for first key trial
    cvar = 0;
	for (i=1; i<roundArray[3].length; i++)
	{
		score = roundArray[3][i].endtime - roundArray[3][i].starttime;
		if (score < 300) { score = 300; }
		if (score > 3000) { score = 3000; }
	    cvar += Math.pow((Math.log(score) - compatible),2);
	}
	
	// calculate variance log(RT) for second key trial
	ivar = 0;
	for (i=1; i<roundArray[6].length; i++)
	{
		score = roundArray[6][i].endtime - roundArray[6][i].starttime;
		if (score < 300) { score = 300; }
		if (score > 3000) { score = 3000; }
	    ivar += Math.pow((Math.log(score) - incompatible),2);
	}
	
	// calculate t-value
	tvalue = (incompatible - compatible) / Math.sqrt(((cvar/39) + (ivar/39))/40);
    
    // determine effect size from t-value and create corresponding text
	if (Math.abs(tvalue) > 2.89) { severity = " <b>much more</b> than "; }
	else if (Math.abs(tvalue) > 2.64) { severity = " <b>more</b> than "; }	
	else if (Math.abs(tvalue) > 1.99) { severity = " <b>a little more</b> than "; }
	else if (Math.abs(tvalue) > 1.66) { severity = " <b>just slightly more</b> than "; }
	else { severity = ""; }
	
	// put together feedback based on direction & magnitude
	if (tvalue < 0 && severity != "")
    { 
        resulttext = "<div style='text-align:center;padding:20px'>You associate "+template.catB.label+" with "+template.cat1.label;
        resulttext += " and "+template.catA.label+" with "+template.cat2.label+severity;
        resulttext += "you associate "+template.catA.label+" with "+template.cat1.label;
        resulttext += " and "+template.catB.label+" with "+template.cat2.label+".</div>"; 
        // resulttext += "<div>incompatible: "+incompatible+" ("+(ivar/39)+"); compatible: "+compatible+" ("+(cvar/39)+"); tvalue: "+tvalue+"</div>";
    }
    else if (tvalue > 0 && severity != "")
    { 
        resulttext = "<div style='text-align:center;padding:20px'>You associate "+template.catA.label+" with "+template.cat1.label;
        resulttext += " and "+template.catB.label+" with "+template.cat2.label+severity;
        resulttext += "you associate "+template.catB.label+" with "+template.cat1.label;
        resulttext += " and "+template.catA.label+" with "+template.cat2.label+".</div>"; 
        // resulttext += "<div>incompatible: "+incompatible+" ("+(ivar/39)+"); compatible: "+compatible+" ("+(cvar/39)+"); tvalue: "+tvalue+"</div>";
    }
    else
    { 
        resulttext = "<div style='text-align:center;padding:20px'>You do not associate "+template.catA.label;
        resulttext += " with "+template.cat1.label+" any more or less than you associate ";
        resulttext += template.catB.label+" with "+template.cat1.label+".</div>"; 
        // resulttext += "<div>incompatible: "+incompatible+" ("+(ivar/39)+"); compatible: "+compatible+" ("+(cvar/39)+"); tvalue: "+tvalue+"</div>";
    }
	$("#picture_frame").html(resulttext);
}

// not currently used
function groupEvaluations()
{
	$('#demoglist').after(
		"Please rate how warm or cold you feel toward the following groups:\
		<br>\
		(0 = coldest feelings, 5 = neutral, 10 = warmest feelings)\
		<ol>\
		<li>\
		<p>"+template.catA.label+"</p>\
		<p>\
		<select id='catAwarm' name='catAwarm'> \
		<option value='unselected' selected='selected'></option>\
		<option value='0 coldest feelings'></option>\
		<option value='1'></option>\
		<option value='2'></option>\
		<option value='3'></option>\
		<option value='4'></option>\
		<option value='5 neutral'></option>\
		<option value='6'></option>\
		<option value='7'></option>\
		<option value='8'></option>\
		<option value='9'></option>\
		<option value='10 warmest feelings'></option>\
		</select>\
		</p> \
		</li>\
		<li>\
		<p>"+template.catB.label+"</p>\
		<p>\
		<select id='catBwarm' name='catBwarm'> \
		<option value='unselected' selected='selected'></option>\
		<option value='0 coldest feelings'></option>\
		<option value='1'></option>\
		<option value='2'></option>\
		<option value='3'></option>\
		<option value='4'></option>\
		<option value='5 neutral'></option>\
		<option value='6'></option>\
		<option value='7'></option>\
		<option value='8'></option>\
		<option value='9'></option>\
		<option value='10 warmest feelings'></option>\
		</select>\
		</p> \
		</li>\
		</ol>\
		");
}

function IsNumeric(input)
{
   return (input - 0) == input && input.length > 0;
}

// not currently used
function checkDemographics()
{
    gender = $("input[name=gender]:checked").val();
    age = $("#age option:selected").val();
    loc = $("#loc option:selected").val().replace(/[^A-Za-z0-9,]/g,' ');
    races = [];
	$("input[name=race]:checked").each(function() { races.push($(this).val()); });
    income = $("#income").val();
    education = $("#edu option:selected").val();
    
    // alert(income+"\n"+parseFloat(income)+"\n");
    // $.get('getLocation.php', 
    //         { 'q': loc},
    //         function(data) {
    //             alert(data);
    //         });
    
	// Do validation of input
    var error = false;
    var errmsg = "";
    
    if(gender==null)
    {
        error=true;
        errmsg += "<div class='error'>Please choose an option for gender</div>";
    }    
	if(age=="unselected")
    {
        error=true;
        errmsg += "<div class='error'>Please state the year you were born</div>";
    }
	if(loc.length == 0)
    {
        error=true;
        errmsg += "<div class='error'>Please indicate your current location</div>";
    }
    if(races==null)
    {
        error=true;
        errmsg += "<div class='error'>Please indicate your ethnicity</div>";
    }
    if(income==null || $.trim(income) != income.replace(/[^0-9$.,]/g,'') || !IsNumeric(income.replace(/[^0-9.]/g,'')))
    {
        error=true;
        errmsg += "<div class='error'>Please enter a valid number for income</div>";
    }
    if(education=="unselected")
    {
        error=true;
        errmsg += "<div class='error'>Please indicate your highest level of education</div>";
    }
	if(sub.length == 0)
    {
        error=true;
        errmsg += "<div class='error'>Please enter a valid identifier</div>";
    }
	// Output error message if input not valid
    if(error==false)
    {
		subject = sub;
        var demos = gender+'\t';
        demos += age+'\t';
        demos += loc+'\t';
        demos += races.join(',')+'\t';
        demos += income.replace(/[^0-9.]/g,'')+'\t';
        demos += education+'\n';
	    $.post("core/writeFile.php", { 'subject': subject, 'src': "survey", 'data': demos }, function() {location.href = 'instruct2.php?sub='+sub;});
    }
    else
    {
        $('#error-1').html(errmsg);
    }
}


// Converts the data for each session and round into a comma-delimited string
// and passes it to writeFile.php to be written by the server
function WriteFile()
{
	
	var subject = sub;
	subject = subject.length==0 ? "unknown" : subject;
	var str = "";
	for (i=1; i<5; i++)
	{
		for (j=0;j<roundArray[i].length;j++)
		{
			str += i + "," + j + ",";
	        str += roundArray[i][j].category+",";
			str += roundArray[i][j].catIndex+",";
			str += roundArray[i][j].errors+",";
			str += (roundArray[i][j].endtime - roundArray[i][j].starttime)+"\n";
			var catIndex=roundArray[i][j].catIndex;
			var category=roundArray[i][j].category;
			var datai=i;
			var dataj=j;
			var mseconds=(roundArray[i][j].endtime - roundArray[i][j].starttime);
			
		}
	}
	
	
    $.post("core/fileManager.php", { 'op':'writeoutput', 'template':template.name, 
 			'subject': subject, 'data': str });	
 	
	// notify user of success?
}
function WriteDatabase()
{
	
	var subject = sub;
	subject = subject.length==0 ? "unknown" : subject;
	var str = "";
	for (i=0; i<roundArray.length; i++)
	{
		for (j=0;j<roundArray[i].length;j++)
		{
			str += i + "," + j + ",";
	        str += roundArray[i][j].category+",";
			str += roundArray[i][j].catIndex+",";
			str += roundArray[i][j].errors+",";
			str += (roundArray[i][j].endtime - roundArray[i][j].starttime)+"\n";
			var catIndex=roundArray[i][j].catIndex;
			var category=roundArray[i][j].category;
			var datai=i;
			var dataj=j;
			var mseconds=(roundArray[i][j].endtime - roundArray[i][j].starttime);
			//$.post("core/fileManager.php", { 'op':'writedatabase', 'template':template.name, 
 			//'subject': subject, 'data': str,'catindex':catIndex, 'category':category, 'datai':datai });
			$.post("core/fileManager.php", { 'op':'writedatabase', 'template':template.name, 
 			'subject': subject, 'data': str, 'datai':i, 'dataj':j,'category':roundArray[i][j].category, 'catindex':roundArray[i][j].catIndex,
 			'errors':roundArray[i][j].errors, 'mseconds':(roundArray[i][j].endtime - roundArray[i][j].starttime) });
		}
	}
	
 	
	// notify user of success?
}



// This monitors for keyboard events
function keyHandler(kEvent)
{   
	// move from instructions to session on spacebar press
	var unicode;
	if (!kEvent) var kEvent = window.event;
	if (kEvent.keyCode) unicode = kEvent.keyCode;
	else if (kEvent.which) unicode = kEvent.which;
	if (currentState == "instruction" && unicode == 32)
    {
    	$('#under_instruct').show();
		currentState = "play";
		$('#exp_instruct').html('');
		displayItem();
    }
	// in session
	if (currentState == "play")
	{
		runSession(kEvent);
	}
}

// Get the stimulus for this session & round and display it
function displayItem()
{
	if (typeof tooSlowVar !== 'undefined') {
		clearTimeout(tooSlowVar);
	}
	tooSlowVar = setTimeout(tooSlow, 1500);
	pause = false;

	var tRound = roundArray[session][roundnum]; 
	tRound.starttime = new Date().getTime(); // the time the item was displayed
	
		if (tRound.category == template.catA.datalabel)
		{ 
			$("#word").html(template.catA.items[tRound.catIndex])
			$("#word").css("display","block"); 
		}
		else if (tRound.category == template.catB.datalabel)
		{ 
			$("#word").html(template.catB.items[tRound.catIndex])
			$("#word").css("display","block"); 
		}
		else if (tRound.category == template.cat1.datalabel)
		{ 
			$("#word").html(template.cat1.items[tRound.catIndex])
			$("#word").css("display","block"); 
		}
		else if (tRound.category == template.cat2.datalabel)
		{ 
			$("#word").html(template.cat2.items[tRound.catIndex])
			$("#word").css("display","block"); 
		}
	
	//tooSlowVar = setTimeout(tooSlow, 1500);
}

function tooSlow() {
	if (!pause){
		pause = true;
		$("#tooslow").css("display", "block");
		total_non_resp++;
		roundArray[session][roundnum].non_resp++; // note error
		setTimeout(step, 2000);
	}
}

function step(){

	if (currentState == "play") {
		pause = false;
		$("#tooslow").css("display", "none");
		$("#wrong").css("display","none"); // remove X if it exists
			roundArray[session][roundnum].endtime = new Date().getTime(); // end time
			sum_resp_time += roundArray[session][roundnum].endtime - roundArray[session][roundnum].starttime;
			// if less than 24 trials run in a row
			if (loopnum < 23) {
				loopnum++;
				roundnum++;
				console.log(roundnum);
				$(".IATitem").css("display","none"); // hide all items
				displayItem(); // display chosen item
			} else {
	    		$(".IATitem").css("display","none"); // hide all items
	    		if (roundnum >= roundArray[session].length-1){
	    			session++; // move to next session
	    			console.log(session);
					roundnum = 0; // reset rounds to 0
				}else{
					roundnum++;
					console.log(roundnum);
				}
					loopnum = 0;
					instruct_num++;
					currentState = "instruction"; // change state to instruction
					instructionPage(); // show instruction page
			}
	}
}

function runSession(kEvent)
{
	if (currentState == "play") {
		//tooSlowVar = setTimeout(tooSlow, 1500);
		var rCorrect = roundArray[session][roundnum].correct;
		var unicode = kEvent.keyCode? kEvent.keyCode : kEvent.charCode;
		keyZ = (unicode == 122 || unicode == 90 );
		keyPeriod = (unicode == 46 || unicode == 190 );
			
		if (!pause){
			// if correct key (1 & E) or (2 & I)
			if ((rCorrect == 1 && keyZ) || (rCorrect == 2 && keyPeriod)) {
				console.log("correct");
				clearTimeout(tooSlowVar);
        pause = true;
				setTimeout(step, 300);
			}
			// incorrect key
			else if ((rCorrect == 1 && keyPeriod) || (rCorrect == 2 && keyZ)) {
				pause = true;
				$("#tooslow").css("display", "none");
				$("#wrong").css("display","block"); // show X
				roundArray[session][roundnum].errors++; // note error
				total_errors++;
				clearTimeout(tooSlowVar);
				setTimeout(step, 2000);
			}
		}
	}


}
