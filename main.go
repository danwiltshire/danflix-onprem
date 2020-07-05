package main

import (
	"fmt"
	"github.com/danwiltshire/danflix-onprem/morestrings"
	"github.com/danwiltshire/danflix-onprem/webserver"
	"github.com/google/go-cmp/cmp"
)

type MediaItem struct {
	Path []string
}

func main() {

	mediaItems := MediaItem {
		Path: string{ "hello", "world" },
	}


	fmt.Println(morestrings.ReverseRunes("!oG ,olleH"))
	fmt.Println(cmp.Diff("Hello World", "Hello Go"))
	webserver.Start()
}
