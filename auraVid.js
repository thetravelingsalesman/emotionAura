var cap;
var dataOnPage ;
var balls=[];
var emotionColorDictionary;
var feelings =['disgust','joy','anger','sadness','fear'];
var checkboxMetaData;
var checkboxFeaturePoints;
var checkboxBalls;
var checkboxRadialAura;
var checkboxEmoji;

var emotionRecords ;



function setup() {
  createCanvas(640, 480);
  cap = createCapture(VIDEO);
  cap.hide();
  //rectMode(CENTER);
  noStroke();
  emotionColorDictionary = {'engagement':color(40,40,40), 'disgust': color(10,10,10), 
  'joy':color(246,122,0) , 'anger': color(255,0,0) , 'engagement': color(0,255,0) ,
  'sadness': color(0,0,255) , 'surprise': color(124,125,0) ,'fear': color(0,100,100),
  'contempt':color(255,255,255)};
  emotionRecords = [];

checkboxMetaData = createCheckbox('Appearance');
checkboxMetaData.checked(false); // passing in an arg sets its state?
// checkboxMetaData.changed(myCheckedEvent); can trigger function if we want to
checkboxFeaturePoints = createCheckbox('Feature Points');
checkboxFeaturePoints.checked(false); // passing in an arg sets its state?

checkboxBalls = createCheckbox('Ball Visualization');
checkboxBalls.checked(false); // passing in an arg sets its state?

checkboxRadialAura = createCheckbox('Radial Aura');
checkboxRadialAura.checked(true); // passing in an arg sets its state?

checkboxEmoji = createCheckbox('Emoji');
checkboxEmoji.checked(false); // passing in an arg sets its state?


}



function draw() {

var emotionData =  $('#dataHolder').html() ;
dataOnPage = JSON.parse(emotionData);

 //console.log(dataOnPage);
  // background(50);
  // fill(255);
  // cap.loadPixels();
  
//image(cap, mouseX, mouseY, 160, 120);
image(cap, 0,0, cap.width, cap.height);
strokeWeight(5);


	if( dataOnPage.length >0 && dataOnPage[0].hasOwnProperty('emotions')){ //only if got response back
		for (var i = 0 ; i< dataOnPage.length; i++){
			faceData =dataOnPage[i];
			faceData.millis = millis();

			emotionRecords.push(faceData);

			features = faceData.featurePoints;
			if (checkboxBalls.checked()) {
				updateBalls();
				makeEmotionBalls(faceData);
			}
			if (checkboxFeaturePoints.checked()) { drawFeaturePoints(features , 3);}

			if (checkboxRadialAura.checked()){
				var featurePointsObject = faceData.featurePoints;
				var center = getThirdEye(featurePointsObject);
				for (var k = emotionRecords.length -1 ; k > 0; k--){
					makeAuraTimeStep(emotionRecords[k],  300 - 5*k , center.x , center.y );
					}

				if(emotionRecords.length>50){ emotionRecords.shift();}

			} // end radial checkbox
			if (checkboxMetaData.checked()) { displayMetaData(faceData);}
			

			if (checkboxEmoji.checked()) { displayEmoji(faceData);}


		}

	}
	colorKey();
}

function makeEmotionBalls(faceData){

	var featurePoints =faceData.featurePoints;
	var thirdEye = getThirdEye(featurePoints);
	var emotionsObject = faceData.emotions;

	for (var j = 0 ; j< feelings.length; j++){
		if(emotionsObject.hasOwnProperty(feelings[j])){
			var key = feelings[j];

			//console.log(key);
			var value = emotionsObject[key];
			if(value>20){
				balls.push(new Ball( thirdEye.x , thirdEye.y -100 ,10,key) );
			}
		}

	}


}


function drawFeaturePoints(featurePointsObject , diameter){
	
	for( var i = 0 ; i<Object.keys(featurePointsObject).length;i++){
		var x = featurePointsObject[i].x;
		var y = featurePointsObject[i].y;
		fill(10);
		ellipse(x,y,diameter,diameter);
		text(i,x,y);
	}
}


