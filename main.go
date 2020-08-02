package main

import (
	"encoding/json"
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

	type Episode struct {
		M3u8    string
		Nfo     string
		NfoData nfo.TVEpisode
	}

	var availableMedia []Episode

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
					availableMedia = append(availableMedia, Episode{M3u8: item1, Nfo: item2, NfoData: *nfoData})
				}
			}
		}
	}

	e, err := json.Marshal(availableMedia)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(e))

	//library.WalkMatch("./media/converted", "*.m3u8")

	api.Start()
}
