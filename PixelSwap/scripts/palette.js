const palettePreview = document.getElementById("area");
const paletteInput = document.getElementById("palette-input");
paletteInput.addEventListener("change", readSingleFile);

let paletteFileContents = `GIMP Palette
#
# By ENDESGA Studios
# https://twitter.com/ENDESGA
#
190  74  47	Tetanus
216 118  68	Rust
234 212 170	Birch
228 166 114	Sap
184 111  80	Oak
116  63  57	Pine
 63  40  50	Darkbark
158  40  53	Blood
228  59  68	Fabric
247 118  34	Amber
254 174  52	Glow
254 231  97	Light
 99 199  77	Glade
 62 137  72	Flora
 38  92  66	Moss
 25  60  62	Mold
 18  78 137	Deep
  0 149 233	Archaeon
 44 232 245	Ion
255 255 255	White
192 203 220	Aluminium
139 155 180	Zinc
 90 105 136	Iron
 58  68 102	Steel
 38  43  68	Shade
255   0  68	Iiem
 24  20  37	Ink
104  56 108	Lilac
181  80 136	Petal
246 117 122	Peach
232 183 150	Skin
194 133 105	Shadeskin
`;
let palette = [];

initializePalette();

function readSingleFile(e) {
  //Retrieve the first (and only!) File from the FileList object
  let file = e.target.files[0];

  if (file) {
    let reader = new FileReader();
    reader.onload = (event) => {
      if (isValidGpl(file)) {
        paletteFileContents = event.target.result;
        palette = parseGplFile(paletteFileContents);
        updatePreviewText();
      } else {
        e.target.value = null;
        alert("Not a valid GPL file!");
      }
    };
    reader.readAsText(file);
  }
}

function initializePalette() {
  palette = parseGplFile(paletteFileContents);
  updatePreviewText();
}

function updatePreviewText() {
  let lines = paletteFileContents.split(/\r?\n/);
  let i;
  if (lines.length === 0) return;
  palettePreview.innerText = "";
  // Do not add background color to title or comments
  for (i = 0; lines[i].charAt(0) === "#" || i === 0; i++) {
    palettePreview.innerText += lines[i] + "\n";
  }
  // Parse palette colors separately since they need background color
  for (let j = 0; j < palette.length; i++, j += 3) {
    let r = palette[j];
    let g = palette[j + 1];
    let b = palette[j + 2];
    let fontClass = isLight(r, g, b) ? "dark-font" : "light-font";
    let backgroundColor = cssColor(r, g, b);
    palettePreview.innerHTML += `<span class="${fontClass}" style="background-color: ${backgroundColor};">${lines[i]}</span>`;
  }
}

function cssColor(red, green, blue) {
  return `rgb(${red}, ${green}, ${blue})`;
}

function isLight(red, green, blue) {
  return red * 0.299 + green * 0.587 + blue * 0.114 > 154;
}
