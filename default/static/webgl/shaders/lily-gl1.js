// TestShader

THREE.TestShader = {

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

        "float rand(vec2 co) {",
            "return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);",
        "}",

        "vec4 filter1(vec4 color) {",
        
            "float r = color.r;",
            "float g = color.g;",
            "float b = color.b;",
            "float a = color.a;",
            
            "r = r*2.0;",
            "g = r*4.0;",
            "b = r*3.0;",
            "a = 0.55;",
            
            "r = mod(r, 1.0);",
            "g = mod(g, 1.0);",
            "b = mod(b, 1.0);",
        
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
