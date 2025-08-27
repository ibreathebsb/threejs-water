// #include <common>
// #include <lights_pars_begin>

precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uAmplitude;
uniform samplerCube uEnvironmentMap;

in vec2 vUv;
in vec3 vNormal;
in vec3 vPosition;
in float vDz;

void main() {
  vec3 color = uColor;
  vec3 n = normalize(gl_FrontFacing ? vNormal : -vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  vec3 baseColor = color * clamp((vDz + uAmplitude) / (2.0 * uAmplitude), 0.5, 1.0);
  // vec3 baseColor = color;
  vec3 reflectDir = reflect(-viewDir, n);
  reflectDir.x = reflectDir.x * -1.0;
  vec3 reflectedColor = texture(uEnvironmentMap, reflectDir).xyz;
  float F0 = 0.04;
  float fresnel = F0 + (1.0 - F0) * pow(1.0 - dot(n, viewDir), 5.0);
  vec3 finalColor = mix(baseColor, reflectedColor, fresnel);
  gl_FragColor = vec4(finalColor, uOpacity);
  // gl_FragColor = vec4(color, uOpacity);
}
