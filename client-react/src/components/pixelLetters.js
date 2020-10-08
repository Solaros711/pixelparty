const colors = {
    white: '#f5ffe0',
    black: '#1b1926',
    // darkblue: '#262157',
    darkblue: 'indigo',
    orange: 'darkorange',
    // lightblue: '#323da1',
    lightblue: 'lightblue',
    red: '#bd2f40',
    yellow: '#f0e143',
    lightgreen: '#6ca84d',
    // darkgreen: '#23574d',
    darkgreen: 'turquoise',
    pink: 'hotpink',
  }
  const size = 10
  const letters = [
    {
      letter: 'P',
      color: colors.orange,
      starting: [2, 5],
      route: [
        [0, 0], [0, -1], [0, -1], [0, -1], [0, -1], [1, 0], [1, 0], [0, 1], [0, 1], [-1, 0]
      ],
      pixels: []
    },
    {
      letter: 'I',
      color: colors.lightblue,
      starting: [6, 1],
      route: [
        [0, 0], [1, 0], [1, 0], [-1, 1], [0, 1], [0, 1], [-1, 1], [1, 0], [1, 0]
      ],
      pixels: []
    },
    {
      letter: 'X',
      color: colors.red,
      starting: [10, 1],
      route: [
        [0, 0], [0, 1], [1, 1], [1, 1], [0, 1], [-2, 0], [0, -1], [1, -1], [1, -1], [0, -1]
      ],
      pixels: []
    },
    {
      letter: 'E',
      color: colors.yellow,
      starting: [14, 1],
      route: [
        [0, 0], [0, 1], [0, 1], [0, 1], [0, 1], [1, -4], [1, 0], [-1, 2], [1, 0], [-1, 2], [1, 0]
      ],
      pixels: []
    },
    {
      letter: 'L',
      color: colors.lightgreen,
      starting: [18, 1],
      route: [
        [0, 0], [0, 1], [0, 1], [0, 1], [0, 1], [1, 0], [1, 0]
      ],
      pixels: []
    },
    {
      letter: 'P',
      color: colors.darkgreen,
      starting: [23, 5],
      route: [
        [0, 0], [0, -1], [0, -1], [0, -1], [0, -1], [1, 0], [1, 0], [0, 1], [0, 1], [-1, 0]
      ],
      pixels: []
    },
    {
      letter: 'A',
      color: colors.pink,
      starting: [27, 5],
      route: [
        [0, 0], [0, -1], [0, -1], [0, -1], [1, -1], [1, 1], [0, 1], [0, 1], [0, 1], [-1, -2]
      ],
      pixels: []
    },
    {
      letter: 'R',
      color: colors.lightblue,
      starting: [31, 5],
      route: [
        [0, 0], [0, -1], [0, -1], [0, -1], [0, -1], [1, 0], [1, 0], [0, 1], [-1, 1], [1, 1], [0, 1]
      ],
      pixels: []
    },
    {
      letter: 'T',
      color: colors.red,
      starting: [35, 1],
      route: [
        [0, 0], [1, 0], [1, 0], [-1, 1], [0, 1], [0, 1], [0, 1]
      ],
      pixels: []
    },
    {
      letter: 'Y',
      color: colors.yellow,
      starting: [39, 1],
      route: [
        [0, 0], [0, 1], [1, 1], [1, -1], [0, -1], [-1, 3], [0, 1]
      ],
      pixels: []
    }
  ]
  letters.map(letter => {
    for (let i = 0; i < letter.route.length; i++) {
      if (i) {
        for (let j = 0; j < letter.route[i].length; j++) letter.route[i][j] += letter.route[i - 1][j]
      } else {
        letter.route[i] = letter.starting
      }
      letter.pixels[i] = { color: letter.color, x: letter.route[i][0], y: letter.route[i][1] }
    }
  })
  letters.map(letter => {
    letter.pixels.map(pixel => {
      pixel.x *= size
      pixel.y *= size
    })
  })
  
  export default letters