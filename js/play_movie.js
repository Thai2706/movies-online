// Lấy tham số từ URL
const urlParams = new URLSearchParams(window.location.search);
const param = urlParams.get('id');

fetch('json/movies.json')
    .then((response) => response.json())
    .then((data) => {
      // Sử dụng đối tượng data ở đây
      // Object.keys(data).forEach(function(key) {
      //   var movie = data[key];
      //   document.getElementById("test-para").innerHTML += movie.name + "<br>";
      // });

      playerFrame = document.getElementById("player-frame");
      const slug = data[param]["slug"];
      playerFrame.src = `https://short.ink/${slug}`;
      document.title = data[param]['name'];
    });