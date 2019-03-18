console.clear();

var colorArray = ["#426F42", "#262626", "#36648B", "#683A5E", "#683A5E", "#36648B"];
var slides = document.querySelectorAll("section");
var container = document.querySelector("#panelWrap");
var dots = document.querySelector(".dots");
var toolTips = document.querySelectorAll(".toolTip");
var oldSlide = 0;
var activeSlide = 0;
var navDots = [];
var dur = 0.6;
var offsets = [];
var toolTipAnims = [];
var ih = window.innerHeight;
var mouseAnim = new TimelineMax({repeat:-1, repeatDelay:1});
var handAnim = new TimelineMax({repeat:-1, repeatDelay:1});
var cursorAnim = new TimelineMax({repeat:-1, repeatDelay:1});
var arrowAnim = new TimelineMax({repeat:-1, repeatDelay:1});
document.querySelector("#upArrow").addEventListener("click", slideAnim);
document.querySelector("#downArrow").addEventListener("click", slideAnim);

// create nev dots and add tooltip listeners
for (let i = 0; i < slides.length; i++) {

var tl = new TimelineMax({paused:true, reversed:true});

  TweenMax.set(slides[i], { backgroundColor: colorArray[i] 
  });

  var newDot = document.createElement("div");
  newDot.className = "dot";
  newDot.index = i;
  navDots.push(newDot);
  newDot.addEventListener("click", slideAnim);
  newDot.addEventListener("mouseenter", dotHover);
  newDot.addEventListener("mouseleave", dotHover);
  dots.appendChild(newDot);
  offsets.push(-slides[i].offsetTop);
  tl.to(toolTips[i], 0.25, {opacity:1, ease:Linear.easeNone});
  toolTipAnims.push(tl);
}

// icon animations for slide 1
mouseAnim.staggerFromTo("#mouseRings circle", 0.8, {attr:{r:12}}, {attr:{r:40}}, 0.25);
mouseAnim.staggerFromTo("#mouseRings circle", 0.4, {opacity:0}, {opacity:1}, 0.25, 0);
mouseAnim.staggerFromTo("#mouseRings circle", 0.4, {opacity:1}, {opacity:0}, 0.25, 0.4);

handAnim.to("#hand", 0.75, {y:-16, rotation:5, transformOrigin:"right bottom"});
handAnim.to("#hand", 0.5, {y:15, ease:Power3.easeInOut});
handAnim.to("#hand", 1, {y:0, rotation:0});

TweenMax.set("#cursor", {rotation:240, transformOrigin:"center center", x:-25}); 
cursorAnim.to("#cursor", 0.25, {y:-24});
cursorAnim.staggerTo("#iconCircles circle", 0.5, {attr:{r:6}}, 0.15, "expand");
cursorAnim.to("#cursor", 1.1, {y:50}, "expand");
cursorAnim.to("#cursor", 0.75, {y:0}, "contract");
cursorAnim.to("#iconCircles circle", 0.5, {attr:{r:4}}, "contract");

arrowAnim.to("#caret", 0.5, {attr:{points:"30 40, 50 65, 70 40"}, repeat:3, yoyo:true, ease:Power2.easeInOut, repeatDelay:0.25});

// get elements positioned
TweenMax.set(".dots", {yPercent:-50});
TweenMax.set(".toolTips", {yPercent:-50});
  
// side screen animation with nav dots
var dotAnim = new TimelineMax({paused:true});
dotAnim.staggerTo(".dot", 1, {scale:1.8,  rotation:0.1, yoyo:true, repeat:1, ease:Linear.easeNone}, 1);
dotAnim.time(1);

// tooltips hovers
function dotHover() {
  toolTipAnims[this.index].reversed() ? toolTipAnims[this.index].play() : toolTipAnims[this.index].reverse();
}

// figure out which of the 4 nav controls called the function
  function slideAnim(e) {

  oldSlide = activeSlide;
  // dragging the panels
  if (this.id === "dragger") {
    activeSlide = offsets.indexOf(this.endY);
  } else {
    if (TweenMax.isTweening(container)) {
      return;
    }
    // up/down arrow clicks
    if (this.id === "downArrow" || this.id === "upArrow") {
      activeSlide = this.id === "downArrow" ? (activeSlide += 1) : (activeSlide -= 1);
      // click on a dot
    } else if (this.className === "dot") {
      activeSlide = this.index;
      // scrollwheel
    } else {
      activeSlide = e.deltaY > 0 ? (activeSlide += 1) : (activeSlide -= 1);
    }
  }
  // make sure we're not past the end or beginning slide
  activeSlide = activeSlide < 0 ? 0 : activeSlide;
  activeSlide = activeSlide > slides.length - 1 ? slides.length - 1 : activeSlide;
  if (oldSlide === activeSlide) {
    return;
  }
  // if we're dragging we don't animate the container
  if (this.id != "dragger") {
     TweenMax.to(container, dur, { y: offsets[activeSlide], ease:Power2.easeInOut, onUpdate:tweenDot });
  }
}

TweenMax.set(".hideMe", {opacity:1});
window.addEventListener("wheel", slideAnim);
window.addEventListener("resize", newSize);

// make the container a draggable element
  var dragMe = Draggable.create(container, {
  type: "y",
  edgeResistance: 1,
  onDragEnd: slideAnim,
  onDrag: tweenDot,
  onThrowUpdate: tweenDot,
  snap: offsets,
  throwProps:true,
  zIndexBoost: false,
  allowNativeTouchScrolling: false,
  bounds: "#masterWrap"
});

dragMe[0].id = "dragger";
newSize();

// resize all panels and refigure draggable snap array
function newSize() {
  offsets = [];
  ih = window.innerHeight;
  TweenMax.set("#panelWrap", { height: slides.length * ih });
  TweenMax.set(slides, { height: ih });
  for (let i = 0; i < slides.length; i++) {
    offsets.push(-slides[i].offsetTop);
  }
  TweenMax.set(container, { y: offsets[activeSlide] });
  dragMe[0].vars.snap = offsets;
}

// tween the dot animation as the draggable moves
  function tweenDot() {
  TweenMax.set(dotAnim, {time:Math.abs(container._gsTransform.y/ih) + 1});
}




