module Oak.Debug where

import Oak

import Prelude hiding (div)

import Data.Array (length, mapWithIndex, take)
import Data.Foldable (foldl)
import Data.FoldableWithIndex (foldMapWithIndex)
import Data.Show (class Show)
import Effect (Effect)
import Oak.Html.Attribute (style)
import Data.Traversable (foldMap)

import Oak.Styles as S

type DebugModel emsg emodel
  = {msgs :: Array emsg, emodel :: emodel, active :: Boolean, view :: emodel -> View emsg, init :: emodel, update :: emsg -> emodel -> emodel, next :: emsg -> emodel -> (emsg -> Effect Unit) -> Effect Unit}

data DebugMsg emsg
  = Wrap emsg
  | ClickAt Int
  | Init
  | Resume

view ::
  forall emsg emodel.
  Show emsg =>
  DebugModel emsg emodel ->
  View (DebugMsg emsg)
view model = div [] do
  if model.active
    then div [style S.overlay, onClick Resume] do
      div [style S.message] do
        text "Messages paused. Click here to resume."
    else text ""
  mapMsg Wrap (model.view model.emodel)
  div [style S.container] do
    div [onClick Init, style S.button] do
      text "init"
    ul [style S.ul] (foldMapWithIndex showMsg model.msgs)
    div [] do
       text ((show $ length model.msgs) <> " messages")

showMsg :: forall emsg. Show emsg => Int -> emsg -> View (DebugMsg emsg)
showMsg i msg = li [style $ S.li <> S.button, onClick (ClickAt i)] do
  span [style S.number] do
    text (show $ i + 1)
  span [] do
    text (show msg)

update ::
  forall emsg emodel.
  DebugMsg emsg ->
  DebugModel emsg emodel ->
  DebugModel emsg emodel
update msg model = case msg of
  Wrap m -> if model.active
    then model
    else model { msgs = model.msgs <> [ m
                                      ], emodel = model.update m model.emodel }
  ClickAt i -> model { active = true, emodel = foldl (flip model.update) model.init (take (i + 1) model.msgs) }
  Init -> model { active = true, emodel = model.init }
  Resume -> model { active = false, emodel = foldl (flip model.update) model.init model.msgs }

next ::
  forall emsg emodel.
  DebugMsg emsg ->
  DebugModel emsg emodel ->
  (DebugMsg emsg -> Effect Unit) ->
  Effect Unit
next msg model h = case msg of
  ClickAt pos -> mempty
  Init -> mempty
  Resume -> mempty
  Wrap cmsg -> do
    model.next cmsg model.emodel (map h Wrap)

debugApp ::
  forall emsg emodel.
  Show emsg =>
  App emsg emodel ->
  App (DebugMsg emsg) (DebugModel emsg emodel)
debugApp child = let bits = unwrapApp child
                 in createApp { init: { view: bits.view
                                      , update: bits.update
                                      , next: bits.next
                                      , emodel: bits.init
                                      , init: bits.init
                                      , msgs: []
                                      , active: false
                                      }
                              , view
                              , update
                              , next
                              }
