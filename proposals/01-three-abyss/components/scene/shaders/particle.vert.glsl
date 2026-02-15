uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform float uSectionProgress;

attribute float aScale;
attribute float aPhase;
attribute float aRadius;

varying float vAlpha;
varying float vScale;

void main() {
  vec3 pos = position;

  // Base radius + organic drift (sin/cos for organic "intelligence" feel)
  float drift = sin(uTime * 0.3 + aPhase) * 0.15 + cos(uTime * 0.2 + aPhase * 1.3) * 0.1;
  float r = aRadius + drift;

  float angle = aPhase + uTime * 0.15;
  pos.x = cos(angle) * r;
  pos.z = sin(angle) * r;
  pos.y = sin(uTime * 0.25 + aPhase * 2.0) * 0.2;

  // Mouse attraction: particles subtly flow toward cursor (XY mapped to XZ in world)
  vec2 toMouse = uMouse - vec2(pos.x, pos.z);
  float dist = length(toMouse);
  float pull = uMouseInfluence * (1.0 / (1.0 + dist * 2.0));
  pos.x += toMouse.x * pull * 0.5;
  pos.z += toMouse.y * pull * 0.5;

  // Section progress: "1" symbolism - contract toward center in hero, expand in vision
  float contract = 1.0 - uSectionProgress * 0.5;
  pos *= contract;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size attenuation
  gl_PointSize = aScale * (80.0 / -mvPosition.z);

  vAlpha = 0.4 + 0.6 * (0.5 + 0.5 * sin(uTime + aPhase));
  vScale = aScale;
}
