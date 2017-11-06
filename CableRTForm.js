function submitTicket(){
	//Section below begins to parse the data from the form.
	document.getElementById("notification").innerHTML = "";
	var outputSubject = "Referral  - " + document.getElementById("address").value + ", " +
		document.getElementById("town").value;
	var fields = [];
	fields[0] = document.getElementById("town").value;
	fields[1] = document.getElementById("address").value;
	fields[2] = document.getElementById("pole").value;
	fields[3] = document.getElementById("node").value;
	fields[4] = document.getElementById("name").value;
	fields[5] = document.getElementById("tap").value;
	fields[6] = document.getElementById("contact").value;
	fields[7] = document.getElementById("tech").value;
	fields[8] = document.getElementById("footage").value;
	fields[9] = document.getElementById("description").value;
	var tap = [];
	var gbk = [];
	var cpe = [];
	var channels = [];
	for (i = 0; i < 8; i++){
		tap[i] = Math.round(parseFloat(document.getElementById("tap"+i).value));
		gbk[i] = Math.round(parseFloat(document.getElementById("gbk"+i).value));
		cpe[i] = Math.round(parseFloat(document.getElementById("cpe"+i).value));
	}
	
	for (i = 0; i < 6; i++){
		channels[i] = Math.round(parseFloat(document.getElementById("chn"+i).value));
	}
	channels[6] = 'Downstream';
	channels[7] = 'Upstream';
   
	var rxFreq = parseInt(document.getElementById("rxFreq").value);
	var txFreq = parseInt(document.getElementById("txFreq").value);
	var outputBody = ""; 
	//Section below verifies information is completely filled before proceeding.
	for (i = 0; i < 10; i++){
		if (fields[i].trim() == null || fields[i].trim() == ""){
			document.getElementById("notification").innerHTML = "Please complete the form.";
			return;
		}
	}
	for (i = 0; i < 6; i++){
		if (isNaN(channels[i])){
			document.getElementById("notification").innerHTML = "Please document six forward channels.";
			return;
		}
	}
	if (isChannelDuplicated(channels)){
			document.getElementById("notification").innerHTML = "Forward channels must not be duplicated.";
			return;
	}
	for (i = 0; i < 8; i++){
		if (isNaN(tap[i])){
			document.getElementById("notification").innerHTML = "Please document all required levels.";
			return;
		}
		if (isNaN(gbk[i])){
			document.getElementById("notification").innerHTML = "Please document all required levels.";
			return;
		}
		if (isNaN(cpe[i])){
			document.getElementById("notification").innerHTML = "Please document all required levels.";
			return;
		}
	}
	
	if (isNaN(rxFreq) || isNaN(txFreq)){
		document.getElementById("notification").innerHTML = "Please document Modem frequencies.";
		return;
	}
	if (!document.getElementById("aerial").checked && !document.getElementById("underground").checked){
		document.getElementById("notification").innerHTML = "Please select Aerial or Underground.";
		return;
	}
	
	//Below is the part of the code that prints to the email. 
	outputBody += 
		"Town: " + fields[0] + 
		"\nDate: " + document.getElementById("date").innerHTML + 
		"\nTech # " + fields[7] + 
		"\nAddress: " + fields[1] +
		"\nPole # " + fields[2] +
		"\nNode # " + fields[3] +
		"\nCustomer Name: " + fields[4] +
		"\nTap Value/Ports: " + fields[5] +
		"\nCustomer Contact: " + fields[6] + 
		"\nDrop Style: ";
		if(document.getElementById("aerial").checked) {
			outputBody += "Aerial";
		}else if(document.getElementById("underground").checked) {
			outputBody += "Underground";
		}
		outputBody += 
		"\nDrop Footage: " + document.getElementById("footage").value +
		"\nCable Type: " + document.getElementById("combo").value + "\n";
		
		outputBody += "\nTap\n------------------";
		for (i = 0; i < 6; i++){
			outputBody += "\n" + channels[i] + ":  " + tap[i];
		}
		outputBody += "\n" + channels[6] + " (" + rxFreq + "MHz):  " + tap[6];
		outputBody += "\n" + channels[7] + " (" + txFreq + "MHz):  " + tap[7];
		
		outputBody += "\n\nGround Block\n------------------";
		for (i = 0; i < 6; i++){
			outputBody += "\n" + channels[i] + ":  " + gbk[i];
		}
		outputBody += "\n" + channels[6] + " (" + rxFreq + "MHz):  " + gbk[6];
		outputBody += "\n" + channels[7] + " (" + txFreq + "MHz):  " + gbk[7];
		
		outputBody += "\n\nDevice\n------------------";
		for (i = 0; i < 6; i++){
			outputBody += "\n" + channels[i] + ":  " + cpe[i];
		}
		outputBody += "\n" + channels[6] + " (" + rxFreq + "MHz):  " + cpe[6];
		outputBody += "\n" + channels[7] + " (" + txFreq + "MHz):  " + cpe[7];
		outputBody += "\n\nDescription of Problem:\n" + fields[9] + "\n\n";
			
		sendMail(outputSubject, outputBody);
}

function sendMail(outputSubject, outputBody) {
    var link = "mailto:me@example.com" + "?cc=" + "&subject=" + escape(outputSubject)
		+ "&body=" + escape(outputBody);
    window.location.href = link;
}

function isChannelDuplicated(ch){
		for (i = 0; i < 6; i++){
			for (j = 0; j < 6; j++){
				if (i != j && ch[i] == ch[j]){
					return true;
				}
			}
		}
		return false;
}
