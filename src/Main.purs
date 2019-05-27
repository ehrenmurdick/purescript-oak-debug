module Main (main) where

import Prelude
  ( Unit
  , (<>)
  , ($)
  , (+)
  , discard
  , bind
  , flip
  , show
  , unit
  , map
  , mempty
  )
import Child as C
import Effect (Effect)
import Effect.Console
import Data.Array
  ( length
  , mapWithIndex
  , take
  )
import Styles as S
import Data.Foldable ( foldl )
import Oak
  ( runApp
  , App
  , createApp
  , wrapNextHandler
  )
import Oak.Html.Events ( onClick )
import Oak.Html (Html, div, ul, li, text, span)
import Oak.Html.Attribute ( style )
import Oak.Document
  ( appendChildNode
  , getElementById
  )

type Model =
  { msgs :: Array C.Msg
  , cmodel :: C.Model
  , active :: Boolean
  }

data Msg
  = Wrap C.Msg
  | ClickAt Int C.Msg
  | Init
  | Resume


view :: Model -> Html Msg
view model =
  div []
    [ if model.active then
        div [ style S.overlay, onClick Resume ]
          [ div [ style S.message ] [ text "Messages paused. Click here to resume." ]
          ]
      else
        text ""
    , map Wrap (C.view model.cmodel)
    , div [ style S.container ]
      [ div [ onClick Init, style S.button ] [ text "init" ]
      , ul [ style S.ul ] (mapWithIndex showMsg model.msgs)
      , div [] [ text ((show $ length model.msgs) <> " messages") ]
      ]
    ]

showMsg :: Int -> C.Msg -> Html Msg
showMsg i msg =
  li
    [ style $ S.li <> S.button
    , onClick (ClickAt i msg)
    ]
    [ span [ style S.number ] [ text (show $ i + 1) ]
    , span [ ] [ text (show msg) ]
    ]

next :: Msg -> Model -> (Msg -> Effect Unit) -> Effect Unit
next msg mod h =
  case msg of
    ClickAt pos cmsg -> do
       logShow cmsg
       logShow mod
    Init -> mempty
    Resume -> mempty
    Wrap cmsg -> do
      C.next cmsg mod.cmodel (wrapNextHandler Wrap h)


update :: Msg -> Model -> Model
update msg model =
  case msg of
    Wrap m ->
      if model.active then
        model
      else
        model { msgs = model.msgs <> [ m ]
        , cmodel = C.update m model.cmodel
        }
    ClickAt i m -> model
      { cmodel = foldl (flip C.update) (C.init unit) (take (i + 1) model.msgs)
      , active = true
      }
    Init -> model
      { cmodel = C.init unit
      , active = true
      }
    Resume -> model
      { active = false
      , cmodel = foldl (flip C.update) (C.init unit) model.msgs
      }

init :: Unit -> Model
init _ =
  { msgs: []
  , cmodel: C.init unit
  , active: false
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
