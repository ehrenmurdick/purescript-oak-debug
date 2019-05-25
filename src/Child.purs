module Child where

import Prelude
  ( Unit
  , (+)
  , (-)
  , mempty
  )
import Oak.Html.Events (onClick)
import Effect (Effect)
import Effect.Console
import Data.Show (class Show)
import Styles as S
import Oak
  ( App
  , createApp
  )
import Oak.Html (Html, div, text, button)

type Model =
  { number :: Int
  }

data Msg
  = Inc
  | Dec

instance showMsg :: Show Msg where
  show msg =
    case msg of
      Inc -> "Inc"
      Dec -> "Dec"


view :: Model -> Html Msg
view model =
  div []
    [ div [ S.big ] [ button [ onClick Inc ] [ text "+" ] ]
    , div [ S.big ] [ text model.number ]
    , div [ S.big ] [ button [ onClick Dec ] [ text "-" ] ]
    ]

next :: Msg -> Model -> (Msg -> Effect Unit) -> Effect Unit
next msg _ _ = logShow msg

update :: Msg -> Model -> Model
update msg model =
  case msg of
    Inc -> model { number = model.number + 1 }
    Dec -> model { number = model.number - 1 }


init :: Unit -> Model
init _ =
  { number: 0
  }

app :: App Model Msg Unit
app = createApp
  { init: init
  , view: view
  , update: update
  , next: next
  }
