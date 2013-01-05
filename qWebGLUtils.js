function readFile(file,time)
{
    if (time == undefined) time = 60000;
    var response = $.ajax(file,{async:false,cache:false,timeout:time}).responseText;
    if (!response)
        throw("Error loading: "+file);
    return response;
}
function loadShader(source,type)
{
    var shaderHandle = gl.createShader(type);
    var error;
	
    if (shaderHandle != 0) 
    {				
        // Pass in the shader source.
        gl.shaderSource(shaderHandle, source);		
        // Compile the shader.
        gl.compileShader(shaderHandle);
        // Get the compilation status.		
        var compiled = gl.getShaderParameter(shaderHandle, gl.COMPILE_STATUS);		
        // If the compilation failed, delete the shader.
        if (!compiled) 
        {				
            error = gl.getShaderInfoLog(shaderHandle);			
            gl.deleteShader(shaderHandle);
            shaderHandle = 0;
        }
    }
    if (shaderHandle == 0)
    {
        throw("Error compiling shader: " + error);
    }
    return shaderHandle;
}
function createProgram(vertexShader, fragmentShader)
{
    // Create a program object and store the handle to it.
    var programHandle = gl.createProgram();
    if (programHandle != 0) 
    {
        // Bind the vertex shader to the program.
        gl.attachShader(programHandle, vertexShader);			
        // Bind the fragment shader to the program.
        gl.attachShader(programHandle, fragmentShader);
		
        // Link the two shaders together into a program.
        gl.linkProgram(programHandle);

        // Get the link status.
        var linked = gl.getProgramParameter(programHandle, gl.LINK_STATUS);

        // If the link failed, delete the program.
        if (!linked) 
        {				
            gl.deleteProgram(programHandle);
            programHandle = 0;
        }
    }
    if (programHandle == 0)
    {
        throw("Error creating program.");
    }
    return programHandle;
}
function createProgramFromShaders(gl,vertexShaderSource,fragmentShaderSource)
{
    return createProgram(loadShader(vertexShaderSource,gl.VERTEX_SHADER),loadShader(fragmentShaderSource,gl.FRAGMENT_SHADER));
}
function createProgramFromShaderFiles(gl,vertexShaderFile,fragmentShaderFile)
{
    return createProgram(loadShader(readFile(vertexShaderFile),gl.VERTEX_SHADER),loadShader(readFile(fragmentShaderFile),gl.FRAGMENT_SHADER));
}
function perspective(canvas,projectionMatrix,near,far)
{
    if (near == undefined) near = 1;
    if (far == undefined) far = 10;
    var ratio = canvas.clientWidth / canvas.clientHeight;
    mat4.frustum(-ratio, ratio, -1, 1, near, far, projectionMatrix);
}