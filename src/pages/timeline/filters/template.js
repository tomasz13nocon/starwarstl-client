export default {
  type: {
    name: null,
    children: {
      film: {
        name: "Films",
        value: false,
      },
      tv: {
        name: "TV",
        children: {
          fullType: {
            name: "Type",
            children: {
              "tv-live-action": {
                name: "Live-action",
                value: false,
              },
              "tv-animated": {
                name: "Animated",
                value: false,
              },
              "tv-micro-series": {
                name: "Micro series",
                value: false,
              },
            },
          },
        },
      },
      game: {
        name: "Video Games",
        children: {
          fullType: {
            name: "Platform",
            children: {
              game: {
                name: "Desktop/console",
                value: false,
              },
              "game-vr": {
                name: "VR",
                value: false,
              },
              "game-mobile": {
                name: "Mobile",
                value: false,
              },
              "game-browser": {
                name: "Browser",
                value: false,
              },
            },
          },
        },
      },
      book: {
        name: "Novels",
        children: {
          fullType: {
            name: "Target audience",
            children: {
              "book-a": { name: "Adult", value: false },
              "book-ya": { name: "Young Adult", value: false },
              "book-jr": { name: "Junior", value: false },
            },
          },
        },
      },
      "audio-drama": {
        name: "Audio Dramas",
        value: false,
      },
      comic: {
        name: "Comics",
        children: {
          fullType: {
            name: "Type",
            children: {
              comic: {
                name: "Comic book",
                value: false,
              },
              "comic-manga": {
                name: "Manga",
                value: false,
              },
              "comic-strip": {
                name: "Comic strip",
                value: false,
              },
              "comic-story": {
                name: "Comic story",
                value: false,
              },
            },
          },
        },
      },
      "short-story": {
        name: "Short Stories",
        value: false,
      },
      yr: {
        name: "Young Readers",
        value: false,
      },
    },
  },
};
