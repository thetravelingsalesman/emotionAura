var faces;
var data;


$(document).ready(function() {
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var faces;
    if (isChrome || isFirefox || isOpera) {
        //JSSDKDemo.init();
        JSSDKDemo.run();
    } else {
        JSSDKDemo.create_alert("incompatible-browser", "It appears that you are using an unsupported browser. Please try this demo on Chrome, Firefox, or Opera.");
    }
});

var JSSDKDemo = (function() {
    var detector = null;

    var face_visible = true;

    // function to post response from affectiva -  aggregates data before posting
    
    var run = function() {
        var facevideo_node = document.getElementById("facevideo-node");
        detector = new affdex.CameraDetector(facevideo_node);
        
        // classes of data we can get
        detector.detectAllEmotions();
        detector.detectAllExpressions();
        detector.detectAllEmojis();
        detector.detectAllAppearance();

        detector.addEventListener("onWebcamConnectSuccess", function() {
            console.log("msg-starting-webcam");
        });
        
        detector.addEventListener("onWebcamConnectFailure", function() {
          console.log("webcam connected"); 
          });
        
        if (detector && !detector.isRunning) {
            detector.start();
        }
        
        
        detector.addEventListener("onInitializeSuccess", function() {
            //load initial video
           
        });
        
        // everything to do when we get response back from affectiva
        var count =1;
        detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
          
          if (faces.length >0 && faces[0].hasOwnProperty('emotions') ){
            $('#dataHolder').text(JSON.stringify(faces));
            data =faces;
            if (count ==1){
              console.log(faces);

              count++;
            }
        //Draw the detected facial feature points on the image
      
            var feelings = ['disgust','joy','anger', 'engagement','sadness','surprise','fear','contempt'];
            emotionResponse = [];
            

            for( var i = 0 ; i< feelings.length;i++){
                 emotionResponse.push(faces[0].emotions[feelings[i]]);
            
            }
            data = [
                {
                x:feelings,
                y:emotionResponse,
                type :"bar",
                }
              ];
            layout= {
              yaxis: {
                range: [0, 100]
              }

            };

            Plotly.newPlot('myDiv', data, layout);

          }

        });
    };


    
    var begin_capture = function() {
       
        
    };
    
    var stop_capture = function() {
        stop_time = get_current_time_adjusted();
        capture_frames = false;
        detector.stop();
             
    };
    
    
    
     return {
         init: function() {
            data = [
        {
        
            x:feelings,
            y:[0,0,0,0,0,0,0],
            type :"bar",
            
        }
      ];
      layout= {
              yaxis: {
                range: [0, 100]
              }
            };

        Plotly.newPlot('myDiv', data, layout);
  
         },

         run: run,

        responses: function(clicked_id) {
           
        },
        
        //create_alert: create_alert
    };
})();
