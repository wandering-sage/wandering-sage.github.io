var mediaQuery = window.matchMedia('(max-width: 550px)');

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
    document.body.style.overflowY = "scroll";
    document.body.classList.add("show")
    loader.style.display = "none";
    enableScroll();
    
    setTimeout(()=>{
        h.forEach(addRemoveClass);
        avatar.style.transform = "translateY(0)";
        avatar.style.opacity = "1";
    }, 400
    )
    
}

function addRemoveClass(h){
    h.classList.remove("text-hide");
    h.classList.add("text-reveal");
}


// --------------------------Project card------------------------------

class ProjectCard{
    constructor(parentEl, name, imgUrl, width = 500, height = 250){
        ProjectCard.cardCount++;
        this.parentEl = parentEl;
        this.height = height;
        this.width = width;
        this.imgUrl = imgUrl;
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
        aTag.href = "#";
        wrap.appendChild(aTag);
        // aTag.onclick = runThis;
        aTag.addEventListener('click', (e)=>{
            runThis(e,this);
        });

        var card = document.createElement("div");
	    card.className = "proj-card";
        card.style.width = this.width + "px";
        card.style.height = this.height+ "px";
        card.setAttribute("data-id",ProjectCard.cardCount);
        if(this.imgUrl){
            card.style.backgroundImage = `url("${this.imgUrl}")`;
        }
        aTag.appendChild(card);

        var projReavel = document.createElement("div");
	    projReavel.className = "proj-reveal";
        card.appendChild(projReavel);

        var curtain = document.createElement("div");
	    curtain.className = "curtain";
        projReavel.appendChild(curtain);

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
            this.style.transform = `perspective(700px) scale3d(1.05,1.05,1.05) rotateY(${y}deg) rotateX(${x}deg)`;
            this.style.boxShadow = "15px 15px 45px -20px black";
        }
        function initCard(e){
            this.style.transition = "all 300ms ease-in";
            this.style.transform = `scale3d(1,1,1) rotateY(0deg) rotateX(0deg)`;
            this.style.boxShadow = "none";
            projData.style.transform = "translateZ(0)";
        }
        function runThis(e, t){
            console.log(e);
            e.preventDefault();
            projName.classList.add("cover");
            projNum.classList.add("cover");
            curtain.classList.add("move");
            root.style.setProperty("--reveal-delay", "0.33s");
            root.style.setProperty("--hide-delay", "0s");
            setTimeout(openProject,450,t);
        }
        function openProject(t){
            disableScroll();
            history.pushState(null, null, location.href);
            window.onpopstate = function () {
                if(document.querySelector(".open-project").classList.contains("reveal")){
                    closeProject();
                }
            };
            var projContainer = document.querySelector(".open-project");
            projContainer.classList.remove("hide");
            projContainer.classList.add("reveal");

            var closeBtn = document.querySelector(".proj-close-btn");
            closeBtn.onclick = ()=>{
                history.back();
                closeProject();
            }

            var title = document.querySelector(".proj-title");
            title.innerText = t.name;

            var img = document.querySelector(".proj-content img");
            img.setAttribute("src", t.imgUrl);

            var descDiv = document.querySelector(".proj-desc");
            descDiv.innerHTML = makeList(projDesc[t.name]);

            var gitLink = document.querySelector("a.github-btn");
            gitLink.setAttribute("href", projGithub[t.name]);

            gitLink.addEventListener("mouseenter",()=>{
                document.querySelector("#code-left").classList.add("backToOriginal");
                document.querySelector("#code-right").classList.add("backToOriginal");
            })
            gitLink.addEventListener("mouseleave",()=>{
                document.querySelector("#code-left").classList.remove("backToOriginal");
                document.querySelector("#code-right").classList.remove("backToOriginal");
            })

            var projLink = document.querySelector("a.launch-btn");
            projLink.setAttribute("href", projInAction[t.name]);

            projLink.addEventListener("mouseenter", ()=>{
                document.querySelector("#website").classList.add("backToOriginal");
            })
            projLink.addEventListener("mouseleave", ()=>{
                document.querySelector("#website").classList.remove("backToOriginal");
            })

            // Cursor updation
            var links = document.querySelectorAll("a");
            links.forEach(updateMouseSize);

            if(mediaQuery.matches){
                setTimeout(()=>{
                    document.querySelector("#code-left").classList.add("backToOriginal");
                    document.querySelector("#code-right").classList.add("backToOriginal");
                    document.querySelector("#website").classList.add("backToOriginal");
                }, 600);
            }

            function closeProject(){
                root.style.setProperty("--reveal-delay", "0s");
                root.style.setProperty("--hide-delay", "0.33s");
                projContainer.classList.remove("reveal");
                projContainer.classList.add("hide");
                setTimeout(()=>{
                    projName.classList.remove("cover");
                    projNum.classList.remove("cover");
                    curtain.classList.remove("move");
                }, 600);

                if(mediaQuery.matches){
                    document.querySelector("#code-left").classList.remove("backToOriginal");
                    document.querySelector("#code-right").classList.remove("backToOriginal");
                    document.querySelector("#website").classList.remove("backToOriginal");
                }
                enableScroll();
            }

            function makeList(arr){
                var ret = "<ul>";
                arr.forEach(str=>{
                    ret += `<li>${str}</li>`;
                })
                ret+="</ul>";
                return ret;
            }

        }
    }
}
var root = document.documentElement;

ProjectCard.cardCount = 0;
ProjectCard.cardPos = [["7%","0"],["23%","115px"], ["70%","-360px"], ["7%","-300px"], ["55%","-400px"]];
var projects = ["algo visualizer", "algo snake", "recipe box", "piano", "canvas"];

