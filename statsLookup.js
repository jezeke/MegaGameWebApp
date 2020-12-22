//ship stats lookup
var ships = ['cruiser', 'battleship', 'destroyer', 'submarine', 'transport', 'carrier', 'fighter', 'bomber', 'nuke'];
var colors = ['orange', 'green', 'white', 'black', 'purple', 'brown'];
var acc = [
  [ //cruiser
    2, //orange
    3, //green
    2, //white
    3, //black
    4, //purple
    4 //brown
  ],
  [ //battleship
    5, //orange
    5, //green
    4, //white
    5, //black
    5, //purple
    4 //brown
  ],
  [ //destroyer
    5, //orange
    4, //green
    4, //white
    3, //black
    4, //purple
    3 //brown
  ],
  [ //submarine
    3, //orange
    2, //green
    3, //white
    2, //black
    2, //purple
    1 //brown
  ],
  [ //transport
    1, //orange
    1, //green
    1, //white
    1, //black
    1, //purple
    1 //brown
  ],
  [ //carrier
    2, //orange
    2, //green
    2, //white
    2, //black
    2, //purple
    2 //brown
  ],
  [ //fighter
    4, //orange
    2, //green
    4, //white
    4, //black
    2, //purple
    2 //brown
  ],
  [ //bomber
    3, //orange
    1, //green
    3, //white
    3, //black
    1, //purple
    1 //brown
  ],
  [ //nuke
    5, //orange
    5, //green
    5, //white
    5, //black
    5, //purple
    5 //brown
  ]
];

var size = [
  [ //cruiser
    5, //orange
    6, //green
    5, //white
    5, //black
    6, //purple
    7 //brown
  ],
  [ //battleship
    8, //orange
    7, //green
    7, //white
    7, //black
    8, //purple
    8 //brown
  ],
  [ //destroyer
    5, //orange
    6, //green
    4, //white
    5, //black
    5, //purple
    5 //brown
  ],
  [ //submarine
    4, //orange
    4, //green
    4, //white
    4, //black
    3, //purple
    4 //brown
  ],
  [ //transport
    5, //orange
    5, //green
    5, //white
    5, //black
    5, //purple
    5 //brown
  ],
  [ //carrier
    8, //orange
    8, //green
    8, //white
    8, //black
    8, //purple
    8 //brown
  ],
  [ //fighter
    3, //orange
    2, //green
    2, //white
    3, //black
    3, //purple
    1 //brown
  ],
  [ //bomber
    4, //orange
    3, //green
    3, //white
    4, //black
    4, //purple
    2 //brown
  ],
  [ //nuke
    0, //orange
    0, //green
    0, //white
    0, //black
    0, //purple
    0 //brown
  ]
];
var pen = [
  [ //cruiser
    2, //orange
    2, //green
    3, //white
    3, //black
    3, //purple
    4 //brown
  ],
  [ //battleship
    5, //orange
    5, //green
    5, //white
    4, //black
    5, //purple
    5 //brown
  ],
  [ //destroyer
    4, //orange
    5, //green
    4, //white
    5, //black
    2, //purple
    4 //brown
  ],
  [ //submarine
    3, //orange
    2, //green
    1, //white
    3, //black
    1, //purple
    2 //brown
  ],
  [ //transport
    1, //orange
    1, //green
    1, //white
    1, //black
    1, //purple
    1 //brown
  ],
  [ //carrier
    1, //orange
    1, //green
    1, //white
    1, //black
    1, //purple
    1 //brown
  ],
  [ //fighter
    3, //orange
    1, //green
    1, //white
    1, //black
    1, //purple
    1 //brown
  ],
  [ //bomber
    4, //orange
    2, //green
    2, //white
    2, //black
    2, //purple
    2 //brown
  ],
  [ //nuke
    5, //orange
    5, //green
    5, //white
    5, //black
    5, //purple
    5 //brown
  ]
];

