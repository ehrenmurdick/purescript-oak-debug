module Main (main) where

import Prelude
  ( Unit
  , (<>)
  , ($)
  , discard
  , bind
  , show
  , unit
  , map
  , mempty
  )
import Child as C
import Effect (Effect)
import Effect.Console
import Data.Array (length, mapWithIndex, take)
import Styles as S
import Data.Foldable ( foldr )
import Oak
  ( runApp
  , App
  , createApp
  , wrapNextHandler
  )
import Oak.Html.Events ( onClick )
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
  | ClickAt Int C.Msg


view :: Model -> Html Msg
view model =
  div []
    [ map Wrap (C.view model.cmodel)
    , div [ S.container ]
      [ ul [ S.ul ] (mapWithIndex showMsg model.msgs)
      , div [] [ text ((show $ length model.msgs) <> " messages") ]
      ]
    ]

showMsg :: Int -> C.Msg -> Html Msg
showMsg i msg = li [ S.li, onClick (ClickAt i msg) ] [ text (show msg) ]

next :: Msg -> Model -> (Msg -> Effect Unit) -> Effect Unit
next msg mod h =
  case msg of
    Wrap cmsg -> do
      C.next cmsg mod.cmodel (wrapNextHandler Wrap h)
    ClickAt pos cmsg -> do
       logShow pos
       logShow cmsg


update :: Msg -> Model -> Model
update msg model =
  case msg of
    Wrap m -> model
      { msgs = model.msgs <> [ m ]
      , cmodel = C.update m model.cmodel
      }
    ClickAt i m -> model
      { cmodel = foldr C.update (C.init unit) (take i model.msgs)
      }

-- foldr :: forall a b f. Foldable f => (a -> b -> b) -> b -> f a -> b


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
