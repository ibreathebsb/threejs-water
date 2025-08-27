in vec2 vUv;
uniform sampler2D uTexture;

void main() {
  vec4 texColor = texture(uTexture, vUv);
  gl_FragColor = vec4(texColor.xyz, 1.0);
}