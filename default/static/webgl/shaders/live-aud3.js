// TestShader

THREE.live_aud3 = {

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
            
            "float n = 0.55;",
            
            "if ((uAudioFreq[4] > n) || (uAudioFreq[14] > n)) {",
                "r = mod(b / r / (uAudioFreq[4] / uAudioFreq[16]), (uAudioFreq[14] / uAudioFreq[18]));",
            "}",
            
            "if ((uAudioFreq[8] > n) || (uAudioFreq[22] > n)) {",
                "g = mod(r / g / (uAudioFreq[8] / uAudioFreq[20]), (uAudioFreq[22] / uAudioFreq[24]));",
            "}",
            
            "if ((uAudioFreq[12] > n) || (uAudioFreq[26] > n)) {",
                "b = mod(g / b / (uAudioFreq[12] / uAudioFreq[28]), (uAudioFreq[26] / uAudioFreq[31]));",
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

