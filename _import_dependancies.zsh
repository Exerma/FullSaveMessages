#/bin/zsh
cd $(dirname "$0")


# Default folders
superSource=../../_Dependancies
superTarget=./dependancies


# Clean previous dependancies
rm -R $superTarget
mkdir $superTarget


# Files of native-file-system-adapter-master
folder=native-file-system-adapter
source=$superSource/$folder/$folder
target=$superTarget/$folder
mkdir $target
cp $source/dist/* $target
cp $superSource/$folder/exerma-extra-files/${folder}.d.ts $target


# TypeScript prototypes of Thunderbird
folder=generate-mail-extension-typings
source=$superSource/$folder/$folder
target=$superTarget/$folder
mkdir $target
cp $source/out/index.d.ts $target/${folder}.d.ts

