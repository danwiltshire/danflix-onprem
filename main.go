package main

import (
	"fmt"
	"path/filepath"

	"github.com/danwiltshire/danflix-onprem/api"
	"github.com/danwiltshire/danflix-onprem/services/library"
	"github.com/danwiltshire/danflix-onprem/services/nfo"
)

func main() {
	//m := media.New(1, []string{"media", "source", "movies", "Star Wars - The Phantom Menace (1999)", "Star Wars - The Phantom Menace (1999).mkv"}, "Star Wars - The Phantom Menace")
	//m = media.New(2, []string{"media", "source", "movies", "Star Wars - The Empire Strikes Back (1980)", "Star Wars - The Empire Strikes Back (1980).mkv"}, "Star Wars - The Empire Strikes Back")
	//m.GetAll()
	//server.Start()
	//library.Run()
	//thetvdb.Get()

	mediaItem, err := library.WalkMatch("./media/converted", "*.m3u8")
	if err != nil {
		fmt.Println("Failed")
	}

	mediaItem2, err2 := library.WalkMatch("./media/converted", "*.nfo")
	if err2 != nil {
		fmt.Println("Failed")
	}

	type episode struct {
		m3u8    string
		nfo     string
		nfoData nfo.TVEpisode
	}

	var availableMedia []episode

	for index1, item1 := range mediaItem {
		//fmt.Println(filepath.Dir(s))
		fmt.Println("Found: ", index1, item1)
		for index2, item2 := range mediaItem2 {
			fmt.Println("Found: ", index2, item2)
			if filepath.Dir(item1) == filepath.Dir(item2) {
				//fmt.Println("found match")
				var nfoData, err4 = nfo.GetMetadata(item2)
				if err4 != nil {
					fmt.Println("failed to get NFO data (from main)")
				} else {
					availableMedia = append(availableMedia, episode{m3u8: item1, nfo: item2, nfoData: *nfoData})
				}
			}
		}
	}

	for _, item3 := range availableMedia {
		fmt.Println("Found M3U3: ", item3.m3u8)
		fmt.Println("Found NFO: ", item3.nfo)
		fmt.Println("Found nfoData Show Title: ", item3.nfoData.ShowTitle)
		fmt.Println("Found nfoData Title: ", item3.nfoData.Title)
		fmt.Println("Found nfoData Episode: ", item3.nfoData.Episode)
		fmt.Println("Found nfoData Season: ", item3.nfoData.Season)
	}

	//library.WalkMatch("./media/converted", "*.m3u8")

	api.Start()
}
