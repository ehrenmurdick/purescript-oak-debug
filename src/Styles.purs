module Styles where

import Oak.Css

container :: Array StyleAttribute
container =
  [ backgroundColor "#777"
  , bottom          "0"
  , color           "white"
  , maxHeight       "100vh"
  , overflow        "auto"
  , padding         "5px"
  , position        "fixed"
  , right           "0"
  , zIndex          "1000"
  ]

overlay :: Array StyleAttribute
overlay =
  [ backgroundColor "#111"
  , display         "flex"
  , position        "fixed"
  , zIndex          "999"
  , top             "0"
  , right           "0"
  , bottom          "0"
  , left            "0"
  , StyleAttribute  "justify-content" "center"
  , StyleAttribute  "align-items"     "center"
  , StyleAttribute  "opacity"         "0.1"
  ]

message :: Array StyleAttribute
message =
  [ color    "white"
  , fontSize "24px"
  ]

button :: Array StyleAttribute
button =
  [ cursor "pointer"
  ]

number :: Array StyleAttribute
number =
  [ textAlign    "right"
  , width        "2em"
  , display      "inline-block"
  , paddingRight "3px"
  ]

big :: Array StyleAttribute
big =
  [ fontSize "24"
  ]

ul :: Array StyleAttribute
ul =
  [ listStyleType "none"
  , padding       "0"
  , margin        "0"
  ]

li :: Array StyleAttribute
li =
  [ padding "0"
  , margin  "0"
  ]
