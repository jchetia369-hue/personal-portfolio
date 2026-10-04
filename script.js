
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const music = document.getElementById("backgroundMusic");

    const enterWebsiteButton =
        document.getElementById("musicButton");

    const audioButton =
        document.getElementById("audioButton");

    const ultronButton =
        document.getElementById("ultronButton");


    /* =========================================================
       MUSIC STATE
       
       Initial:
       Music OFF
       Icon 🔊
       
       ON  = 🔊
       OFF = 🔇
    ========================================================= */

    let musicPlaying = false;


    /* =========================================================
       FORCE BUTTON TYPE
    ========================================================= */

    if (enterWebsiteButton) {
        enterWebsiteButton.type = "button";
    }

    if (audioButton) {
        audioButton.type = "button";
    }

    if (ultronButton) {
        ultronButton.type = "button";
    }


    /* =========================================================
       UPDATE MUSIC ICON
       
       ON  → 🔊
       OFF → 🔇
    ========================================================= */

    function updateMusicIcon() {

        if (!audioButton) {
            return;
        }

        if (musicPlaying) {

            audioButton.textContent = "🔊";

            audioButton.setAttribute(
                "aria-label",
                "Turn music off"
            );

            audioButton.setAttribute(
                "title",
                "Turn music off"
            );

            audioButton.classList.add("music-on");
            audioButton.classList.remove("music-off");

        } else {

            audioButton.textContent = "🔇";

            audioButton.setAttribute(
                "aria-label",
                "Turn music on"
            );

            audioButton.setAttribute(
                "title",
                "Turn music on"
            );

            audioButton.classList.add("music-off");
            audioButton.classList.remove("music-on");
        }
    }


    /* =========================================================
       START MUSIC
    ========================================================= */

    async function startMusic() {

        if (!music) {

            console.error(
                "backgroundMusic element not found."
            );

            return false;
        }

        try {

            music.muted = false;
            music.volume = 1;

            await music.play();

            musicPlaying = true;

            updateMusicIcon();

            console.log("Music ON");

            return true;

        } catch (error) {

            console.error(
                "Music could not play:",
                error
            );

            musicPlaying = false;

            updateMusicIcon();

            return false;
        }
    }


    /* =========================================================
       STOP MUSIC
    ========================================================= */

    function stopMusic() {

        if (!music) {
            return;
        }

        music.pause();

        music.muted = true;

        /*
         * Current position is NOT reset.
         * Music continues from the same position
         * when started again.
         */

        musicPlaying = false;

        updateMusicIcon();

        console.log("Music OFF");
    }


    /* =========================================================
       TOGGLE MUSIC
       
       OFF → ON
       ON  → OFF
    ========================================================= */

    async function toggleMusic() {

        if (musicPlaying) {

            stopMusic();

        } else {

            await startMusic();
        }
    }


    /* =========================================================
       INITIAL MUSIC STATE
       
       Music OFF.
       
       Initial button icon requested:
       🔊
    ========================================================= */

    if (music) {

        music.pause();

        music.muted = true;

        musicPlaying = false;
    }


    if (audioButton) {

        audioButton.textContent = "🔊";

        audioButton.setAttribute(
            "aria-label",
            "Turn music on"
        );

        audioButton.setAttribute(
            "title",
            "Turn music on"
        );

        audioButton.classList.add("music-off");

        audioButton.classList.remove("music-on");
    }


    /* =========================================================
       MUSIC BUTTON
       
       ONLY CONTROLS MUSIC.
       
       It does NOT:
       - enter website
       - hide Enter Website
       - activate Ultron
       - navigate
    ========================================================= */

    if (audioButton) {

        audioButton.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();
                event.stopPropagation();

                await toggleMusic();
            }
        );
    }


    /* =========================================================
       ENTER WEBSITE
       
       This function is used by:
       
       1. Enter Website button
       2. Ultron voice command
       
       Both will:
       - Start music
       - Hide Enter Website button
       - Enter website
       - Scroll to Home
    ========================================================= */

    async function enterWebsite() {

        console.log(
            "Entering website..."
        );


        /* -----------------------------------------
           START MUSIC
        ----------------------------------------- */

        await startMusic();


        /* -----------------------------------------
           HIDE ENTER WEBSITE BUTTON
        ----------------------------------------- */

        if (enterWebsiteButton) {

            enterWebsiteButton.style.display =
                "none";

            enterWebsiteButton.setAttribute(
                "aria-hidden",
                "true"
            );
        }


        /* -----------------------------------------
           WEBSITE ENTERED
        ----------------------------------------- */

        document.body.classList.add(
            "website-entered"
        );


        /* -----------------------------------------
           GO TO HOME
        ----------------------------------------- */

        const home =
            document.getElementById("home");

        if (home) {

            setTimeout(() => {

                home.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 100);
        }


        console.log(
            "Website entered successfully."
        );
    }


    /* =========================================================
       ENTER WEBSITE BUTTON
       
       Clicking this button:
       
       → Starts music
       → Enters website
       → Hides button
    ========================================================= */

    if (enterWebsiteButton) {

        enterWebsiteButton.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();
                event.stopPropagation();

                await enterWebsite();
            }
        );
    }


    /* =========================================================
       ULTRON AI
    ========================================================= */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    const Ultron = {

        active: false,

        listening: false,

        recognition: null,


        /* =====================================================
           NORMALIZE COMMAND
        ===================================================== */

        normalize(text) {

            return String(text || "")
                .toLowerCase()
                .trim()
                .replace(/\baltaron\b/g, "ultron")
                .replace(/\baltron\b/g, "ultron")
                .replace(/\boltron\b/g, "ultron")
                .replace(/\bultra\b/g, "ultron");
        },


        /* =====================================================
           SPEAK
        ===================================================== */

        speak(text, callback) {

            if (!("speechSynthesis" in window)) {

                if (callback) {
                    callback();
                }

                return;
            }


            window.speechSynthesis.cancel();


            const speech =
                new SpeechSynthesisUtterance(text);


            speech.lang = "en-US";

            speech.rate = 0.95;

            speech.pitch = 0.72;

            speech.volume = 1;


            speech.onend = () => {

                if (callback) {
                    callback();
                }
            };


            window.speechSynthesis.speak(
                speech
            );
        },


        /* =====================================================
           ACTIVATE ULTRON
           
           Ultron button ONLY activates Ultron.
           
           It does NOT enter website.
        ===================================================== */

        activate() {

            if (ultronButton) {

                ultronButton.type =
                    "button";
            }


            this.stopListening();


            this.active = true;


            if (ultronButton) {

                ultronButton.classList.add(
                    "ultron-active"
                );

                ultronButton.setAttribute(
                    "aria-pressed",
                    "true"
                );
            }


            this.speak(
                "Ultron is ready. What's your command?",
                () => {

                    if (this.active) {

                        this.startListening();
                    }
                }
            );
        },


        /* =====================================================
           START VOICE LISTENING
        ===================================================== */

        startListening() {

            if (!this.active) {
                return;
            }


            if (!SpeechRecognition) {

                this.speak(
                    "Voice recognition is not supported in this browser."
                );

                return;
            }


            this.stopListening();


            const recognition =
                new SpeechRecognition();


            this.recognition =
                recognition;


            recognition.lang =
                "en-US";


            recognition.continuous =
                false;


            recognition.interimResults =
                false;


            recognition.maxAlternatives =
                3;


            /* -----------------------------------------
               RECOGNITION START
            ----------------------------------------- */

            recognition.onstart = () => {

                this.listening = true;


                if (ultronButton) {

                    ultronButton.classList.add(
                        "ultron-listening"
                    );
                }
            };


            /* -----------------------------------------
               VOICE RESULT
            ----------------------------------------- */

            recognition.onresult = (event) => {

                let command = "";


                if (
                    event.results &&
                    event.results.length > 0
                ) {

                    command =
                        event.results[
                            event.results.length - 1
                        ][0].transcript;
                }


                command =
                    this.normalize(command);


                console.log(
                    "ULTRON COMMAND:",
                    command
                );


                this.handleCommand(
                    command
                );
            };


            /* -----------------------------------------
               ERROR
            ----------------------------------------- */

            recognition.onerror = (event) => {

                console.warn(
                    "Ultron error:",
                    event.error
                );


                this.listening = false;


                if (ultronButton) {

                    ultronButton.classList.remove(
                        "ultron-listening"
                    );
                }


                if (
                    event.error === "not-allowed"
                ) {

                    this.speak(
                        "Microphone permission is required."
                    );
                }
            };


            /* -----------------------------------------
               END
            ----------------------------------------- */

            recognition.onend = () => {

                this.listening = false;


                if (ultronButton) {

                    ultronButton.classList.remove(
                        "ultron-listening"
                    );
                }
            };


            /* -----------------------------------------
               START
            ----------------------------------------- */

            try {

                recognition.start();

            } catch (error) {

                console.warn(
                    "Ultron could not start:",
                    error
                );
            }
        },


        /* =====================================================
           STOP LISTENING
        ===================================================== */

        stopListening() {

            if (this.recognition) {

                try {

                    this.recognition.stop();

                } catch (error) {

                    // Recognition already stopped.
                }


                this.recognition = null;
            }


            this.listening = false;


            if (ultronButton) {

                ultronButton.classList.remove(
                    "ultron-listening"
                );
            }
        },


        /* =====================================================
           NAVIGATE TO SECTION
        ===================================================== */

        goTo(id) {

            const section =
                document.getElementById(id);


            if (!section) {

                this.speak(
                    "That section was not found."
                );

                return;
            }


            section.scrollIntoView({

                behavior: "smooth",

                block: "start"
            });
        },


        /* =====================================================
           HANDLE COMMAND
        ===================================================== */

        async handleCommand(command) {

            command =
                this.normalize(command);


            /* ================================================
               ENTER WEBSITE
               
               ULTRON CAN NOW:
               
               → Enter website automatically
               → Start music
               → Hide Enter Website button
               
               IMPORTANT:
               There is NO "Please tap the button" message.
            ================================================= */

            if (
                command.includes("enter website") ||
                command.includes("enter the website") ||
                command.includes("open website") ||
                command.includes("open the website") ||
                command.includes("start website") ||
                command.includes("start the website") ||
                command.includes("launch website") ||
                command.includes("launch the website") ||
                command.includes("go to website") ||
                command.includes("go to the website")
            ) {

                console.log(
                    "Ultron entering website..."
                );


                this.stopListening();


                /* -----------------------------------------
                   ENTER WEBSITE + MUSIC
                ----------------------------------------- */

                await enterWebsite();


                /* -----------------------------------------
                   CONFIRMATION
                ----------------------------------------- */

                this.speak(
                    "Website entered. Music is on."
                );


                return;
            }


            /* ================================================
               MUSIC ON
            ================================================= */

            if (
                command === "music on" ||
                command.includes("turn music on") ||
                command.includes("play music") ||
                command.includes("start music") ||
                command.includes("enable music") ||
                command.includes("unmute music") ||
                command.includes("audio on")
            ) {

                await startMusic();


                this.speak(
                    "Music is on."
                );


                return;
            }


            /* ================================================
               MUSIC OFF
            ================================================= */

            if (
                command === "music off" ||
                command.includes("turn music off") ||
                command.includes("stop music") ||
                command.includes("pause music") ||
                command.includes("mute music") ||
                command.includes("disable music") ||
                command.includes("audio off")
            ) {

                stopMusic();


                this.speak(
                    "Music is off."
                );


                return;
            }


            /* ================================================
               HOME
            ================================================= */

            if (
                command === "home" ||
                command.includes("go home") ||
                command.includes("go to home") ||
                command.includes("show home")
            ) {

                this.goTo("home");


                this.speak(
                    "Opening home."
                );


                return;
            }


            /* ================================================
               ABOUT
            ================================================= */

            if (
                command === "about" ||
                command.includes("about me") ||
                command.includes("show about") ||
                command.includes("go to about")
            ) {

                this.goTo("about");


                this.speak(
                    "Opening about."
                );


                return;
            }


            /* ================================================
               SKILLS
            ================================================= */

            if (
                command === "skills" ||
                command.includes("show skills") ||
                command.includes("my skills") ||
                command.includes("go to skills")
            ) {

                this.goTo("skills");


                this.speak(
                    "Opening skills."
                );


                return;
            }


            /* ================================================
               PROJECTS
            ================================================= */

            if (
                command === "projects" ||
                command.includes("show projects") ||
                command.includes("my projects") ||
                command.includes("go to projects")
            ) {

                this.goTo("projects");


                this.speak(
                    "Opening projects."
                );


                return;
            }


            /* ================================================
               EXPERIENCE
            ================================================= */

            if (
                command === "experience" ||
                command.includes("show experience") ||
                command.includes("go to experience")
            ) {

                this.goTo("experience");


                this.speak(
                    "Opening experience."
                );


                return;
            }


            /* ================================================
               TESTIMONIALS
            ================================================= */

            if (
                command.includes("testimonials") ||
                command.includes("reviews") ||
                command.includes("show reviews")
            ) {

                this.goTo("testimonials");


                this.speak(
                    "Opening testimonials."
                );


                return;
            }


            /* ================================================
               FAQ
            ================================================= */

            if (
                command === "faq" ||
                command.includes("show faq") ||
                command.includes("questions")
            ) {

                this.goTo("faq");


                this.speak(
                    "Opening frequently asked questions."
                );


                return;
            }


            /* ================================================
               CONTACT
            ================================================= */

            if (
                command === "contact" ||
                command.includes("contact me") ||
                command.includes("show contact") ||
                command.includes("go to contact")
            ) {

                this.goTo("contact");


                this.speak(
                    "Opening contact."
                );


                return;
            }


            /* ================================================
               STOP ULTRON
            ================================================= */

            if (
                command.includes("stop ultron") ||
                command.includes("turn off ultron") ||
                command.includes("disable ultron") ||
                command.includes("goodbye ultron")
            ) {

                this.deactivate();

                return;
            }


            /* ================================================
               HELP
            ================================================= */

            if (
                command === "help" ||
                command.includes("what can you do") ||
                command.includes("commands")
            ) {

                this.speak(
                    "I can enter the website, control music, and navigate your website sections."
                );


                return;
            }


            /* ================================================
               UNKNOWN COMMAND
            ================================================= */

            this.speak(
                "I do not recognize that command."
            );
        },


        /* =====================================================
           DEACTIVATE ULTRON
        ===================================================== */

        deactivate() {

            this.active = false;


            this.stopListening();


            if ("speechSynthesis" in window) {

                window.speechSynthesis.cancel();
            }


            if (ultronButton) {

                ultronButton.classList.remove(
                    "ultron-active"
                );

                ultronButton.classList.remove(
                    "ultron-listening"
                );

                ultronButton.setAttribute(
                    "aria-pressed",
                    "false"
                );
            }


            console.log(
                "Ultron deactivated."
            );
        }
    };


    /* =========================================================
       ULTRON BUTTON
       
       ONLY ACTIVATES ULTRON.
       
       It does NOT enter the website automatically.
    ========================================================= */

    if (ultronButton) {

        ultronButton.type = "button";


        ultronButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();


                Ultron.activate();
            }
        );
    }


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    const menuButton =
        document.querySelector(".menu-btn");


    const navMenu =
        document.querySelector(".nav-links");


    if (menuButton && navMenu) {

        menuButton.type = "button";


        menuButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();


                navMenu.classList.toggle(
                    "active"
                );


                menuButton.classList.toggle(
                    "active"
                );
            }
        );
    }


    /* =========================================================
       NAVIGATION LINKS
    ========================================================= */

    document
        .querySelectorAll(".nav-links a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    if (navMenu) {

                        navMenu.classList.remove(
                            "active"
                        );
                    }


                    if (menuButton) {

                        menuButton.classList.remove(
                            "active"
                        );
                    }
                }
            );
        });


    /* =========================================================
       NAVBAR SCROLL
    ========================================================= */

    const navbar =
        document.querySelector(".navbar");


    function updateNavbar() {

        if (!navbar) {
            return;
        }


        if (window.scrollY > 50) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );
        }
    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );


    updateNavbar();


    /* =========================================================
       SMOOTH SCROLL
    ========================================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        this.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({

                        behavior: "smooth",

                        block: "start"
                    });
                }
            );
        });


    /* =========================================================
       REVEAL ANIMATION
    ========================================================= */

    const revealElements =
        document.querySelectorAll(
            ".reveal, .fade-up, .project-card, .skill-card"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );


                                obs.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            (element) => {

                observer.observe(
                    element
                );
            }
        );

    } else {

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "visible"
                );
            }
        );
    }


    /* =========================================================
       PROJECT HOVER
    ========================================================= */

    document
        .querySelectorAll(".project-card")
        .forEach((card) => {

            card.addEventListener(
                "mouseenter",
                () => {

                    card.classList.add(
                        "hovered"
                    );
                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.classList.remove(
                        "hovered"
                    );
                }
            );
        });


    /* =========================================================
       GLOBAL FUNCTIONS
    ========================================================= */

    window.startMusic =
        startMusic;


    window.stopMusic =
        stopMusic;


    window.toggleMusic =
        toggleMusic;


    window.enterWebsite =
        enterWebsite;


    window.Ultron =
        Ultron;


    /* =========================================================
       FINAL STATUS
    ========================================================= */

    console.log(
        "Portfolio JavaScript loaded successfully."
    );


    console.log(
        "Music initial state: OFF"
    );


    console.log(
        "Music button remains visible."
    );


    console.log(
        "Enter Website button starts music."
    );


    console.log(
        "Ultron can enter website automatically."
    );


    console.log(
        "Ultron can control music."
    );


    console.log(
        "Ultron can navigate website sections."
    );

});

