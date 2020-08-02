package main

import (
	"github.com/danwiltshire/danflix-onprem/api"
)

func main() {
	//m := media.New(1, []string{"media", "source", "movies", "Star Wars - The Phantom Menace (1999)", "Star Wars - The Phantom Menace (1999).mkv"}, "Star Wars - The Phantom Menace")
	//m = media.New(2, []string{"media", "source", "movies", "Star Wars - The Empire Strikes Back (1980)", "Star Wars - The Empire Strikes Back (1980).mkv"}, "Star Wars - The Empire Strikes Back")
	//m.GetAll()
	//server.Start()
	//library.Run()
	//thetvdb.Get()

	//library.WalkMatch("./media/converted", "*.m3u8")

	api.Start()
}
