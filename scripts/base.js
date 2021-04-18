// --------------------text change---------------------
class TextEffect {
    constructor(txtElement) {
        this.words = ["websites", "mobile apps", "software", "webapps", "ui/ux", "things" ];
        this.possible = "\\_{ßæ+$ç^♪]©>@¥å}[§Æ&ΩΣ~░¢Δ#ßØσ░▓€ƒ«∞£Σ&≈@¥#εÐΔ≈»√ΞΔξ∫πÃΩδγ€μΨΖζ";
        this.txtElement = txtElement;
        this.wordIndex = 0;
        this.wait = 2000;
        this.delay = 20;
        this.spanThis(this.words[0]);
        setTimeout(()=>this.toNextWord(), this.wait);
    }
    toNextWord(){
        var a = createNumSeq(this.words[this.wordIndex].length);
        shuffleArray(a);
        var totalTime = 1000;
        var arbitrary = this.possible;

        a.every((e,i)=>{
            if(i>a.length*0.5){
                return false;
            }
            totalTime+=this.delay;
            var x = arbitrary.charAt(Math.floor(Math.random() * arbitrary.length));
            arbitrary.replace(x,"");
            setTimeout(()=>{this.allSpans()[e].innerText=x},totalTime);
        });
        this.wordIndex++;
        this.wordIndex %= this.words.length;
        var nextWord = this.words[this.wordIndex];

        adjustSpans.call(this,this.allSpans(),nextWord.length);

        for(var j = 0;j<10;j++){
            var a = createNumSeq(nextWord.length);
            shuffleArray(a);
            a.forEach((e,i)=>{
                if(i>a.length*0.6){
                    return false;
                }
                totalTime+=this.delay-15;
                var x = arbitrary.charAt(Math.floor(Math.random() * arbitrary.length));
                // arbitrary.replace(x,"");
                setTimeout(()=>{this.allSpans()[e].innerText=x},totalTime);
            });
        }
        
        var a = createNumSeq(nextWord.length);
        shuffleArray(a);
        var c = 0;
        a.forEach((e,i)=>{
            var d = (1 - nextWord.length/5)/5; 
            totalTime+=easeOut(c,this.delay-5,25,200) + d*this.delay;
            c+=easeOut(c,this.delay-5,25,200);
            var x = nextWord[e];
            setTimeout(()=>{this.allSpans()[e].innerText=x},totalTime);
        });
        setTimeout(()=>this.toNextWord(), this.wait);

        function easeOut(t, b, c, d) {
            return b + (c-b)*(1-(1-t/d)*(1-t/d));
        };

        function createNumSeq(l) {
            var res = [];
            for(let i = 0; i<l; i++){
                res.push(i);
            }
            return res;
        }

        function adjustSpans(all,len){
            var t = len-all.length;
            if(t == 0) return;
            if(t>0){
                for(let i = 0;i<t;i++){
                    totalTime+=this.delay;
                    let x = this.possible.charAt(Math.floor(Math.random() * this.possible.length));
                    setTimeout(()=>this.spanThis(x),totalTime);
                }
            }
            else{
                for(let i = t;i<0;i++){
                    totalTime+=this.delay;
                    setTimeout(()=>this.allSpans()[this.allSpans().length-1].remove(),totalTime);
                }
            }
        }
    }
    spanThis(name){
        for(let i = 0; i<name.length; i++){
            var ch = name[i];
            let s = document.createElement("span");
            s.classList.add("anim-txt");
            s.innerText = ch;
            this.txtElement.appendChild(s);
        };
    }
    allSpans(){
        return document.querySelectorAll(".anim-txt");
    }
}

var txtEffect = new TextEffect(document.querySelector(".spl-txt"));


// ----------------------- nav-bar----------------------------

var lastScrollTop = 0;
var navBar = document.querySelector(".nav-bar");

window.addEventListener("scroll", function(){ 
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop){
        navBar.classList.add("nav-hide");
    } 
    else {
        navBar.classList.remove("nav-hide");
    }
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);

// ----------------------- nav-bar-scroll----------------------------

function smoothScroll(target, duration) {
    var target = document.querySelector(target);
    var distance = target.getBoundingClientRect().top;
    var startPosition = window.pageYOffset;
    var startTime = null;

    function scrollAnimation(currentTime) {
        if (startTime === null) startTime = currentTime;
        var timeElapsed = currentTime - startTime;
        var run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(scrollAnimation);
    }
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    requestAnimationFrame(scrollAnimation);
}

