Time-travel for debugging your Oak applications! You'll be able to see all the
events that have happened in your Oak app, and move forward and backward
through time! Does not repeat Effects, only uses messages and your update
function to recreate the model state at that point in time.

![Time travel!](../assets/demo.gif?raw=true)


Very easy to use, just bower install this module

```sh
bower install purescript-oak-debug
```

Then import it in your Main.purs and wrap your app in `debugApp` from the
`Oak.Debug` module like so:

```purs
import Oak.Debug (debugApp)

main :: Effect Unit
main = do
  rootNode <- runApp (debugApp app) Nothing
  container <- getElementById "app"
  appendChildNode container rootNode
```

Finally, define a `Show` instance for your message type. The excellent
purescript compiler will help you with this part. If you're coming from an
object oriented language, this is like defining a `toString()` method on a
class.

```
import Data.Show ( class Show )

instance showMsg :: Show Msg where
  show msg =
    case msg of
      Inc -> "Inc"
      Dec -> "Dec"
```


If your app sends a message on `runApp`, wrap it in the
`Oak.Debug.DebugMsg` value `Wrap` like so:

```purs
import Oak.Debug (debugApp, DebugMsg(..)) as Debug

main :: Effect Unit
main = do
  let initialMessage = Just $ Debug.Wrap MyMessage
  rootNode <- runApp (Debug.debugApp app) initialMessage
  container <- getElementById "app"
  appendChildNode container rootNode
```

Full example application below:
```purs
module Main (main) where

import Prelude
  ( Unit
  , bind
  , mempty
  , show
  , (<>)
  , (>>>)
  )
import Oak.Html.Events (onClick)
import Oak.Debug ( debugApp )
import Data.Show (class Show)
import Data.Either (Either(..))
import Effect (Effect)
import Oak
  ( runApp
  , App
  , createApp
  )
import Oak.Html
  ( Html
  , div
  , text
  , button
  )
import Oak.Document
  ( appendChildNode
  , getElementById
  )
import Oak.Ajax
  ( get
  , AjaxError
  )


type Model = { message :: String }

type Response = { text :: String }

data Msg
  = Get String
  | GetResult (Either AjaxError Response)


instance showMsg :: Show Msg where
  show msg =
    case msg of
      Get       url -> "Get       " <> url
      GetResult a   -> "GetResult " <> show a

view :: Model -> Html Msg
view model =
  div []
    [ div [] [ button [ onClick (Get "1.json") ] [ text "get 1" ] ]
    , div [] [ button [ onClick (Get "2.json") ] [ text "get 2" ] ]
    , div [] [ button [ onClick (Get "3.json") ] [ text "get 3" ] ]
    , div [] [ text model.message ]
    ]


next :: Msg -> Model -> (Msg -> Effect Unit) -> Effect Unit
next msg mod h =
  case msg of
    GetResult _ -> mempty
    Get url     -> get url (GetResult >>> h)

update :: Msg -> Model -> Model
update msg model =
  case msg of
    Get url                  -> model { message = "getting " <> url <> "..." }
    GetResult (Left e)       -> model { message = show e }
    GetResult (Right result) -> model { message = result.text }


init :: Model
init =
  { message: ""
  }

app :: App Msg Model
app = createApp
  { init: init
  , view: view
  , update: update
  , next: next
  }

main :: Effect Unit
main = do
  rootNode <- runApp (debugApp app) Nothing
  container <- getElementById "app"
  appendChildNode container rootNode
```
