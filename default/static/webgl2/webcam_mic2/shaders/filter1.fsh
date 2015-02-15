/*
	A GLSL video filter example which uses webcam and microphone input.
	
	Copyright 2015 Jeremy Carter (Jeremy@JeremyCarter.ca)
	
	Free to use and modify for any purpose, but you must only add additional
	copyright notices and never remove any which were already there (directly above
	this message).
*/

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uAudioData[32];
uniform float uAudioFreq[32];

float rand(vec2 co, float range) {
	return mod(fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453), range);
}

vec4 filter1(vec4 color) {
	
	float r = color.r;
	float g = color.g;
	float b = color.b;
	float a = color.a;
	
	float n = 0.5;
	
	
	
	r = mod(r, 1.0001);
	g = mod(g, 1.0001);
	b = mod(b, 1.0001);
	a = mod(a, 1.0001);
	
	return vec4(r, g, b, a);
}

void main() {
	
	vec4 color = texture2D(tDiffuse, vUv);
	color = filter1(color);
	gl_FragColor = color;
}
