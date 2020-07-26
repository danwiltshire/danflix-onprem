#!/bin/bash -e

# macOS: brew install bash
#        Usage: /usr/local/bin/bash transcode.sh
#        Why:   Required for globstar support

shopt -s globstar

inputfolder="./media/source"
outputfolder="./media/converted"
dryrun=false

for v in $inputfolder/**/*.{avi,mkv,mp4}; do
  if [ -f "$v" ]; then
    # Substitute variables to get the identical output folder
    o=${v/$inputfolder/$outputfolder}
    withoutextension="${v%.*}"
    destwithoutextension="${o%.*}"

    # Create directories
    if [ "$dryrun" = false ]; then
      echo "mkdir $destwithoutextension"
      mkdir -p "$destwithoutextension"
    else
      echo "Would mkdir -p $destwithoutextension"
    fi

    # Find and copy .nfo
    if [ -f "$withoutextension.nfo" ] && [ "$dryrun" = false ]; then
      echo "cp $withoutextension.nfo"
      cp "$withoutextension.nfo" "$destwithoutextension/"
    else
      echo "Would cp $withoutextension.nfo -> $destwithoutextension/"
    fi

    # Transcode media
    if [ "$dryrun" = false ]; then
      echo "transcode $v"
      ffmpeg -i "$v" -vf "scale=w=1280:h=720:force_original_aspect_ratio=decrease" -f hls -start_number 0 -hls_time 10 -hls_list_size 0 "$destwithoutextension/index.m3u8"
    else
      echo "Would transcode $v -> $destwithoutextension/index.m3u8"
    fi
  fi
done


