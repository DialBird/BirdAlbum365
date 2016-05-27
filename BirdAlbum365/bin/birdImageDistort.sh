#!/bin/bash

#ディレクトリの相対パスを指定(npm runで実行するため、packageJSONからの相対パスになる)
#最初のときに使っていたパス
#src_folder="./public/build/birdImages/birdsResized"
#dest_folder="./public/build/birdImages/birdsDistorted"
#es6に書き直した際に使うもの
src_folder="./public/build/img/birdsResized"
dest_folder="./public/build/img/birdsDistorted"



#夏鳥フォルダ内の画像を歪ませる
for imageFile in ${src_folder}/summerBirds/*.jpg
do
filename=`basename ${imageFile}`
sudo convert -resize 256x256! ${src_folder}/summerBirds/${filename} ${dest_folder}/summerBirds/${filename}
done


#冬鳥フォルダ内の画像を歪ませる
for imageFile in ${src_folder}/winterBirds/*.jpg
do
filename=`basename ${imageFile}`
sudo convert -resize 256x256! ${src_folder}/winterBirds/${filename} ${dest_folder}/winterBirds/${filename}
done


#旅鳥フォルダ内の画像を歪ませる
for imageFile in ${src_folder}/journeyBirds/*.jpg
do
filename=`basename ${imageFile}`
sudo convert -resize 256x256! ${src_folder}/journeyBirds/${filename} ${dest_folder}/journeyBirds/${filename}
done


#留鳥フォルダ内の画像を歪ませる
for imageFile in ${src_folder}/residentBirds/*.jpg
do
filename=`basename ${imageFile}`
sudo convert -resize 256x256! ${src_folder}/residentBirds/${filename} ${dest_folder}/residentBirds/${filename}
done