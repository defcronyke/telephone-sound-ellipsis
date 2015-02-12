// TestShader

THREE.live_aud = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"uAudioData": { type: "f", value: null }
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
		"uniform float uAudioData;",
		"varying vec2 vUv;",

        "float rand(vec2 co, float range) {",
            "return mod(fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453), range);",
        "}",

        "vec4 filter1(vec4 color) {",
        
            "float r = color.r;",
            "float g = color.g;",
            "float b = color.b;",
            "float a = color.a;",
            
            
            "if ((color.g > 0.2) || (uAudioData > 0.15)) {",
            
                "r = abs(uAudioData) - color.r;",
                
            "}",
            
            "if ((color.b < 0.2) || (uAudioData < -0.09)) {",
            
                "g = abs(uAudioData) - color.g;",
                
            "}",
            
            "if ((color.r < 0.6) || (uAudioData > 0.2)) {",
            
                "b = abs(uAudioData) - color.b;",
                
            "}",
            
            "if (uAudioData > 0.2) {",
                "b = color.r / rand(vec2(uAudioData, g), 2.0);",
            "}",
            
            
            "r = clamp(r, 0.0, 1.0);",
            "g = clamp(g, 0.0, 1.0);",
            "b = clamp(b, 0.0, 1.0);",

        
            "return vec4(r, g, b, a);",
            //"return color;",
        "}",

		"void main() {",
			"vec4 color = texture2D( tDiffuse, vUv );",			
			"color = filter1(color);",
			"gl_FragColor = color;",
		"}"
	].join("\n")
};

