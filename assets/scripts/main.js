// console.log("HEY We are here");

// let currentAudio = new Audio();

// // Function to convert seconds into MM:SS format
// function convertSecondsToMinutes(seconds) {
//     seconds = Math.floor(seconds);
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
// }

// // URL of the API endpoint
// const apiUrl = 'https://mysongapit.onrender.com/api/songs';

// // Function to fetch song data
// async function fetchData() {
//     try {
//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const songData = await response.json();
//         console.log(songData);
//         playSong(songData);

//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// // Call fetchData on load
// fetchData();

// // Function to play a specific music track
// function playMusic(trackUrl, title, artist, pause = false) {
//     currentAudio.src = trackUrl;
//     if (!pause) {
//         currentAudio.play();
//         play.className = "bi bi-pause-circle-fill";
//     }

//     document.querySelector(".songName").innerHTML = `${title}<p>${artist}</p>`;
//     document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
// }

// // Function to build and control the song playlist
// function playSong(songData) {
//     let playList = document.querySelector(".playlist");
//     playList.innerHTML = ''; // Clear previous list

//     // Play the first song by default but paused
//     playMusic(songData[0].url, songData[0].song, songData[0].artist, true);

//     songData.forEach(song => {
//         let listItem = document.createElement('li');
//         listItem.classList.add('library-card');

//         listItem.innerHTML = `
//             <div class="library-card-wrap">
//                 <div class="song-icon">
//                     <img src="${song.image}" class="songImg">
//                 </div>
//                 <div class="song-details">
//                     <p>${song.song}</p>
//                     <p>${song.artist}</p>
//                 </div>
//             </div>
//             <div class="play-song">
//                 <i class="bi bi-play-circle"></i>
//             </div>
//         `;

//         // Play selected song on click
//         listItem.addEventListener('click', () => {
//             playMusic(song.url, song.song, song.artist);
//         });

//         playList.appendChild(listItem);
//     });

//     const play = document.getElementById("play");

//     if (play) {
//         play.addEventListener('click', () => {
//             if (currentAudio.paused) {
//                 currentAudio.play();
//                 play.className = "bi bi-pause-circle-fill";
//             } else {
//                 currentAudio.pause();
//                 play.className = "bi bi-play-circle-fill";
//             }
//         });
//     }

//     currentAudio.addEventListener('timeupdate', () => {
//         const current = convertSecondsToMinutes(currentAudio.currentTime);
//         const total = convertSecondsToMinutes(currentAudio.duration || 0);
//         document.querySelector(".songTime").innerHTML = `${current} / ${total}`;

//         const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
//         document.querySelector(".circle").style.left = `${progress || 0}%`;
//     });
// }







// === MAIN JS: ENHANCED MUSIC PLAYER ===
console.log("Enhanced Music Player Loaded");

let currentAudio = new Audio();
let currentIndex = 0;
let songsList = [];
let playListItems = [];
let isShuffle = false;
let isRepeat = false;

