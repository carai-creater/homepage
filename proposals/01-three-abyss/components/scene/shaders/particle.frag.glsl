uniform vec3 uColor;

varying float vAlpha;
varying float vScale;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c) * 2.0;
  float alpha = (1.0 - smoothstep(0.0, 1.0, d)) * vAlpha * vScale;

  gl_FragColor = vec4(uColor, alpha);
}
