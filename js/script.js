const buttons = document.querySelectorAll(".scene-button");

const sceneImage = document.getElementById("sceneImage");
const detailImage = document.getElementById("detailImage");

const photoCaption = document.getElementById("photoCaption");
const detailCaption = document.getElementById("detailCaption");

const sceneEyebrow = document.getElementById("sceneEyebrow");
const sceneTitle = document.getElementById("sceneTitle");
const sceneText = document.getElementById("sceneText");
const trackSubtitle = document.getElementById("trackSubtitle");

const sceneAudio = document.getElementById("sceneAudio");
const sceneAudioSource = document.getElementById("sceneAudioSource");
const audioStatus = document.getElementById("audioStatus");
const audioProgress = document.getElementById("audioProgress");
const heroImage = document.querySelector(".hero-image");

const streetAmbience = document.getElementById("streetAmbience");
const ambienceButton = document.getElementById("ambienceButton");

let currentSceneName = "Street Life";


/* Content for the three scenes */

const scenes = [
    {
        name: "Street Life",

        title: "The streets are still busy.",

        eyebrow: "01 / Street Life",

        text:
            "Cars and bikes pass, people cross the road, " +
            "and shops carry on around them. It can get " +
            "noisy, but that constant movement is part " +
            "of what makes Lahore feel so alive.",

        image: "images/street.jpg",

        caption: "Traffic and people on the move",

        detailImage: "images/shop.jpg",

        detailCaption: "Shops along the street",

        audio: "audio/street-life.mp3",
        audioDescription: "Traffic and street sounds in Lahore"
    },

    {
        name: "Preparing of Takka Tak (Kebab)",

        title: "Something is always cooking.",

        eyebrow: "02 / Food & Markets",

        text:
            "Around the food stalls, there is always " +
            "something being prepared. The sound of food " +
            "cooking, utensils moving, and ingredients " +
            "being handled makes even a simple meal " +
            "interesting to listen to.",

        image: "images/foodstreet.jpg",

        caption: "Food being prepared in Lahore",

        detailImage: "images/street.jpg",

        detailCaption: "The streets around the food stalls",

        audio: "audio/food-markets.mp3",
        audioDescription: "ASMR of food being prepared in Lahore"
    },

    {
        name: "Evening Festival",

        title: "A small evening gathering.",

        eyebrow: "03 / Evening Festival",

        text:
            "This scene shows a small festival-style " +
            "gathering. The sound of the tabla gives this " +
            "part of the soundscape its own rhythm, " +
            "creating a different atmosphere from the " +
            "busy streets and food stalls. People usually come here after a hectic day to relax, socialize and enjoy the music.",

        image: "images/festival.jpg",

        caption: "A small festival-style gathering",

        detailImage: "images/mosque.jpg",

        detailCaption: "A historic landmark in Lahore",

        audio: "audio/evening-lights.mp3",
        audioDescription: "Tabla rhythms from an evening gathering"
    }
];


/* Restart the CSS fade-in so it plays every time a photo changes */

function restartFade(image) {

    image.classList.remove("fade-in");
    void image.offsetWidth;
    image.classList.add("fade-in");

}


/* Change the card content */

function selectScene(index) {

    const scene = scenes[index];

    currentSceneName = scene.name;


    // Update the main image and caption.

    sceneImage.src = scene.image;
    photoCaption.textContent = scene.caption;



    detailImage.src = scene.detailImage;
    detailCaption.textContent = scene.detailCaption;


    // Restart the fade-in animation on both photos.

    restartFade(sceneImage);
    restartFade(detailImage);
    audioProgress.style.width = "0%";


    // Update the scene title and description.

    sceneEyebrow.textContent = scene.eyebrow;
    sceneTitle.textContent = scene.title;
    sceneText.textContent = scene.text;
    trackSubtitle.textContent = scene.audioDescription;


    // Highlight the selected button.

    buttons.forEach((button, buttonIndex) => {

        const isActive = buttonIndex === index;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));

    });


    // Stop the opening ambience so the audio does not overlap.

    streetAmbience.pause();

    ambienceButton.textContent = "Play street ambience";
    ambienceButton.setAttribute("aria-pressed", "false");


    // Load the audio for the selected scene.

    sceneAudio.pause();

    sceneAudioSource.src = scene.audio;
    sceneAudio.load();

    audioStatus.textContent = "Loading sound...";

    sceneAudio.play()
        .catch(() => {
            audioStatus.textContent =
                "Press play to listen to this scene.";
        });
}


/* Connect the three buttons */

buttons.forEach((button) => {

    button.addEventListener("click", () => {

        const index = Number(button.dataset.scene);

        selectScene(index);

    });

});


/* Control the street ambience in the introduction */

ambienceButton.addEventListener("click", () => {

    if (streetAmbience.paused) {

        // Stop the scene audio before playing the ambience.

        sceneAudio.pause();
        streetAmbience.volume = 0.25;

        streetAmbience.play()
            .then(() => {

                ambienceButton.textContent = "Pause music";
                ambienceButton.setAttribute("aria-pressed", "true");

            })
            
    } else {

        streetAmbience.pause();

        ambienceButton.textContent = "Play what lahore sounds like";
        ambienceButton.setAttribute("aria-pressed", "false");

    }

});


/* Update the audio status */

sceneAudio.addEventListener("play", () => {

    audioStatus.textContent = "Now playing: " + currentSceneName;

});

sceneAudio.addEventListener("pause", () => {

    if (!sceneAudio.ended) {
        audioStatus.textContent = "Paused.";
    }

});

sceneAudio.addEventListener("ended", () => {

    audioStatus.textContent = "Scene finished: " + currentSceneName;

});

sceneAudio.addEventListener("error", () => {

    audioStatus.textContent =
        "Audio could not be loaded. Check the MP3 filename.";

});


/* Visual effects that respond to the sound */

// The scene photo slowly zooms while the scene audio is playing.

sceneAudio.addEventListener("play", () => {
    sceneImage.classList.add("is-playing");
});

sceneAudio.addEventListener("pause", () => {
    sceneImage.classList.remove("is-playing");
});

sceneAudio.addEventListener("ended", () => {
    sceneImage.classList.remove("is-playing");
});

// The progress bar follows the playback position.

sceneAudio.addEventListener("timeupdate", () => {

    if (sceneAudio.duration) {

        const percent =
            (sceneAudio.currentTime / sceneAudio.duration) * 100;

        audioProgress.style.width = percent + "%";

    }

});

// The header photo slowly zooms while the opening ambience plays.

streetAmbience.addEventListener("play", () => {
    heroImage.classList.add("is-playing");
});

streetAmbience.addEventListener("pause", () => {
    heroImage.classList.remove("is-playing");
});
