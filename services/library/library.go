package library

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/danwiltshire/danflix-onprem/services/library"
	"github.com/danwiltshire/danflix-onprem/services/nfo"
)

type Episode struct {
	M3u8    string
	Nfo     string
	NfoData nfo.TVEpisode
}

func WalkMatch(root, pattern string) ([]string, error) {
	var matches []string
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if matched, err := filepath.Match(pattern, filepath.Base(path)); err != nil {
			return err
		} else if matched {
			matches = append(matches, path)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return matches, nil
}

func GetLibrary(w http.ResponseWriter, req *http.Request) {

	fmt.Println("GetLibrary()")

	mediaItem, err := library.WalkMatch("./media/converted", "*.m3u8")
	if err != nil {
		fmt.Println("Failed")
	}

	mediaItem2, err2 := library.WalkMatch("./media/converted", "*.nfo")
	if err2 != nil {
		fmt.Println("Failed")
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

	w.Header().Set("Content-Type", "application/json")

	switch req.Method {
	case "GET":
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message": "GET method requested"}`))
	default:
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"message": "Can't find method requested"}`))
	}
}