function displayMetaData(faceData){
	var featurePoints = faceData['featurePoints'];
	var nose = getNoseTip(featurePoints);
	var metaData = faceData['appearance'];
	var displacement ={'x':0 , 'y':-200};

	fill(255,255,255,150);
	rect(nose.x + displacement.x - 5  ,nose.y + displacement.y ,130,65);
	fill(0,0,0);
	text("age: " + metaData.age, nose.x,nose.y  + displacement.y + 25);
	text("sex: " + metaData.gender, nose.x,nose.y + displacement.y  + 40 );
	text("ethnicity: " + metaData.ethnicity, nose.x,nose.y + displacement.y + 55 );
	//text("emoji: " + faceData.emojis.dominantEmoji , nose.x, nose.y +displacement.y + 70 );
}


function getFaceBounds(featurePointsObject){
	var topLeftX =featurePointsObject[0].x;
	var topLeftY = featurePointsObject[6].y;
	var bottomRightX = featurePointsObject[4].x
	var bottomRightY =featurePointsObject[2].y;
	var h = bottomRightY - topLeftY;
	var w = bottomRightX -topLeftX;

	return {"x":topLeftX, "y":topLeftY, 'w':w , 'h':h };
}


function getNoseTip(featurePointsObject){
	return {'x':featurePointsObject[14].x, 'y':featurePointsObject[14].y};
}

function getThirdEye(featurePointsObject){
	return {'x':featurePointsObject[11].x, 'y':featurePointsObject[11].y};
}


function addABall(emot){
	balls.push(new Ball( width/2 , height/2 ,10,emot) );

}

function makeBalls(dictionary){
	var keys = Object.keys(dictionary)
	for (var j = 0 ; keys.length; j++){

		var key = keys[i];
		value = dictionary[key];

		for (var i = 0; i<value;value += 10 ){
			balls.push(new Ball( width/2 , height/2 ,2,key) );
		}
	}
}

function updateBalls(){
	for( var i = balls.length -1; i>=0 ; i-- ){
		b  = balls[i];
		
		if ( b.lifespan < 0 ){
			balls.splice(i,1);
		}
		else{
			b.update();
			b.display();
		}
	}


}

function makeArc(x,y, radius, startAngle,endAngle,clr,numPoints){
	noFill();
	stroke(clr);
	beginShape();
	for(var i = 0; i<=numPoints; i++){
		a =startAngle +  i*(endAngle - startAngle)/numPoints;
		vertex(x+radius*cos( a), y+radius*sin(a))
	}
	endShape();
}

function makeAuraTimeStep(faceData,  relativeTime ,centerX,centerY){
	var emotionData = faceData.emotions;
	var startAngle = PI/4;
	var endAngle = 3*PI/4;
	var angleChange = (2*PI - (endAngle - startAngle))/(feelings.length - 1 );

	// have center change from the past
	// featurePointsObject = faceData.featurePoints;
	//var center = getThirdEye(featurePointsObject);

	for (var i=0; i<feelings.length; i++){
		//figure out color and opacity
		var emotionStrength = emotionData[feelings[i]];
		var opacity = emotionStrength*2.;
		var c = emotionColorDictionary[feelings[i]]; 
		var r = c._getRed();
		var g = c._getGreen();
		var b = c._getBlue();
		var clr = color(r,g,b,opacity);

		//figure out start and end Angles
		var start = startAngle - angleChange*i;
		var end = startAngle - angleChange*(i+1);
		
		makeArc(centerX , centerY, relativeTime , start,end,clr,5);

	}
}


function colorKey(){
	textSize(12);
	fill(255,255,255,180);
	rect(0,0, 110,160);
	for(var i =0; i<feelings.length; i++){
		fill(emotionColorDictionary[feelings[i]]);
		ellipse(25,25+25*i, 25 , 25 );
		text(feelings[i], 50,25 + 25*i);
	}
}


function displayEmoji(faceData){
	fill(0);
	var size =50;
	// var featurePoints = faceData['featurePoints'];
	// var nose = getNoseTip(featurePoints);
	// var metaData = faceData['appearance'];
	// var eyeDistance = faceData['measurements'].interocularDistance;

	textSize(size);
	text(faceData.emojis.dominantEmoji , width - 1.5*size, size );
}