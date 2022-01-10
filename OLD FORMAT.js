OLD FORMAT

[
	{
		name: "Novels",
		key: "type",
		value: "novel",
		children: [
			{
				name: "Publisher",
				label: true,
			},
			{
				name: "Del Rey",
				key: "publisher",
				value: "Del Rey",
				children: [
					{
						name: "Adult",
						key: "audience",
						value: "Adult",
					}
				]
			}
		]
	},
	{
		name: "Comics",
		key: "type",
		value: "comic",
		children: [
			{

			}
		]
	}
]

{
	novel: {
		publisher: {
			
		}
	}

}


const state2 = {
  "type:novel": {
    "publisher:Del Rey": true,
    "audience:Adult": true,
    "adaptation": true,
  },
  "type:comic": {

  }
};


const state = {
  type: { // key
    novel: { // value
      publisher: { // key
        "Del Rey": true, // value
        "Disney–Lucasfilm Press": false,
        "Golden Books": false,
        "China Literature": true,
        "Random House Audio": true,
        "Other": false,
      },
      audience: {
        "Adult": true,
        "Young Adult": true,
        "Junior": false,
        "Young Reader": false,
        "Unknown": true,
      },
      adaptation: false, // key: value
    },
    reference: true,
  }
}

const item = {
  "id": 1,
  "type": "novel",
  "audience": "Adult",
  "title": "The High Republic: Light of the Jedi",
  "releaseDate": "2021-01-05",
  "date": "~232 BBY",
  "author": "Charles Soule",
  "coverArtist": "Joseph Meehan",
  "cover": "https://static.wikia.nocookie.net/starwars/images/e/e2/Light_of_the_Jedi_cover.jpg",
  "publisher": "Del Rey",
  "pages": 336,
  "isbn": 9780593157718
}

const state3 = {
  "type:novel,publisher:Del Rey": true,
  "type:novel,audience:Adult": true,
}