var projContainer = document.querySelector(".project-container");

projects.forEach(p=>{
    if(p == "recipe box"){
        var w = 290;
        var h = 550;
    }
    if(mediaQuery.matches){
        ProjectCard.cardPos = [["25%","150px"],["25%","215px"], ["25%","280px"], ["25%","345px"], ["25%","405px"]];
        var w = 220;
        var h = 110;
        if(p == "recipe box"){
            var w = 130;
            var h = 250;
        }
    }
    new ProjectCard(projContainer, p, `./images/projects/${p}.png`,w,h);
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
    var screenPos = window.innerHeight / 1.25;
    list.forEach(e=>{
        if(e.getBoundingClientRect().top < screenPos && !e.classList.contains("appear-on-scroll")){
            e.classList.add("appear-on-scroll");
        }
    })
}

window.addEventListener("scroll", scrollAppear);



// ------------------timeline-------------------------

var timeLine = document.querySelector(".timeline");
timeLine.style.height = document.body.clientHeight - 225 + "px";


// ------------------cursor-------------------------

var links = document.querySelectorAll("a, button");
// var cursor = document.querySelector(".cursor");
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
    // cursor.style.transform = `translateX(${e.pageX}px) translateY(${e.pageY}px) translate(-50%,-50%)`;
    cursorSlow.style.transform = `translateX(${e.pageX}px) translateY(${e.pageY}px) translate(-50%,-50%) scale(${mSize})`;

    if(e.clientY < 40 && navBar.classList.contains("nav-hide")){
        navBar.classList.remove("nav-hide");
    }
}

function scrollMouse(){
    // cursor.style.transform = `translateX(${mouseX}px) translateY(${mouseY + window.scrollY}px) translate(-50%,-50%)`;
    cursorSlow.style.transform = `translateX(${mouseX}px) translateY(${mouseY + window.scrollY}px) translate(-50%,-50%) scale(${mSize})`;
}

// ------------------------------------media-query---------------------------------------

var findMeOnText = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>Github`,
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M5 3c0 1.062-0.71 1.976-2.001 1.976-1.215 0-1.999-0.862-1.999-1.924 0-1.090 0.76-2.052 2-2.052s1.976 0.91 2 2zM1 19v-13h4v13h-4z"></path> <path d="M7 10.444c0-1.545-0.051-2.836-0.102-3.951h3.594l0.178 1.723h0.076c0.506-0.811 1.746-2 3.822-2 2.532 0 4.432 1.695 4.432 5.342v7.442h-4v-6.861c0-1.594-0.607-2.81-2-2.81-1.062 0-1.594 0.86-1.873 1.569-0.102 0.254-0.127 0.608-0.127 0.963v7.139h-4v-8.556z"></path></svg>Linkedin`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 390.04"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M512,24.14V365.9A24.14,24.14,0,0,1,487.85,390H452.29V94.51L256,237.58,59.71,94.51V390H24.14A24.14,24.14,0,0,1,0,365.9V24.14A24.14,24.14,0,0,1,24.14,0h14L256,158.81,473.89,0h14A24.14,24.14,0,0,1,512,24.14Z"/></g></g></svg>Gmail`,
]


if(mediaQuery.matches){
    var contacts = document.querySelectorAll(".social-container a");
    contacts.forEach((e,i)=>{
        e.innerHTML = findMeOnText[i];
    })
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

// --------------------------Data------------------------------

var projDesc = {
    "algo visualizer" : ["This is a Sorting Algorithm Visualizing website, made with vanilla JavaScript.", "It contains various algo like Quick Sort, Merge Sort, etc", "Array Size and Sorting speed can be controlled by user."],
    "piano" : ["This is website to play piano using keyboard keys.", "It also have some pre-loaded songs which can be played by hitting the green Autoplay button.", "Usear can create their own sequence of keys to be played under Custom song"],
    "recipe box" : ["This is an Android app containing a lot of common recipes", " You need to log in to use this app, if you dont have an account you can create a new one.", "User can search, view and create recipes. They can also update their profile"],
    "canvas" : ["A website where you can draw or paint anything.", "It have tools like Brush Tool, Eraser Tool and Bucket Tool.", "User can download what they have created as a png image."],
    "truth dare" : ["A Website where you can play truth-dare with frinds.", "Player's turn is decided by a spinning disk with player names written on it.", "You can add/remove players at any stage of the game.", "A choice b/w truth or dare will be given to the player.", "Depanding on player's choice a random task/question will be asked"],
    "algo snake" : ["This is a web-app where you can play snake game and visualize path finding algorithms at any state of the game.", "It has \"Autoplay\" mode, where computer calculates the best path using A-star Algorithm and plays the game in real time", "Users can pause the game and visualize Dijkstra’s Algorithm and A-star Algorithm"],

}

var projGithub = {
    "algo visualizer" : "https://github.com/wandering-sage/Algo-Visualizer",
    "piano" : "https://github.com/wandering-sage/Piano",
    "recipe box" : "https://github.com/wandering-sage/RecipeBox",
    "canvas" : "https://github.com/wandering-sage/Canvas",
    "truth dare" : "https://github.com/wandering-sage/Truth-Dare",
    "algo snake" : "https://github.com/wandering-sage/algo-snake"
}

var projInAction = {
    "algo visualizer" : "https://wandering-sage.github.io/Algo-Visualizer/",
    "piano" : "https://wandering-sage.github.io/Piano/",
    "recipe box" : "https://github.com/wandering-sage/RecipeBox",
    "canvas" : "https://wandering-sage.github.io/Canvas/",
    "truth dare" : "https://wandering-sage.github.io/Truth-Dare/",
    "algo snake" : "https://wandering-sage.github.io/algo-snake"
}
