module Styles where

import Oak.Html.Attribute (Attribute, style)
import Oak.Css

container :: ∀ a. Attribute a
container = style
  [ position  "fixed"
  , right     "0"
  , bottom    "0"
  , padding   "5px"
  , maxHeight "100vh"
  , overflow  "auto"
  ]

ul :: ∀ a. Attribute a
ul = style
  [ listStyleType "none"
  , padding       "0"
  , margin        "0"
  ]

li :: ∀ a. Attribute a
li = style
  [ padding "0"
  , cursor  "pointer"
  , margin  "0"
  ]
