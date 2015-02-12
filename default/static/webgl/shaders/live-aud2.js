// TestShader

THREE.live_aud2 = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"uAudioData": { type: "1fv", value: null },
		"uAudioFreq": { type: "1fv", value: null }
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float uAudioData[32];",
		"uniform float uAudioFreq[32];",
		"varying vec2 vUv;",

        "float rand(vec2 co, float range) {",
            "return mod(fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453), range);",
        "}",

        "vec4 filter1(vec4 color) {",
        
            "float r = color.r;",
            "float g = color.g;",
            "float b = color.b;",
            "float a = color.a;",
            
            "float n = 0.65;",
            
            "for (int i = 0; i < 32; i++) {",   // for each frequency
            
                "if (uAudioFreq[i] > n) {",
            
                    "if (i == 7) {",    // freq range 1
                    
                        "r = color.r + uAudioFreq[i]/1.2;",
                    "}",
                    
                    "else if (i == 15) {",
                        
                        "g = color.g + uAudioFreq[i]/1.2;",
                    "}",
                    
                    "else if (i == 23) {",
                    
                        "b = color.b + uAudioFreq[i]/1.2;",
                    "}",
                    
                    "else {",
                        
                        "a = color.a - uAudioFreq[i]/2.0;",
                    "}",
                
                "}",
            "}",
            
            "if ((r + g + b) <= 2.2) {",
            
                "if (uAudioFreq[12] > n) {",

                    "r += rand(vec2(uAudioFreq[12], uAudioFreq[24]), 1.0);",
                "}",
                
                "if (uAudioFreq[5] > n) {",
                    
                    "g += rand(vec2(uAudioFreq[5], uAudioFreq[7]), 1.0);",
                "}",
                
                "if (uAudioFreq[26] > n) {",
                    "b += rand(vec2(uAudioFreq[26], uAudioFreq[30]), 1.0);",
                "}",
            "}",
            
            "r = mod(r, 1.00001);",
            "g = mod(g, 1.00001);",
            "b = mod(b, 1.00001);",

            "return vec4(r, g, b, a);",
        "}",

		"void main() {",
			"vec4 color = texture2D( tDiffuse, vUv );",			
			"color = filter1(color);",
			"gl_FragColor = color;",
		"}"
	].join("\n")
};

