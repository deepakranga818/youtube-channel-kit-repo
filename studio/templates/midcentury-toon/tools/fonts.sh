#!/bin/sh
# Fonts (SIL Open Font License 1.1; licence texts in fonts/). English on screen uses the style's own faces (Oleo Script Bold, Alfa Slab One, Jost).
# Devanagari has its own families (Deva = Poppins, DevaSlab = Rozha One, DevaScript = Kalam Bold) so a canvas font stack can fall back per character:
#   ctx.font = '500 30px Jost, Deva'.  Do NOT split one family into Latin and Devanagari faces by unicode-range: Chrome then drops the Latin face on some weights.
# Fetches once into fonts/ (google/fonts pinned to one commit). FORCE=1 fetches again.
set -e
D=$(cd "$(dirname "$0")/.." && pwd)/fonts; mkdir -p "$D"
GF=https://raw.githubusercontent.com/google/fonts/86aced91de05cd4f96a06838124cca45be337b2b
get() {
  [ -s "$D/$1" ] && [ -z "$FORCE" ] && return 0
  curl -fsSL -g --retry 2 -o "$D/download.part" "$2" || { rm -f "$D/download.part"; echo "could not fetch $1 from $2" >&2; exit 1; }
  mv "$D/download.part" "$D/$1"; echo "fonts/$1"
}
get OleoScript-Bold.ttf "$GF/ofl/oleoscript/OleoScript-Bold.ttf"
get AlfaSlabOne-Regular.ttf "$GF/ofl/alfaslabone/AlfaSlabOne-Regular.ttf"
get Jost.ttf "$GF/ofl/jost/Jost[wght].ttf"
get Kalam-Bold.ttf "$GF/ofl/kalam/Kalam-Bold.ttf"
get RozhaOne-Regular.ttf "$GF/ofl/rozhaone/RozhaOne-Regular.ttf"
get Poppins-Regular.ttf "$GF/ofl/poppins/Poppins-Regular.ttf"
get Poppins-Medium.ttf "$GF/ofl/poppins/Poppins-Medium.ttf"
get Poppins-SemiBold.ttf "$GF/ofl/poppins/Poppins-SemiBold.ttf"
cat > "$D/fonts.css" <<CSS
@font-face { font-family: 'Oleo'; src: url(OleoScript-Bold.ttf) format('truetype'); font-weight: 400 700; font-display: block; }
@font-face { font-family: 'Slab'; src: url(AlfaSlabOne-Regular.ttf) format('truetype'); font-display: block; }
@font-face { font-family: 'Jost'; src: url(Jost.ttf) format('truetype'); font-weight: 100 900; font-display: block; }
/* Devanagari (the caption's Hindi line) and any rupee sign a Latin face lacks: a separate family used as a font-stack fallback, e.g. '500 30px Jost, Deva' */
@font-face { font-family: 'Deva'; src: url(Poppins-Regular.ttf) format('truetype'); font-weight: 100 450; font-display: block; }
@font-face { font-family: 'Deva'; src: url(Poppins-Medium.ttf) format('truetype'); font-weight: 451 550; font-display: block; }
@font-face { font-family: 'Deva'; src: url(Poppins-SemiBold.ttf) format('truetype'); font-weight: 551 900; font-display: block; }
@font-face { font-family: 'DevaSlab'; src: url(RozhaOne-Regular.ttf) format('truetype'); font-display: block; }
@font-face { font-family: 'DevaScript'; src: url(Kalam-Bold.ttf) format('truetype'); font-weight: 400 700; font-display: block; }
CSS