var navLinks = document.querySelectorAll(".nav-link");

var scrollLinks = document.querySelectorAll(".scroll-bottom");

scrollLinks.forEach(addScrollClick);
navLinks.forEach(addScrollClick);
    
function addScrollClick(l){
    l.addEventListener("click",e=>{
        e.preventDefault();
        var t = e.target.getAttribute('href') || e.target.parentElement.getAttribute('href');
        if(t){
            smoothScroll(t, 800);
        }
    })
}


// --------------------------nav-bar-highlight------------------------------

window.addEventListener("scroll", findActive);
var idxActive = 0;

function findActive(){
    var curViewOn = document.querySelector(navLinks[idxActive].children[0].getAttribute('href'));
    if(curViewOn.getBoundingClientRect().bottom<50){
        updateActive(idxActive+1);
    }
    if(curViewOn.getBoundingClientRect().bottom>curViewOn.getBoundingClientRect().height+50){
        updateActive(idxActive-1);
    }
}

function updateActive(x){
    navLinks[idxActive].classList.remove("active");
    navLinks[x].classList.add("active");
    idxActive = x;
}


// --------------------------On Load / text reveal------------------------------

var h = document.querySelectorAll(".text-hide");
var loader = document.querySelector(".loader");
var avatar = document.querySelector(".hero-anim");

disableScroll();

document.body.onload = ()=>{
    document.body.classList.add("show")
    loader.style.display = "none";
    enableScroll();
    
    setTimeout(()=>{
        h.forEach(addRemoveClass);
        avatar.style.transform = "translateY(0)";
        avatar.style.opacity = "1";
    }, 500
    )
    
}

function addRemoveClass(h){
    h.classList.remove("text-hide");
    h.classList.add("text-reveal");
}


// --------------------------Project card------------------------------

class ProjectCard{
    constructor(parentEl, name, link, imgUrl, width = 500, height = 250){
        ProjectCard.cardCount++;
        this.parentEl = parentEl;
        this.height = height;
        this.width = width;
        this.imgUrl = imgUrl;
        this.link = link;
        this.name = name;
        this.createCard();
    }
    createCard(){
        var wrap = document.createElement("div");
        wrap.style.width = this.width + "px";
        wrap.style.height = this.height + "px";
	    wrap.className = "card-wrap"; 
        wrap.style.left = ProjectCard.cardPos[ProjectCard.cardCount-1][0];
        wrap.style.top = ProjectCard.cardPos[ProjectCard.cardCount-1][1];
        this.parentEl.appendChild(wrap);

        // Attaching Link of project
        var aTag = document.createElement("a");
        aTag.href = this.link;
        wrap.appendChild(aTag);
        aTag.onclick = runThis;

        var card = document.createElement("div");
	    card.className = "proj-card";
        card.style.width = this.width + "px";
        card.style.height = this.height+ "px";
        card.setAttribute("data-id",ProjectCard.cardCount);
        if(this.imgUrl){
            card.style.backgroundImage = `url("${this.imgUrl}")`;
        }
        aTag.appendChild(card);

        // Creating Project Info
        var projData = document.createElement("div");
	    projData.className = "proj-data";
        card.appendChild(projData);
        var projName = document.createElement("div");
        projName.className = "proj-name";
        projData.appendChild(projName);
        var divider = document.createElement("div");
	    divider.className = "divider";
        projData.appendChild(divider);
        var projNum = document.createElement("div");
        projNum.className = "proj-num";
        projData.appendChild(projNum);
        projNum.innerText = "0"+ProjectCard.cardCount;

        projName.innerHTML = this.name.replace(" ", "<br/>");

        card.addEventListener("mouseenter", addTransmitiion);
        card.addEventListener("mousemove", makeIt3d);
        card.addEventListener("mouseleave", initCard);

        function addTransmitiion(){
            this.style.transition = "transform 200ms ease-out";
            projData.style.transform = "translateZ(40px)";
            setTimeout(()=>this.style.transition = "none",200);
        }

        function makeIt3d(e){
            let x = mapValue(e.offsetY,0,this.offsetHeight, -15, 15);
            let y = mapValue(e.offsetX,0,this.offsetWidth, 15, -15);
            this.style.transform = `scale3d(1.05,1.05,1.05) rotateY(${y}deg) rotateX(${x}deg)`;
            this.style.boxShadow = "15px 15px 45px -20px black";
        }
        function initCard(e){
            this.style.transition = "all 300ms ease-in";
            this.style.transform = `scale3d(1,1,1) rotateY(0deg) rotateX(0deg)`;
            this.style.boxShadow = "none";
            projData.style.transform = "translateZ(0)";
        }
        function runThis(e){
            e.preventDefault();
            projName.classList.add("cover");
            projNum.classList.add("cover");
            root.style.setProperty("--reveal-delay", "0.33s");
            root.style.setProperty("--hide-delay", "0s");
            setTimeout(openProject,450,e);
        }
        function openProject(e){
            disableScroll();
            var projContainer = document.querySelector(".open-project");
            projContainer.classList.remove("hide");
            projContainer.classList.add("reveal");

            var closeBtn = document.querySelector(".proj-close-btn");
            closeBtn.onclick = closeProject;

            console.log(e.target)

            // Cursor updation
            var links = document.querySelectorAll("a");
            links.forEach(updateMouseSize);

            function closeProject(){
                root.style.setProperty("--reveal-delay", "0s");
                root.style.setProperty("--hide-delay", "0.33s");
                projContainer.classList.remove("reveal");
                projContainer.classList.add("hide");
                setTimeout(()=>{
                    projName.classList.remove("cover");
                    projNum.classList.remove("cover");
                }, 600);

                enableScroll();
            }

        }
    }
}
var root = document.documentElement;

