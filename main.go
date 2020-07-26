package main

import (
	"encoding/xml"
	"fmt"

	"github.com/danwiltshire/danflix-onprem/api"
)

func main() {
	//m := media.New(1, []string{"media", "source", "movies", "Star Wars - The Phantom Menace (1999)", "Star Wars - The Phantom Menace (1999).mkv"}, "Star Wars - The Phantom Menace")
	//m = media.New(2, []string{"media", "source", "movies", "Star Wars - The Empire Strikes Back (1980)", "Star Wars - The Empire Strikes Back (1980).mkv"}, "Star Wars - The Empire Strikes Back")
	//m.GetAll()
	//server.Start()
	//library.Run()
	//thetvdb.Get()

	type Email struct {
		Where string `xml:"where,attr"`
		Addr  string
	}
	type Address struct {
		City, State string
	}
	type Result struct {
		XMLName xml.Name `xml:"Person"`
		Name    string   `xml:"FullName"`
		Phone   string
		Email   []Email
		Groups  []string `xml:"Group>Value"`
		Address
	}
	v := Result{Name: "none", Phone: "none"}

	data := `
		<Person>
			<FullName>Grace R. Emlin</FullName>
			<Company>Example Inc.</Company>
			<Email where="home">
				<Addr>gre@example.com</Addr>
			</Email>
			<Email where='work'>
				<Addr>gre@work.com</Addr>
			</Email>
			<Group>
				<Value>Friends</Value>
				<Value>Squash</Value>
			</Group>
			<City>Hanga Roa</City>
			<State>Easter Island</State>
		</Person>
	`
	err := xml.Unmarshal([]byte(data), &v)
	if err != nil {
		fmt.Printf("error: %v", err)
		return
	}
	fmt.Printf("XMLName: %#v\n", v.XMLName)
	fmt.Printf("Name: %q\n", v.Name)
	fmt.Printf("Phone: %q\n", v.Phone)
	fmt.Printf("Email: %v\n", v.Email)
	fmt.Printf("Groups: %v\n", v.Groups)
	fmt.Printf("Address: %v\n", v.Address)

	api.Start()
}
