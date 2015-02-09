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
            
            "if (color.r > 0.48) {",
                "r = color.r * color.r * color.g;",
            "}",
            
            "if (g > 0.48) {",
                "g = color.g * color.g * color.r;",
            "}",
            
            "if (b < 0.48) {",
                "b = color.b * color.b * color.g;",
            "}",
            
            "if (color.r > 0.42 && color.g > 0.42 && color.b > 0.42) {",
                "a = 0.6;",
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