ProjectCard.cardCount = 0;
ProjectCard.cardPos = [["7%","0"],["23%","115px"], ["70%","-360px"], ["7%","-300px"], ["55%","-400px"]];
var projects = ["algo visualizer", "piano", "recipe box", "canvas", "truth dare"];
var projContainer = document.querySelector(".project-container");
projects.forEach(p=>{
    if(p == "recipe box"){
        var w = 290;
        var h = 550;
    }
    new ProjectCard(projContainer, p, "#", `./images/projects/${p}.png`,w,h);
});

// To diable Scroll when project is shown

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; } 
    }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    document.querySelector("body").classList.add("disable-scroll");
}

// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    document.querySelector("body").classList.remove("disable-scroll");
}

// ------------project-card-scroll----------

function scrollAppear(){
    var list = document.querySelectorAll(".proj-card");
    var screenPos = window.innerHeight / 1.5;
    list.forEach(e=>{
        if(e.getBoundingClientRect().top < screenPos && !e.classList.contains("appear-on-scroll")){
            e.classList.add("appear-on-scroll");
        }
    })
}

window.addEventListener("scroll", scrollAppear);



// ------------------timeline-------------------------

var timeLine = document.querySelector(".timeline");
timeLine.style.height = document.body.clientHeight - 255 + "px";


// ------------------cursor-------------------------

var links = document.querySelectorAll("a, button");
var cursor = document.querySelector(".cursor");
var cursorSlow = document.querySelector(".cursor-slow");
var mouseY = 0;
var mouseX = 0;
var mSize = 1;


window.addEventListener("mousemove",followMouse);
window.addEventListener("scroll",scrollMouse);

links.forEach(updateMouseSize)

function updateMouseSize(link){
    link.addEventListener("mouseover", ()=>{
        mSize = 2.7;
    });
    link.addEventListener("mouseleave", ()=>{
        mSize = 1;
    });
};

function followMouse(e){
    mouseY = e.clientY;
    mouseX = e.pageX;
    cursor.style.transform = `translateX(${e.pageX}px) translateY(${e.pageY}px) translate(-50%,-50%)`;
    cursorSlow.style.transform = `translateX(${e.pageX}px) translateY(${e.pageY}px) translate(-50%,-50%) scale(${mSize})`;

    if(e.clientY < 40 && navBar.classList.contains("nav-hide")){
        navBar.classList.remove("nav-hide");
    }
}

function scrollMouse(){
    cursor.style.transform = `translateX(${mouseX}px) translateY(${mouseY + window.scrollY}px) translate(-50%,-50%)`;
    cursorSlow.style.transform = `translateX(${mouseX}px) translateY(${mouseY + window.scrollY}px) translate(-50%,-50%) scale(${mSize})`;
}



// --------------------------utils------------------------------

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function mapValue(val, minFrom, maxFrom, minTo, maxTo) {
	return ((val - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo;
}
