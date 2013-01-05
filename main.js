var vertexShader = "vertex_shader";
var fragmentShader = "fragment_shader";
var canvas;
var gl;
var program;
var pMatrix = mat4.create();
var mvMatrix = mat4.create();

var pos = vec3.create();
var rot = vec2.create();

var keys = {};

var posz = new Float32Array([
    //front
    -1.0,   -1.0,   -1,
    -1.0,   1.0,    -1,
    1.0,    1.0,   -1,

    -1.0,   -1.0,   -1,
    1.0,    1.0,   -1,
    1.0,   -1.0,    -1,

    //back
    -1.0,   -1.0,   1,
    1.0,    1.0,   1,
    -1.0,   1.0,    1,

    -1.0,   -1.0,   1,
    1.0,   -1.0,    1,
    1.0,    1.0,   1,

    //bottm
    1.0,   -1.0,    -1,
    1.0,   -1.0,    1,
    -1.0,   -1.0,    -1,

    -1.0,   -1.0,    -1,
    1.0,   -1.0,    1,
    -1.0,   -1.0,    1,

    //top
    1.0,  1.0,    -1,
    -1.0,   1.0,    -1,
    1.0,   1.0,    1,

    -1.0,   1.0,    -1,
    -1.0,   1.0,    1,
    1.0,   1.0,    1,

    //right
    1.0,    1.0,   -1,
    1.0,    -1.0,   1,
    1.0,    -1.0,   -1,

    1.0,    1.0,   -1,
    1.0,    1.0,   1,
    1.0,    -1.0,   1,

//left
    -1.0,    1.0,   -1,
    -1.0,    -1.0,   -1,
    -1.0,    -1.0,   1,

    -1.0,    1.0,   -1,
    -1.0,    -1.0,   1,
    -1.0,    1.0,   1,

    ]);
var posBuf;

var colorz = new Float32Array([
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    0,1,0,1,
    0,1,0,1,
    0,1,0,1,
    0,1,0,1,
    0,1,0,1,
    0,1,0,1,
    0,0,1,1,
    0,0,1,1,
    0,0,1,1,
    0,0,1,1,
    0,0,1,1,
    0,0,1,1,
    1,0,1,1,
    1,0,1,1,
    1,0,1,1,
    1,0,1,1,
    1,0,1,1,
    1,0,1,1,
    0,1,1,1,
    0,1,1,1,
    0,1,1,1,
    0,1,1,1,
    0,1,1,1,
    0,1,1,1,
    1,1,0,1,
    1,1,0,1,
    1,1,0,1,
    1,1,0,1,
    1,1,0,1,
    1,1,0,1,
    ]);
var colorBuf;

function init()
{
    canvas = document.getElementById("canvas");
    if ((gl=WebGLUtils.create3DContext(canvas,{
        depth: true
    }))==null) return;
    gl.clearColor(0,0,0, 1);	
    gl.useProgram(program = createProgramFromShaderFiles(gl,"vertex_shader","fragment_shader"));

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    program.mvMatrix = gl.getUniformLocation(program, "mvMatrix");
    program.pMatrix = gl.getUniformLocation(program, "pMatrix");
    program.pos = gl.getAttribLocation(program, "pos");
    program.color = gl.getAttribLocation(program, "color");
    program.tex = gl.getAttribLocation(program, "tex");

    gl.enableVertexAttribArray(program.pos);
    gl.enableVertexAttribArray(program.color);

    posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, posz, gl.STATIC_DRAW);

    colorBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
    gl.bufferData(gl.ARRAY_BUFFER, colorz, gl.STATIC_DRAW);

    pos = [0,0,-5]

    resize();
    window.requestAnimFrame(draw, canvas);
}

var rot2 = [0,0,0];
function draw(time)
{
    mat4.identity(mvMatrix);
    mat4.rotateX(mvMatrix,mvMatrix,rot[0]);
    mat4.rotateY(mvMatrix,mvMatrix,rot[1]);
    mat4.translate(mvMatrix, mvMatrix, pos);

    var speed = .1;
    //Keys?
    if (isKeyDown("a"))
    {
        vec3.add(pos,pos,mat4.multiplyV3(mvMatrix, [speed,0,0]));
    }
    if (isKeyDown("d"))
    {
        vec3.add(pos,pos,mat4.multiplyV3(mvMatrix, [-speed,0,0]));
    }
    if (isKeyDown("w"))
    {
        vec3.add(pos,pos,mat4.multiplyV3(mvMatrix, [0,0,speed]));
    }
    if (isKeyDown("s"))
    {
        vec3.add(pos,pos,mat4.multiplyV3(mvMatrix, [0,0,-speed]));
    }
    pos[1] = 0;


    mat4.rotateY(mvMatrix,mvMatrix,rot2[0]+=.05);
    mat4.rotateX(mvMatrix,mvMatrix,rot2[1]+=.02);
    mat4.rotateZ(mvMatrix,mvMatrix,rot2[2]+=.01);

    //MATRIX
    gl.uniformMatrix4fv(program.mvMatrix, false, mvMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
    gl.vertexAttribPointer(program.color, 4, gl.FLOAT, false, 0, 0);

    // Pass in the information
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.vertexAttribPointer(program.pos, 3, gl.FLOAT, false, 0, 0);

    //DRAW
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, posz.length/3);


    //NEXT FRAME
    window.requestAnimFrame(draw, canvas);
}

function resize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

    mat4.identity(pMatrix);
    mat4.perspective(pMatrix,Math.PI/4, canvas.clientWidth/canvas.clientHeight, 0.1, 100.0);
    gl.uniformMatrix4fv(program.pMatrix, false, pMatrix);
}

function keydown(event)
{
    if (event.keyCode == 70)
        if (document.webkitFullscreenElement)
        {
            document.webkitCancelFullScreen();
            document.webkitExitPointerLock();
        }
        else
        {
            document.body.webkitRequestFullscreen(document.body.ALLOW_KEYBOARD_INPUT);
            document.body.webkitRequestPointerLock();
        }
    keys[event.keyCode] = true;
}

function keyup(event)
{
    keys[event.keyCode] = false;
}

function isKeyDown(key)
{
    if (typeof(key) == "number")
        return keys[key];
    return keys[key.toUpperCase().charCodeAt(0)];
}

function mousemove(event)
{
    var dx = event.movementX ||
    event.mozMovementX          ||
    event.webkitMovementX       ||
    0,
    dy = event.movementY ||
    event.mozMovementY      ||
    event.webkitMovementY   ||
    0;
    rot[0] += dy/100;
    rot[1] += dx/100;
//    mat4.rotateY(rot,rot,dx/100);
//    mat4.rotateX(rot,rot,dy/100);
}

window.onload = init;
window.onresize = resize;
window.onkeydown = keydown;
window.onkeyup = keyup;
window.onmousemove = mousemove;