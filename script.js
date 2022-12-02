// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint;

// create an engine
var engine = Engine.create({
    //enableSleeping: true,
    gravity: {
        y: 0.90
    }
});


// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
    },
});

// custom cursor element
const cursorElement = document.querySelector('.cursor');

cursorElement.style.width = '450px'
cursorElement.style.height = '250px'

// track mouse movement
let mouseX = window.innerWidth/2
let mouseY = window.innerHeight/2

const moveCursor = (e)=> {
    mouseX = e.clientX
    mouseY = e.clientY
     
    //track the custom cursor
    cursorElement.style.transform = `translate3d(${mouseX-225}px, ${mouseY-200}px, 0)`;
  }
  
window.addEventListener('mousemove', moveCursor)



// create ground
const ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight, window.innerWidth, 60, { 
    isStatic: true,
    // isSleeping: false,
    // sleepingThreshold: 1,
    render: {
        fillStyle: 'green',
        sprite: {
            texture: './ground.png',
            // xScale: 0.2,
            // yScale: 0.2
        }
    }
});

// create snowflakes
const sprites = ['./snowflake.png', './snowflake2.png', './snowflake3.png', './snowflake4.png']

const snowflake = () => sprites[Math.floor(Math.random()*sprites.length)];

function makeSnowflake() {
    let box = Bodies.rectangle(mouseX, mouseY, 50, 10, {
        isStatic: false,
        density: 0.04,
        friction: 1,
        frictionStatic: 0.1,
        restitution: 0.01,
        sleepingThreshold: 0.01,
        render: {
            sprite: {
                texture: snowflake(),
                xScale: 0.125,
                yScale: 0.125
            }
        }
    })
    Composite.add(engine.world, [box])
}



// add mouse control
var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

//create the snowflakes when mouse is being pressed down
let interval;

function down() {
  interval = setInterval(makeSnowflake, 100);
}

function up() {
  clearInterval(interval);
}

this.addEventListener('mousedown', down, false);
this.addEventListener('mouseup', up, false);


// add all of the bodies to the world
Composite.add(engine.world, [ground, mouseConstraint]);



//Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
