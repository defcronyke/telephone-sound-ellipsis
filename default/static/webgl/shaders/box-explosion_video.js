// TestShader

THREE.box_explosion = {

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
            
            "if (r < 0.3) {",
            
                "r = r+g * rand(vec2(r, g), 5.0);",
                
            "} else {",
            
                "r = b+g*2.0 * rand(vec2(r, g), 4.0);",
                
            "}",
            
            "if (color.r < 0.6) {",
            
                "g = g+b/r * rand(vec2(b, g), 3.0);",
                
            "} else {",
            
                "g = color.r * 2.0 * color.b / rand(vec2(r, b), 1.0);",
            "}",
            
            
            "b = b*r * rand(vec2(r, g), 32.0);",
        
            "if (color.g > 0.75) {",
                
                "a = 0.0;",
                
            "}",
            
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
