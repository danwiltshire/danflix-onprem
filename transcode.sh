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

    # Create directories
    if [ "$dryrun" = false ]; then
      echo "mkdir $o"
      mkdir -p "$o"
    else
      echo "Would mkdir -p $o"
    fi

    # Find and copy .nfo
    if [ -f "$withoutextension.nfo" ] && [ "$dryrun" = false ]; then
      echo "cp $withoutextension.nfo"
      cp "$withoutextension.nfo" "$o/"
    else
      echo "Would cp $withoutextension.nfo -> $o/"
    fi

    # Transcode media
    if [ "$dryrun" = false ]; then
      echo "transcode $v"
      ffmpeg -i "$v" -f hls -start_number 0 -hls_time 10 -hls_list_size 0 "$o/index.m3u8"
    else
      echo "Would transcode $v"
    fi
  fi
done


