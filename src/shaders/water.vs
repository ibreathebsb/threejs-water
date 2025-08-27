precision highp float;

uniform float uTime;
uniform vec3 uColor;

uniform float uAmplitude;
uniform float uAmplitudeFactor;
uniform float uFrequency;
uniform float uFrequencyFactor;
uniform int uIterations;
uniform float uRandom;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;
out float vDz;

const float PI = 3.14159;

//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

// Simplex 2D noise
//
vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vUv = uv;
  vPosition = vec3(modelMatrix * vec4(position, 1.0));

  float dz = 0.0;
  float dzdx = 0.0;
  float dzdy = 0.0;

  float a = uAmplitude;
  float w = uFrequency;

  float lambda = 40.0;

  for (int i = 0; i < uIterations; i++) {
    float angle = snoise(vec2(float(i) * 0.1, uRandom)) * 2.0 * PI;
    float kx = cos(angle);
    float ky = sin(angle);

    float k = 2.0 * PI / lambda;
    // float k = (w * w) / 9.8;

    kx *= k;
    ky *= k;

    float phase = kx * position.x + ky * position.y - w * uTime;
    float sinPhase = sin(phase);
    float cosPhase = cos(phase);
    dz += a * sinPhase;
    dzdx += a * kx * cosPhase;
    dzdy += a * ky * cosPhase;
    a = a * uAmplitudeFactor;
    w = w * uFrequencyFactor;
    lambda *= uAmplitudeFactor;
  }

  vec3 x = vec3(1, 0, dzdx);
  vec3 y = vec3(0, 1, dzdy);
  vec3 n = normalize(cross(x, y));
  vNormal = mat3(modelMatrix) * n;
  vec3 newPosition = position;
  newPosition.z += dz;
  
  vDz = dz;
  

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
