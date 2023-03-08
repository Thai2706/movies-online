const torrentId =
  "magnet:?xt=urn:btih:c1da3c624c20c6fd698618ae0f4c2ffdc549db49&dn=The.Matrix.1999.REMASTERED.PROPER.1080p.BluRay.H264.AAC-RARBG&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2960&tr=udp%3A%2F%2F9.rarbg.to%3A2720&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";

const client = new WebTorrent();

// HTML elements
const $body = document.body;
const $progressBar = document.querySelector("#progressBar");
const $downloaded = document.querySelector("#downloaded");
const $uploadSpeed = document.querySelector("#uploadSpeed");
const $downloadSpeed = document.querySelector("#downloadSpeed");
const $video = document.querySelector("#video");

console.log(convertToVTT("../subs/Vietnamese.srt"));

function download() {
  // Download the torrent
  client.add(torrentId, function (torrent) {
    // Torrents can contain many files. Let's use the .mp4 file
    const file = torrent.files.find(function (file) {
      return file.name.endsWith(".mp4");
    });

    let check = false;
    // var player = videojs("video");
    // player.addClass("vjs-fluid");
    torrent.on("download", function () {
      if (!check) {
        check = true;
        var player = videojs("video");
        // player.addClass("vjs-fluid");
        file.getStreamURL((err, url) => {
          if (err) throw err;
          player.src({
            src: url,
            type: "video/mp4",
          });
          player.play();

          //   //console.log(convertToVTT('../subs/Vietnamese.srt'))
          //   // Add subtitles
          //   const track = player.addRemoteTextTrack({
          //     src: convertToVTT('../subs/Vietnamese.srt'),
          //     label: 'Vietnamese',
          //     kind: 'subtitles',
          //     srclang: 'vi',
          //     default: true
          //   });
          //   player.textTracks().addTrack(track);
          //   var tracks = player.textTracks();
          //   tracks[0].enable;

          //
        });
      }
    });

    // Trigger statistics refresh
    torrent.on("done", onDone);
    setInterval(onProgress, 500);
    onProgress();

    // Statistics
    function onProgress() {
      // Progress
      const percent = Math.round(torrent.progress * 100 * 100) / 100;
      $progressBar.style.width = percent + "%";
      $downloaded.innerHTML = prettyBytes(torrent.downloaded);

      // Remaining time
      let remaining;
      if (torrent.done) {
        remaining = "Done.";
      } else {
        remaining = moment
          .duration(torrent.timeRemaining / 1000, "seconds")
          .humanize();
        remaining =
          remaining[0].toUpperCase() + remaining.substring(1) + " remaining.";
      }
      // Speed rates
      $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + "/s";
      $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + "/s";
    }
    function onDone() {
      $body.className += " is-seed";
      onProgress();
    }
  });
}

// Human readable bytes util
function prettyBytes(num) {
  const units = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const neg = num < 0;
  if (neg) num = -num;
  if (num < 1) return (neg ? "-" : "") + num + " B";
  const exponent = Math.min(
    Math.floor(Math.log(num) / Math.log(1000)),
    units.length - 1
  );
  const unit = units[exponent];
  num = Number((num / Math.pow(1000, exponent)).toFixed(2));
  return (neg ? "-" : "") + num + " " + unit;
}

navigator.serviceWorker.register("sw.min.js", { scope: "/" }).then((reg) => {
  const worker = reg.active || reg.waiting || reg.installing;
  function checkState(worker) {
    return worker.state === "activated" && client.loadWorker(worker, download);
  }
  if (!checkState(worker)) {
    worker.addEventListener("statechange", ({ target }) => checkState(target));
  }
});
