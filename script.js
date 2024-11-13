let currentSong = new Audio(); // it is global verbal 
let songs;

function secondToMinuteSecond(seconds) {
    // Check if 'seconds' is a valid number
    if (typeof seconds !== "number" || isNaN(seconds)) {
        console.error("Invalid input: seconds must be a number");
        return "00:00"; // Return a default value or handle it as needed
    }

    // Round down the seconds to remove any fractional part
    seconds = Math.floor(seconds);

    // Calculate the number of minutes
    const minutes = Math.floor(seconds / 60);

    // Calculate the remaining seconds
    const remainingSeconds = seconds % 60;

    // Format the seconds to always show two digits (e.g., 05 instead of 5)
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted time as "minutes:seconds"
    return `${minutes}:${formattedSeconds}`;
}

async function fetchSonglist() {

    let a = await fetch("http://127.0.0.1:5500/songes/");
    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a"); // Target 'a' tags instead of 'li'
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        // Check if href exists and ends with ".mp3"
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/").pop());
        }
    }

    return songs;  // Output the list of song URLs


}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songes/" + track)
    currentSong.src = "/songes/" + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }                      //global verbal value  
    document.querySelector(".songinformation").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}
async function main() {

    //get list the  all songes

    songs = await fetchSonglist()
    playMusic(songs[0], true)

    //show all thw song play list in this function 
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + (`<li> 
             
                            <img class="invert" src="music.svg" alt="">
                            <div class="songinfo">
                                <div>${song.replaceAll("%20", " ")} </div>
                               <div>ajay</div>
                            </div>
                            <div class="playnow">
                                <span>play Now</span>    
                                <img class="invert" src="play.svg" alt="">
                            </div>  </li>`)
    }

    // Attach the event listener each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".songinfo").firstElementChild.innerHTML)
            playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim())

        })
    })

    // Attech an event listner privious, play, next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondToMinuteSecond(currentSong.currentTime)} / ${secondToMinuteSecond(currentSong.duration)}`
        const seekBar = document.querySelector(".circle");
        if (seekBar) {
            seekBar.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    })

    //add an event to listner seakbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100
    })

    //add on event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"; // Move left panel into view
    });

    //add on event listner for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"; // Move left panel into view
    });

    //add event listner for previous and next 
    
    previous.addEventListener("click", () => {                              //understand this code
        console.log("previous clicked");
        console.log(currentSong);
    
        // Extract the song file name from currentSong.src
        let currentSongFile = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(currentSongFile);
    
        // Check if there's a previous song
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        } else {
            console.log("No previous song available");
        }
    });
    
    // Add event listener for "next"
    next.addEventListener("click", () => {                                   //understand this code
        console.log("Next clicked");
    
        // Extract the song file name from currentSong.src
        let currentSongFile = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(currentSongFile);
    
        // Check if there's a next song
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            console.log("No next song available");
        }
    });
     // Add on event to volume 

     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=> {
        console.log("Volume stage", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value)/100
     })
    
    

    //play the first song
    // var audio = new Audio(songs[0]);
    // audio.play();

}
main()