var tough = [
  [ //cruiser
    4, //orange
    6, //green
    5, //white
    6, //black
    6, //purple
    8 //brown
  ],
  [ //battleship
    8, //orange
    7, //green
    8, //white
    8, //black
    7, //purple
    8 //brown
  ],
  [ //destroyer
    4, //orange
    5, //green
    5, //white
    5, //black
    6, //purple
    5 //brown
  ],
  [ //submarine
    3, //orange
    5, //green
    5, //white
    4, //black
    3, //purple
    4 //brown
  ],
  [ //transport
    4, //orange
    4, //green
    4, //white
    4, //black
    4, //purple
    4 //brown
  ],
  [ //carrier
    5, //orange
    5, //green
    5, //white
    5, //black
    5, //purple
    5 //brown
  ],
  [ //fighter
    1, //orange
    2, //green
    2, //white
    1, //black
    1, //purple
    3 //brown
  ],
  [ //bomber
    2, //orange
    3, //green
    3, //white
    2, //black
    2, //purple
    4 //brown
  ],
  [ //nuke
    0, //orange
    0, //green
    0, //white
    0, //black
    0, //purple
    0 //brown
  ]
];

//i wish these were defined by an equation, and not practically random

var toDestroy = [
  [], //tough 0; invalid
  [ //tough 1
    0, //pen 0; invalid
    12, //pen 1
    9, //pen 2
    6, //pen 3
    4, //pen 4
    2 //pen 5
  ],
  [ //tough 2
    0, //pen 0; invalid
    14, //pen 1
    11, //pen 2
    9, //pen 3
    6, //pen 4
    3 //pen 5
  ],
  [ //tough 3
    0, //pen 0; invalid
    14, //pen 1
    12, //pen 2
    11, //pen 3
    8, //pen 4
    4 //pen 5
  ],
  [ //tough 4
    0, //pen 0; invalid
    15, //pen 1
    14, //pen 2
    13, //pen 3
    9, //pen 4
    6 //pen 5
  ],
  [ //tough 5
    0, //pen 0; invalid
    17, //pen 1
    16, //pen 2
    14, //pen 3
    10, //pen 4
    7 //pen 5
  ],
  [ //tough 6
    0, //pen 0; invalid
    18, //pen 1
    16, //pen 2
    15, //pen 3
    11, //pen 4
    8 //pen 5
  ],
  [ //tough 7
    0, //pen 0; invalid
    19, //pen 1
    17, //pen 2
    16, //pen 3
    13, //pen 4
    10 //pen 5
  ],
  [ //tough 8
    0, //pen 0; invalid
    19, //pen 1
    18, //pen 2
    17, //pen 3
    15, //pen 4
    12 //pen 5
  ],
];

var toHit = [
  [], //size 0; invalid
  [ //size 1
    0, //accuracy 0; invalid
    18, //accuracy 1
    16, //accuracy 2
    14, //accuracy 3
    12, //accuracy 4
    8, //accuracy 5
  ],
  [ //size 2
    0, //accuracy 0; invalid
    17, //accuracy 1
    15, //accuracy 2
    12, //accuracy 3
    11, //accuracy 4
    7, //accuracy 5
  ],
  [ //size 3
    0, //accuracy 0; invalid
    16, //accuracy 1
    14, //accuracy 2
    12, //accuracy 3
    9, //accuracy 4
    7, //accuracy 5
  ],
  [ //size 4
    0, //accuracy 0; invalid
    15, //accuracy 1
    13, //accuracy 2
    11, //accuracy 3
    8, //accuracy 4
    5, //accuracy 5
  ],
  [ //size 5
    0, //accuracy 0; invalid
    14, //accuracy 1
    13, //accuracy 2
    10, //accuracy 3
    7, //accuracy 4
    4, //accuracy 5
  ],
  [ //size 6
    0, //accuracy 0; invalid
    14, //accuracy 1
    12, //accuracy 2
    8, //accuracy 3
    7, //accuracy 4
    3, //accuracy 5
  ],
  [ //size 7
    0, //accuracy 0; invalid
    13, //accuracy 1
    11, //accuracy 2
    7, //accuracy 3
    5, //accuracy 4
    2, //accuracy 5
  ],
  [ //size 8
    0, //accuracy 0; invalid
    13, //accuracy 1
    10, //accuracy 2
    6, //accuracy 3
    4, //accuracy 4
    2, //accuracy 5
  ]
];
