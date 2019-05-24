module Main (main) where

import Prelude
  ( Unit
  , (<>)
  , ($)
  , bind
  , show
  , mempty
  , unit
  , map
  )
import Child as C
import Effect (Effect)
import Data.Array (length)
import Styles as S
import Oak
  ( runApp
  , App
  , createApp
  )
import Oak.Html (Html, div, ul, li, text)
import Oak.Document
  ( appendChildNode
  , getElementById
  )

type Model =
  { msgs :: Array C.Msg
  , cmodel :: C.Model
  }

data Msg
  = Wrap C.Msg


view :: Model -> Html Msg
view model =
  div []
    [ map Wrap (C.view model.cmodel)
    , div [ S.container ]
      [ ul [ S.ul ] (map showMsg model.msgs)
      , div [] [ text ((show $ length model.msgs) <> " messages") ]
      ]
    ]

showMsg :: C.Msg -> Html Msg
showMsg msg = li [ S.li ] [ text (show msg) ]

next :: Msg -> Model -> (Msg -> Effect Unit) -> Effect Unit
next _ _ _ = mempty

update :: Msg -> Model -> Model
update msg model =
  case msg of
    Wrap m -> model
      { msgs = model.msgs <> [ m ]
      , cmodel = C.update m model.cmodel
      }


init :: Unit -> Model
init _ =
  { msgs: []
  , cmodel: C.init unit
  }

app :: App Model Msg Unit
app = createApp
  { init: init
  , view: view
  , update: update
  , next: next
  }

main :: Effect Unit
main = do
  rootNode <- runApp app unit
  container <- getElementById "app"
  appendChildNode container rootNode
