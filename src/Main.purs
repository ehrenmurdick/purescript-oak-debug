module Main where

import Prelude
  ( Unit
  , unit
  , (+)
  , bind
  , (-)
  , (<>)
  , mempty
  )
import Oak.Html.Events (onClick, onInput)
import Effect (Effect)
import Effect.Console
import Oak.Html.Attribute ( style, value )
import Data.Show (class Show)
import Styles as S
import Oak
  ( App
  , createApp
  , runApp
  )
import Oak.Html (Html, div, text, button, input)
import Debug ( debugApp )
import Oak.Document

type Model =
  { number :: Int
  , message :: String
  }

data Msg
  = Inc
  | Dec
  | Type String

instance showMsg :: Show Msg where
  show msg =
    case msg of
      Inc -> "Inc"
      Dec -> "Dec"
      Type str -> "Type " <> str


view :: Model -> Html Msg
view model =
  div []
    [ div [ style S.big ] [ button [ onClick Inc ] [ text "+" ] ]
    , div [ style S.big ] [ text model.number ]
    , div [ style S.big ] [ button [ onClick Dec ] [ text "-" ] ]
    , div [] [ input [ onInput Type, value model.message ] [] ]
    , div [] [ text model.message ]
    ]

next :: Msg -> Model -> (Msg -> Effect Unit) -> Effect Unit
next msg _ _ = logShow msg

update :: Msg -> Model -> Model
update msg model =
  case msg of
    Inc -> model { number = model.number + 1 }
    Dec -> model { number = model.number - 1 }
    Type str -> model { message = str }


init :: Unit -> Model
init _ =
  { number: 0
  , message: ""
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
  rootNode <- runApp (debugApp app) unit
  container <- getElementById "app"
  appendChildNode container rootNode
