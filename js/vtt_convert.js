function convertToVTT(file) {
  fetch(file)
    .then((x) => x.text())
    .then((y) => {
      let VTTContent = "WEBVTT\r\n\r\n";
      const srtContent = y;
      const subArray = srtContent.trim().split("\r\n\r\n");

      for (let sub of subArray) {
        const lines = sub.trim().split("\r\n");
        lines[1] = lines[1].trim().replace(",", ".");
        for (let i = 1; i < lines.length; i++) {
          if (i != lines.length - 1) {
            lines[i] += "\r\n";
          }
          VTTContent += lines[i];
        }
        VTTContent += "\r\n\r\n";
      }
      return VTTContent;
    });
}
