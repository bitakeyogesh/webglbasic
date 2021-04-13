const vertexShaderText = `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;

    void main(){
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;

const fragmentShaderText = `
    precision mediump float;
    varying vec3 fragColor;

    void main(){
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;

const init = ()=>{
    //1. initialize webgl
    const canvas = document.getElementById("game-surface");
    let gl = canvas.getContext('webgl');
    if(!gl){
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }
    if(!gl){
        alert('Your browser does not support WebGL');
        return;
    }
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //2. Create shaders
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // attach glsl text format source to shader
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    // compile shader
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // validate errors of compiling shaders
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}
    //3. Create program
    let program = gl.createProgram();
    // attach shader to program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    //4. Link program
    gl.linkProgram(program);
    // validate errors of link program
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
    //5. validate program
    gl.validateProgram(program);
    // validate errors of validate program
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

    //6. pass down data 
	const triangleVertices = 
	[ // X, Y,       R, G, B
		0.0, 0.5,    1.0, 1.0, 0.0,
		-0.5, -0.5,  0.7, 0.0, 1.0,
		0.5, -0.5,   0.1, 1.0, 0.6
	];
    // create buffer 
	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

    // Main render loop
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3)

}
init();