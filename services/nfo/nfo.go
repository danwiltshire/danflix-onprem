package nfo

import (
	"encoding/xml"
	"fmt"
	"io/ioutil"
)

type TVEpisode struct {
	ShowTitle string `xml:"showtitle"`
	Title     string `xml:"title"`
	Season    string `xml:"season"`
	Episode   string `xml:"episode"`
}

func GetMetadata(nfo string) (*TVEpisode, error) {
	v := TVEpisode{}

	data, err2 := ioutil.ReadFile(nfo)
	if err2 != nil {
		//log.Fatal(err2)
		return &v, err2
	}

	err := xml.Unmarshal([]byte(data), &v)
	if err != nil {
		fmt.Printf("error: %v", err)
		return &v, err
	}

	return &v, err
}
