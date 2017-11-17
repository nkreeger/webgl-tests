class WebGL {
  static create(elementID) {
    const element = document.getElementById(elementID);
    if (!elmeent) {
      throw 'Could not find root WebGL canvas';
    }

    const rect = element.parentNode.getBoundingClientRect();
    element.width = rect.width;
    element.height = rect.width * 0.75;

    const gl = this._create3DContext(element);

    gl.viewportWidth = element.width;
    gl.viewportHeight = element.width;

    return gl;
  }

  static createShaderProgramFromScripts(gl, shaderScriptIds) {
    let shaders = [];
    for (var i = 0; i < shaderScriptIds.length; i++) {
      shaders.push(this._createShaderFromScript(gl, shaderScriptIds[i]));
    }

    let shaderProgram = gl.createProgram();
    for (var i = 0; i < shaders.length; i++) {
      gl.attachShader(shaderProgram, shaders[i]);
    }

    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw 'Could not init shaders!';
    }

    return shaderProgram;
  }

  static createShaderProgram(gl, fragmentShaderSrc, vertexShaderSrc) {
    let fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
    let vertexShader = this._createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, fragmentShader);
    gl.attachShader(shaderProgram, vertexShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw 'Could not init shaders!';
    }

    return shaderProgram;
  }


  static _create3DContext(canvas) {
    const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
    let context = null;
    for (let i = 0; i < names.length; i++) {
      try {
        context = canvas.getContext(names[i]);
      } catch (e) {}
      if (context) {
        break;
      }
    }
    return context;
  }

  static _createShader(gl, type, shaderSrc) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw gl.getShaderInfoLog(shader);
    }
    return shader;
  }

  static _createShaderFromScript(gl, scriptId) {
    let shaderSource = "";
    let shaderType;
    let shaderScript = document.getElementById(scriptId);
    if (!shaderScript) {
      throw('*** Error: unknown script element' + scriptId);
    }
    shaderSource = shaderScript.text;

    if (shaderScript.type === 'x-shader/x-vertex') {
      shaderType = gl.VERTEX_SHADER;
    } else if (shaderScript.type === 'x-shader/x-fragment') {
      shaderType = gl.FRAGMENT_SHADER;
    } else if (shaderType !== gl.VERTEX_SHADER && shaderType !== gl.FRAGMENT_SHADER) {
      throw('*** Error: unknown shader type');
    }

    return this._createShader(gl, shaderType, shaderSource);
  }
}