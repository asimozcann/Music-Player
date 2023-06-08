const container = document.querySelector(".container"),
    musicImg = container.querySelector(".img-area img"),
    musicName = container.querySelector(".song-area .name"),
    musicArtist = container.querySelector(".song-area .artist"),
    mainAudio = container.querySelector("#main-audio"),
    playPauseBtn = container.querySelector(".play-pause"),
    prevBtn = container.querySelector("#prev"),
    nextBtn = container.querySelector("#next"),
    progressArea = container.querySelector(".progress-area"),
    progressBar = progressArea.querySelector(".progress-bar"),
    musicList = container.querySelector(".music-list"),
    showMoreBtn = container.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close"),
    volumeSelect = container.querySelector("#volume"),
    showVolume = container.querySelector(".volume-area"),
    volumeControl = container.querySelector("input");





let musicIndex = 1;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
})

function loadMusic(indexNumb) {
    if (indexNumb >= 1 && indexNumb <= allMusic.length) {
        musicName.innerText = allMusic[indexNumb - 1].name;
        musicArtist.innerText = allMusic[indexNumb - 1].artist;
        musicImg.src = `image/${allMusic[indexNumb-1].img}.jpg`;
        mainAudio.src = `music/${allMusic[indexNumb-1].src}.mp3`;
    }
}

function playMusic() {
    container.classList.add("paused");
    playPauseBtn.querySelector("i").classList.remove("fa-play")
    playPauseBtn.querySelector("i").classList.add("fa-pause")
    mainAudio.play();
};

function pauseMusic() {
    container.classList.remove("paused");
    playPauseBtn.querySelector("i").classList.add("fa-play")
    playPauseBtn.querySelector("i").classList.remove("fa-pause")
    mainAudio.pause();
}

function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = container.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

nextBtn.addEventListener("click", () => {
    nextMusic();
})

prevBtn.addEventListener("click", () => {
    prevMusic();
})

const musicCurrentTime = container.querySelector(".current");
const musicDuration = container.querySelector(".max-duration");

mainAudio.addEventListener("loadeddata", () => {
    const audioDuration = mainAudio.duration;
    const totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
        totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
});

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    const progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    const currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});


progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth;
    let clickedOfSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOfSetX / progressWidthval) * songDuration;
    playMusic();

});



const repeatBtn = container.querySelector("#repeat");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Şarkıyı Tekrarla");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Karışık Çal");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Oynatma Listesini Çal");
            break;
    }
});

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();

            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length));
            do {
                randIndex = Math.floor((Math.random() * allMusic.length));
            }
            while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
        default:
            break;
    }
})
showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
})
hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
})

const ulTag = container.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {

    let liTag = `
    <li li-index="${i+1}">
        <div class="row">
            <span>${allMusic[i].name}</span>
            <p>${allMusic[i].artist}</p>
        </div>
        <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
        <span id="${allMusic[i].src}" class="audio-duration"></span>
    </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        const audioDuration = liAudioTag.duration;
        const totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioTagDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioTagDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    })
}

const allLiTags = ulTag.querySelectorAll("li");

function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration")
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");

            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;

        }

        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Çalıyor";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    playingNow();
    loadMusic(musicIndex);
    playMusic();
}


function volumeShow() {
    showVolume.style.display = "flex";
}

function volumeHide() {
    showVolume.style.display = "none";
}

volumeSelect.addEventListener("mouseenter", () => {
    volumeShow();
});

volumeControl.addEventListener("click", () => {
    volumeHide();
});

volumeControl.addEventListener("input", () => {
    const volumeValue = volumeControl.value;
    mainAudio.volume = volumeValue / 100;

});
volumeControl.addEventListener("input", function() {
    var volumeValue = volumeControl.value;
    var percentage = volumeValue + "%";
    var gradient = "linear-gradient(90deg, violet " + percentage + ", rgb(214, 214, 214) " + percentage + ")";
    volumeControl.style.backgroundImage = gradient;

    if (volumeValue == 0) {
        volumeSelect.classList.remove("fa-volume-high");
        volumeSelect.classList.add("fa-volume-xmark");
    } else {
        volumeSelect.classList.add("fa-volume-high");
        volumeSelect.classList.remove("fa-volume-xmark");
    }
});


playingNow();