// Converts seconds to MM:SS
function convertSecondsToMinutes(seconds) {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

const apiUrl = 'https://mysongapit.onrender.com/api/songs';

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const songData = await response.json();
        playSong(songData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
fetchData();

function highlightPlayingSong(index) {
    playListItems.forEach((item, idx) => {
        item.classList.toggle('active-song', idx === index);
    });
}

function playMusic(trackUrl, title, artist, image, pause = false) {
    currentAudio.src = trackUrl;
    if (!pause) {
        currentAudio.play();
        document.getElementById("play").className = "bi bi-pause-circle-fill";
    }
    document.querySelector(".songName").innerHTML = `
        <img src="${image}" class="songImg" />
        <div><strong>${title}</strong><br/><small>${artist}</small></div>
    `;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
    highlightPlayingSong(currentIndex);
}

function playSong(songData) {
    songsList = songData;
    const playList = document.querySelector(".playlist");
    playList.innerHTML = '';
    playListItems = [];
    playMusic(songData[0].url, songData[0].song, songData[0].artist, songData[0].image, true);

    songData.forEach((song, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('library-card');
        listItem.innerHTML = `
            <div class="library-card-wrap">
                <img src="${song.image}" class="songImg">
                <div><p>${song.song}</p><p>${song.artist}</p></div>
            </div>
            <div><i class="bi bi-play-circle"></i></div>
        `;
        listItem.addEventListener('click', () => {
            currentIndex = index;
            playMusic(song.url, song.song, song.artist, song.image);
        });
        playList.appendChild(listItem);
        playListItems.push(listItem);
    });

    document.getElementById("play").addEventListener('click', () => {
        if (currentAudio.paused) {
            currentAudio.play();
            play.className = "bi bi-pause-circle-fill";
        } else {
            currentAudio.pause();
            play.className = "bi bi-play-circle-fill";
        }
    });

    currentAudio.addEventListener('timeupdate', () => {
        const current = convertSecondsToMinutes(currentAudio.currentTime);
        const total = convertSecondsToMinutes(currentAudio.duration || 0);
        document.querySelector(".songTime").innerHTML = `${current} / ${total}`;
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        document.querySelector(".circle").style.left = `${progress || 0}%`;
    });

    currentAudio.addEventListener('ended', () => {
        if (isRepeat) {
            playMusic(songsList[currentIndex].url, songsList[currentIndex].song, songsList[currentIndex].artist, songsList[currentIndex].image);
        } else {
            document.getElementById("next").click();
        }
    });

    document.getElementById("previous").addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + songsList.length) % songsList.length;
        const song = songsList[currentIndex];
        playMusic(song.url, song.song, song.artist, song.image);
    });

    document.getElementById("next").addEventListener('click', () => {
        if (isShuffle) {
            currentIndex = Math.floor(Math.random() * songsList.length);
        } else {
            currentIndex = (currentIndex + 1) % songsList.length;
        }
        const song = songsList[currentIndex];
        playMusic(song.url, song.song, song.artist, song.image);
    });

    // Search filtering
    document.querySelector(".search_input").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        playListItems.forEach((item, idx) => {
            const match = songsList[idx].song.toLowerCase().includes(query) || songsList[idx].artist.toLowerCase().includes(query);
            item.style.display = match ? "" : "none";
        });
    });

    // Seek bar interaction
    document.querySelector(".seekbar").addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        currentAudio.currentTime = percent * currentAudio.duration;
    });

    // Volume control
    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.01;
    volumeSlider.value = 1;
    volumeSlider.style.marginLeft = "10px";
    volumeSlider.addEventListener("input", () => currentAudio.volume = volumeSlider.value);
    document.querySelector(".songBtns").appendChild(volumeSlider);

    // Shuffle/Repeat Toggle
    const controls = document.createElement("div");
    controls.innerHTML = `
        <i id="shuffleBtn" class="bi bi-shuffle"></i>
        <i id="repeatBtn" class="bi bi-repeat"></i>
    `;
    controls.style.display = "flex";
    controls.style.gap = "10px";
    document.querySelector(".songBtns").appendChild(controls);

    document.getElementById("shuffleBtn").addEventListener("click", () => {
        isShuffle = !isShuffle;
        document.getElementById("shuffleBtn").style.color = isShuffle ? "#1ABC9C" : "#000";
    });

    document.getElementById("repeatBtn").addEventListener("click", () => {
        isRepeat = !isRepeat;
        document.getElementById("repeatBtn").style.color = isRepeat ? "#1ABC9C" : "#000";
    });

    // Keyboard Shortcuts
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case " ":
                e.preventDefault();
                play.click();
                break;
            case "ArrowRight":
                document.getElementById("next").click();
                break;
            case "ArrowLeft":
                document.getElementById("previous").click();
                break;
        }
    });
}

