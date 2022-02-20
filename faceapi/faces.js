      const out = document.getElementById("out");
      const videoWidth = 300;
      const videoHeight = 300;
      const canvas = document.createElement('canvas');
      let localstream;
      navigator.getUserMedia = navigator.getUserMedia ||
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      
 
      ////INPUT////
      
      const setupCamera = () =>
      {
          return new Promise((resolve, reject)=> {
              if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                  throw new Error(
                          'Browser API navigator.mediaDevices.getUserMedia not available');
              }

              const video = document.getElementById('inputVideo');
              video.width = 200;
              video.height = 200;
              navigator.mediaDevices.getUserMedia({
                  'audio': false,
                  'video': {
                      width:300,
                      height:300
                  },
              }).then((s)=>{
                  localstream = s;
                  video.srcObject = localstream;
                  video.onloadedmetadata = () => {
                      console.log("video loaded");
                      resolve(video);
                  };
              }).catch((err)=> {console.log(err)});
          });
      }
      
      const init = async ()=> {
        const MODEL_URL = "https://mimic-238710.appspot.com/asset/9dc4eaf4-93db-26e8-9357-155eb152ea44/"
     	await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
      	await faceapi.loadFaceExpressionModel(MODEL_URL);
        setupCamera();
      }
      init();
      
      const onPlay = async (videoEl)=> {
        const res = await faceapi.detectSingleFace(videoEl).withFaceExpressions()
      	if(res){
          currentScores = res.expressions.map((obj)=> {
            return obj.probability;
          });
          //Add to dataset / use as input
          learner.newExample(currentScores, learner.y);
          
          currentScores = res.expressions.map((obj)=> {
            return obj.probability.toPrecision(2);
          });
          document.getElementById("label-neutral").innerHTML = "Neutral:" + currentScores[0];
          document.getElementById("label-happy").innerHTML = "Happy:" + currentScores[1];
          document.getElementById("label-sad").innerHTML = "Sad:" + currentScores[2];
          document.getElementById("label-angry").innerHTML = "Angry:" + currentScores[3];
          document.getElementById("label-fearful").innerHTML = "Fearful:" + currentScores[4];
          document.getElementById("label-disgusted").innerHTML = "Disgusted:" + currentScores[5];
          document.getElementById("label-surprised").innerHTML = "Surprised:" + currentScores[6];
        }
        setTimeout(() => onPlay(videoEl))
	  }