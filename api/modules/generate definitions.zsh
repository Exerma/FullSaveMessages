#/bin/zsh
cd $(dirname "$0")

mkdir -p ./out
tsc --allowJs --declaration --outDir out  fsa.mjs
