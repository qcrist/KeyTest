var vertexShader = "vertex_shader";
var fragmentShader = "fragment_shader";
var canvas;
var gl;
var program;
var pMatrix = mat4.create();
var mvMatrix = mat4.create();

var pos = [0,0,-3]
var rot = mat4.create();

var mvMATRIX;
var pMATRIX;
var POSITION;
var COLOR;
var TEXCOORD;

var posz = new Float32Array([
    -1.0,   -1.0,   0,
    -1.0,   1.0,    0,
    1.0,    1.0,   0,
    -1.0,   -1.0,   0,
    1.0,    1.0,   0,
    1.0,   -1.0,    0,
    ]);
var posBuf;

var colorz = new Float32Array([
    // R, G, B, A  	            
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    ]);
var colorBuf;

var color2z = new Float32Array([
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    ]);
var color2Buf;

var texz = new Float32Array([
    0,0,
    0,1,
    1,1,
    0,0,
    1,1,
    1,0,
    ]);
var texBuf;

function init()
{
    canvas = document.getElementById("canvas");
    if ((gl = WebGLUtils.setupWebGL(canvas,{
        depth: true
    })) == null) return;
    gl.clearColor(0,0,0, 1);	
    //gl.clearColor(0.1, 0.1, 0.15, 1);	
    gl.useProgram(program = createProgramFromShaderFiles(gl,"vertex_shader","fragment_shader"));
    //gl.useProgram(program = createProgramFromShaders(gl,document.getElementById(vertexShader).textContent.toString(),document.getElementById(fragmentShader).textContent.toString()));
   
    mvMATRIX = gl.getUniformLocation(program, "mvMatrix");        
    pMATRIX = gl.getUniformLocation(program, "pMatrix");        
    POSITION = gl.getAttribLocation(program, "pos");
    COLOR = gl.getAttribLocation(program, "color");   
    TEXCOORD = gl.getAttribLocation(program, "tex");   
    
    posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, posz, gl.STATIC_DRAW);
    
    color2Buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color2Buf);
    gl.bufferData(gl.ARRAY_BUFFER, color2z, gl.STATIC_DRAW);
    
    colorBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
    gl.bufferData(gl.ARRAY_BUFFER, colorz, gl.STATIC_DRAW);
    
    texBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
    gl.bufferData(gl.ARRAY_BUFFER, texz, gl.STATIC_DRAW);
    
    var texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function(){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        SAMPLER = gl.getUniformLocation(program, "sampler");   
        gl.uniform1i(SAMPLER, 0);
    }
    texture.image.src = "pic.png";

    gl.enableVertexAttribArray(COLOR);   
    gl.enableVertexAttribArray(POSITION);
    gl.enableVertexAttribArray(TEXCOORD);

    window.onkeydown = function(event){
        if (event.cancelable && event.keyCode != 116 && event.keyCode != 122)
            event.preventDefault();
        if (event.keyCode == 38)
            pos[2] += .5;
        else if (event.keyCode == 40)
            pos[2] -= .5;
        else if (event.keyCode == 37)
            pos[0] += .5;
        else if (event.keyCode == 39)
            pos[0] -= .5;
        else
            console.log(event.keyCode);
        console.log(pos);
    };

    resize();
    window.requestAnimFrame(draw, canvas);    
}

var lastTime=0;
var theTime;
var frame=0;
function draw(time)
{
    //FPS
    theTime = time;
    time -= lastTime;
    lastTime = theTime;
    if (frame++%30==0)
        $("#FPS").text(Math.round(1000/(time)));
    
    //MATRIX
    mat4.translate(mvMatrix, rot, pos);
    gl.uniformMatrix4fv(mvMATRIX, false, mvMatrix);
    
    // Pass in the information
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
    gl.vertexAttribPointer(COLOR, 4, gl.FLOAT, false, 0, 0);              

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.vertexAttribPointer(POSITION, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
    gl.vertexAttribPointer(TEXCOORD, 2, gl.FLOAT, false, 0, 0);

    //DRAW
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    
       // Pass in the information
    gl.bindBuffer(gl.ARRAY_BUFFER, color2Buf);
    gl.vertexAttribPointer(COLOR, 4, gl.FLOAT, false, 0, 0);              


    gl.drawArrays(gl.LINE_LOOP, 0, 6);
    gl.flush();
    
    //NEXT FRAME
    window.requestAnimFrame(draw, canvas);
}

function resize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

    mat4.identity(pMatrix);
    mat4.perspective(pMatrix,45, canvas.clientWidth/canvas.clientHeight, 0.1, 100.0);
    gl.uniformMatrix4fv(pMATRIX, false, pMatrix);
}

window.onload = init;
window.onresize = resize;