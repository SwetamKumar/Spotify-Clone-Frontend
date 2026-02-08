console.log("Welcome to Spotify Clone");

// Initialize the Variables
let currentSong = new Audio();
let play = document.querySelector("#play");
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");

const songsData = [
    {
        name: "Pehle Bhi Main",
        artist: "Vishal Mishra, Raj Shekhar",
        url: "https://github.com/ecemgo/mini-samples-great/raw/main/assets/songs/Pehle%20Bhi%20Main.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b273a232233018c644429555d874"
    },
    {
        name: "Tu Hai Kahan",
        artist: "AUR",
        url: "https://github.com/ecemgo/mini-samples-great/raw/main/assets/songs/Tu%20Hai%20Kahan.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699"
    },
    {
        name: "O Maahi",
        artist: "Pritam, Arijit Singh",
        url: "https://github.com/ecemgo/mini-samples-great/raw/main/assets/songs/O%20Maahi.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b2730c45d7c1230168854992520f"
    },
    {
        name: "Satranga",
        artist: "Arijit Singh, Shreyas Puranik",
        url: "https://github.com/ecemgo/mini-samples-great/raw/main/assets/songs/Satranga.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b273021d7017f73387b008eab271"
    },
    {
        name: "Arjan Vailly",
        artist: "Bhupinder Babbal",
        url: "https://github.com/ecemgo/mini-samples-great/raw/main/assets/songs/Arjan%20Vailly.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b2735f3ddebf822819074d86589b"
    }
];

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
    let song = songsData.find(element => element.name === track);
    if (!song) {
        console.error("Song not found");
        return;
    }
    
    currentSong.src = song.url;
    currentSong.trackName = track;
    if (!pause) {
        currentSong.play().catch(error => {
            console.error("Playback failed:", error);
        });
        play.src = "img/pause.svg";
    }
    
    document.querySelector(".songinfo").innerHTML = `<img src="${song.cover}" alt=""> <div>${song.name} - ${song.artist}</div>`;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    for (const song of songsData) {
        let li = document.createElement("li");
        li.innerHTML = `<img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.name}</div>
                                <div>${song.artist}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>`;
        songUL.appendChild(li);

        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round" /> </svg>
            </div>
            <img src="${song.cover}" alt="">
            <h2>${song.name}</h2>
            <p>${song.artist}</p>`;
        card.addEventListener("click", async item => {
            playMusic(song.name);
        });
        cardContainer.appendChild(card);
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    // Load the first song
    playMusic(songsData[0].name, true);
    
    // Set initial volume
    document.querySelector(".range").getElementsByTagName("input")[0].value = 100;

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Add an event listener to play next song when current song ends
    currentSong.addEventListener("ended", () => {
        let index = songsData.findIndex(s => s.name == currentSong.trackName);
        if ((index + 1) < songsData.length) {
            playMusic(songsData[index + 1].name);
        }
    });

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = ((e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause();
        let index = songsData.findIndex(s => s.name == currentSong.trackName);
        if ((index - 1) >= 0) {
            playMusic(songsData[index - 1].name);
        }
    });

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songsData.findIndex(s => s.name == currentSong.trackName);
        if ((index + 1) < songsData.length) {
            playMusic(songsData[index + 1].name);
        }
    });

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    });

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });
}
main();