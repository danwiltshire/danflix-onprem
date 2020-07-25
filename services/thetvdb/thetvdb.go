package thetvdb

import (
	"fmt"
	"os"

	"github.com/pioz/tvdb"
)

func Get() {
	c := tvdb.Client{Apikey: os.Getenv("TVDB_API_KEY"), Userkey: os.Getenv("TVDB_USER_KEY"), Username: os.Getenv("TVDB_USER_NAME")}
	err := c.Login()
	if err != nil {
		panic(err)
	}
	series, err := c.BestSearch("Game of Thrones")
	if err != nil {
		panic(err)
	}
	err = c.GetSeriesEpisodes(&series, nil)
	if err != nil {
		panic(err)
	}
	// Print the title of the episode 4x08 (season 4, episode 8)
	fmt.Println(series.GetEpisode(4, 8).EpisodeName)
	// Output: The Mountain and the Viper
}
