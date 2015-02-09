// TestShader

THREE.live = {

	uniforms: {

		"tDiffuse": { type: "t", value: null }
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
		"varying vec2 vUv;",

        "float rand(vec2 co, float range) {",
            "return mod(fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453), range);",
        "}",

        "vec4 filter1(vec4 color) {",
        
            "float r = color.r;",
            "float g = color.g;",
            "float b = color.b;",
            "float a = color.a;",
            
            "a = 1.0 - ((r + g + b)/3.0);",
            
            "float n = rand(color.rg, 1.0);",
            "if (n < 0.34) {",
                "r = 1.0 - r;",
                "g = 0.5 - g;",
            "} else if (n > 0.33 && n < 0.67){",
                "g = 1.0 - g;",
            "} else {",
                "b = 1.0 - b;",
            "}",
            
            "float r2 = r;",
            
            "r = 1.0 - g;",
            "g = 1.0 - b;",
            "b = 1.0 - r2;",
            
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
