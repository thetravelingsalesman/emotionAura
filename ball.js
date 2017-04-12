
  // Ball constuctor
function Ball(tempX, tempY, tempW,tempEmotion) {
  emotionColorDictionary = {
    'disgust':color(43,105,68),'joy':color(230,80,18) ,
   'anger': color(196,72,70)  ,'sadness': color(46,90,156) , 'fear': color(136,31,130),
   'contempt':color(255,0,0), 'engagement': color(0,255,0),'surprise': color(243,255,53)
 };

  this.x = tempX;  // x location of square 
  this.y = tempY;  // y location of square 
  this.w = tempW;  // speed of square 
  this.speedX = 2*Math.random() -1;  // size
  this.speedY = 2*Math.random() -1;
  this.emotion = tempEmotion;
  this.lifespan =255;
  this.clr = emotionColorDictionary[this.emotion];
  gravity =1.0;

  this.display = function() {
    // Display the square 
    fill(this.clr); 
    //fill(color(200,200,200));
    noStroke(); 
    ellipse(this.x,this.y, 10 , 10 );
  };

  this.update = function() {

    // Add speed to location
    this.y = this.y + this.speedY; 
    this.x = this.x + this.speedX;

    // Add gravity to speed
    // this.speed = this.speed + gravity; 


    // // If square reaches the bottom 
    // // Reverse speed 
    // if (this.y > height) { 
    //   this.speed = this.speed * -0.95;  
    // } 

    //  // decrease life by one
    this.lifespan --;


  };
}