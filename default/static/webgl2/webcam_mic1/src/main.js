/*
	A GLSL video filter example which uses webcam and microphone input.
	
	Copyright 2015 Jeremy Carter (Jeremy@JeremyCarter.ca)
	
	Free to use and modify for any purpose, but you must only add additional
	copyright notices and never remove any which were already there (directly above
	this message).
*/

var filter1_vsh, filter1_fsh;
var scene, camera, renderer, canvas_area, video, createObjectURL, videoImage, videoImageContext, videoTexture, movieMaterial;

var buffSize = 2048;
var numChannels = 2;    // if you change this you have to change more stuff below
var audioSliceSize = 32;

var audioDataQueue = [];
var audioFreqQueue = [];
var audioFreqSlice = [];

var z_pos = -290;
var y_rot = 180;

$(function(){
	
	init();
	
});

function loadShaders(vertex, fragment, callback) {
	
	$.ajax(vertex)
	.done(function(data) {
		
		filter1_vsh = data;
		
		$.ajax(fragment)
		.done(function(data) {
			
			filter1_fsh = data;
			callback();
		})
		.fail(function() {
			
			console.log("Error: Couldn't load fragment shader: " + e.responseText);
			return;
		})
	})
	.fail(function(e) {
		
		console.log("Error: Couldn't load vertex shader: " + e.responseText);
		return;
	})
}

function init() {
	
	loadShaders("shaders/filter1.vsh", "shaders/filter1.fsh", function() {
		
		scene = new THREE.Scene();
		
		var w = 640, h = 480;
		var view_angle = 45.0;
		var aspect = w / h;
		var near = 0.1, far = 20000.0;
		camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
		camera.position.set(0, 0, z_pos);
		camera.rotation.y = y_rot * Math.PI/180;
		scene.add(camera);
		
		if (window.WebGLRenderingContext) {
			renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true
			});
		} else {
			console.log("WebGL not supported by your browser or gpu driver. Falling back to canvas rendering.");
			renderer = new THREE.CanvasRenderer();
		}
		
		renderer.setSize(w, h);
		renderer.setClearColor(0x000000, 1);
		canvas_area = $("#canvas_area");
		canvas_area.append(renderer.domElement);
		
		var light = new THREE.PointLight(0xffffff);
		light.position.set(0,250,0);
		scene.add(light);
		
		video = document.createElement('video');
		video.crossOrigin = "anonymous";
		
		navigator.getUserMedia_ = (navigator.getUserMedia
                || navigator.webkitGetUserMedia 
                || navigator.mozGetUserMedia 
                || navigator.msGetUserMedia);

		createObjectURL = (window.URL || window.webkitURL || {}).createObjectURL || function(stream){};
		
		if ( !! navigator.getUserMedia_) {
	        
	        navigator.getUserMedia_({
	           video: {
	               optional: [
	                   { minWidth: 640 },
	                   { minHeight: 480 }
	               ]
	           },
	           
	           audio: false
	        },
	        function(stream){
	            
	        	$("body").on("tap", function() {
	        		
	        		if (camera.rotation.y >= 360) camera.rotation.y = 0 * Math.PI/180;
	        		camera.rotation.y += y_rot * Math.PI/180;
	        		z_pos = -z_pos;
	        		camera.position.set(0, 0, z_pos);
	        	});
	        	
	            processVideo(stream);
	            
	            animate();
	            
	            
	            navigator.getUserMedia_({
	               audio: true
	            },
	            function(stream){
	                
	                processAudio(stream);
	                
	            }, 
	            function(error){
	            	
	                var msg = "Failed to get a stream due to " + error;
	                console.log(msg);
	            });
	            
	        }, 
	        function(error){
	        	
	            var msg = "Failed to get a stream due to " + error;
	            console.log(msg);
	            video.src = "https://dl.dropboxusercontent.com/s/tgvsdgpyqniftkk/stock-explosion.webm";
	        });
	        
	    } else {
	        
	        console.log("Error: navigator.getUserMedia not found.");
	        return;
	    }
		
		
	});
}

function processVideo(stream) {
	
	video.src = createObjectURL(stream);

    video.load();
    video.play();
    video.muted = true;

    videoImage = document.createElement('canvas');
    videoImage.width = 640;
    videoImage.height = 480;

    var sizeMultiplier = 0.5;

    videoImageContext = videoImage.getContext('2d');
    videoImageContext.fillStyle = '#000000';	// fallback background color
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    movieMaterial = new THREE.ShaderMaterial({
        uniforms: {
            tDiffuse: { type: "t", value: videoTexture },
            uAudioData: { type: "1fv", value: new Float32Array(audioSliceSize) },
            uAudioFreq: { type: "1fv", value: new Float32Array(audioSliceSize) }
        },
        vertexShader: filter1_vsh,
        fragmentShader: filter1_fsh,
        side: THREE.DoubleSide,
        transparent: true
    });
    
    var movieMaterials = [
        movieMaterial,
    ];

    var movieGeometry = new THREE.PlaneGeometry(Math.floor(videoImage.width * sizeMultiplier), Math.floor(videoImage.height * sizeMultiplier), 4, 4);
    var movieScreen = new THREE.SceneUtils.createMultiMaterialObject(movieGeometry, movieMaterials);
    movieScreen.position.set(0,0,0);
    scene.add(movieScreen);
}

function processAudio(stream) {
    
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    var audioContext = new AudioContext();      
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);
    var recorder = audioContext.createScriptProcessor(buffSize, 2, 2);
    
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = buffSize;
    
    recorder.onaudioprocess = function(s) {

        l = s.inputBuffer.getChannelData(0);
        r = s.inputBuffer.getChannelData(1);
        
        var out_l = s.outputBuffer.getChannelData(0);
        var out_r = s.outputBuffer.getChannelData(1);

        audioDataQueue = [];
        
        for (var key in l) {
            
            audioDataQueue.push(l[key]);
            audioDataQueue.push(r[key]);
                           
            //out_l[key] = l[key];  // TODO: uncomment these two lines if you want sound output.
            //out_r[key] = r[key];
        }
       
        movieMaterial.uniforms.uAudioData.value = new Float32Array(audioDataQueue.slice(0, audioSliceSize));

        audioFreqQueue = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(audioFreqQueue);
        
        audioFreqSlice = [];
        for (var i = 0; i < audioSliceSize; i++) {
            audioFreqSlice.push(1.0 - (Math.abs(audioFreqQueue[i])/128.0));
        }
        
        movieMaterial.uniforms.uAudioFreq.value = new Float32Array(audioFreqSlice);
        
        if ( videoTexture ) 
            videoTexture.needsUpdate = true;
        
    };
    
    
    mediaStreamSource.onended = function() {
        mediaStreamSource.disconnect(analyser);
        analyser.disconnect(recorder);
        recorder.disconnect(audioContext.destination);
    };
    
    mediaStreamSource.connect(analyser);
    analyser.connect(recorder);
    recorder.connect(audioContext.destination);
}

if (!window.requestAnimationFrame) {
	 
	window.requestAnimationFrame = (function() {
 
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element) {
 
			window.setTimeout(callback, 1000 / 60);
 
		};
 
	} )();
 
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
	update();
}

function render() {
	
	if (video.readyState === video.HAVE_ENOUGH_DATA) 
	{
		videoImageContext.drawImage(video, 0, 0);
		if (videoTexture) 
			videoTexture.needsUpdate = true;
	}
	
	renderer.render(scene, camera);
}

function update() {
	
	renderer.setSize(window.innerWidth * 0.997, window.innerHeight * 0.997);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
