import XMonad hiding ( (|||) )
import XMonad.Hooks.EwmhDesktops
import XMonad.Layout.Minimize
import XMonad.Actions.GridSelect
import XMonad.Hooks.ICCCMFocus
import XMonad.Hooks.ManageHelpers
import XMonad.Hooks.UrgencyHook
import XMonad.Hooks.SetWMName
import XMonad.Hooks.DynamicLog
import XMonad.Hooks.ManageDocks
import XMonad.Util.Run(spawnPipe)
import XMonad.Util.EZConfig(additionalKeys)
--import XMonad.Layout.ToggleLayouts
import XMonad.Layout.Spiral
import XMonad.Layout.Tabbed
import XMonad.Layout.StackTile
import XMonad.Layout.SubLayouts
import XMonad.Layout.ThreeColumns
import XMonad.Layout.Square
import XMonad.Layout.Combo
import XMonad.Layout.MultiToggle
import XMonad.Layout.MosaicAlt
import XMonad.Layout.TwoPane
import XMonad.Layout.WindowNavigation
import XMonad.Actions.WindowNavigation
import XMonad.Layout.LayoutCombinators
import XMonad.Layout.PerWorkspace
--import XMonad.Layout.Magnifier
import XMonad.Layout.BoringWindows
import XMonad.Actions.CycleWindows
import XMonad.Layout.LayoutScreens
import XMonad.Hooks.DynamicLog
import System.IO
import XMonad.Layout.Reflect
import XMonad.Layout.Grid
import Data.Ratio ((%))
import XMonad.Layout.ResizableTile
import XMonad.Actions.TagWindows
import XMonad.Prompt
import XMonad.Actions.CycleWS
import qualified XMonad.StackSet as W
import qualified Data.Map as M
import System.Process

normalLayout = mkToggle (single REFLECTX) $
               mkToggle (single REFLECTY) $
               subTabbed $
               boringWindows $
               windowNavigation $ minimize $ avoidStruts $ (tiled ||| spiral (6/7) ||| tabbed shrinkText defaultTheme ||| Full ||| Mirror tiled ||| TwoPane (3/100) (1/2) ||| MosaicAlt M.empty ||| StackTile 1 (3/100) (1/2) ||| ThreeCol 1 (3/100) (1/2) )

tiled = ResizableTall nmaster delta ratio []
    where
        nmaster = 1
        delta = 3/100
        ratio = 1/2

myLayout = normalLayout

--myKeys :: String -> XConfig Layout -> M.Map (KeyMask, KeySym) (X ())
--myKeys hostname conf@(XConfig {XMonad.modMask = mod1Mask}) = M.fromList $

myModMask = mod4Mask

startup :: X ()
startup = do
    spawn "/home/josiah/start.sh"

main = do
    xmproc <- spawnPipe "xmobar"
    xmonad $ ewmh defaultConfig
	{ terminal  = "lxterminal"
    , modMask = mod4Mask
	, borderWidth = 1
	, manageHook = manageDocks <+> manageHook defaultConfig
	, layoutHook = myLayout
    , handleEventHook = handleEventHook defaultConfig <+> fullscreenEventHook
	, logHook = takeTopFocus >> dynamicLogWithPP xmobarPP
		{ ppOutput = hPutStrLn xmproc
		 , ppTitle = xmobarColor "green" "" . shorten 50
		 , ppUrgent = xmobarColor "yellow" "red" . xmobarStrip
        }
	, startupHook = startup
        } `additionalKeys`
	[ -- application shortcuts --
     ((myModMask, xK_e), spawn "pcmanfm")
	  ,((myModMask .|. shiftMask, xK_m), sendMessage RestoreNextMinimizedWin)
	  , ((myModMask, xK_g), goToSelected defaultGSConfig)
-- Window Management and Navigation--
      , ((myModMask, xK_x), kill)
      , ((myModMask .|. controlMask, xK_h), sendMessage $ pullGroup L)
      , ((myModMask .|. controlMask, xK_s), sendMessage $ pullGroup R)
      , ((myModMask .|. controlMask, xK_n), sendMessage $ pullGroup U)
      , ((myModMask .|. controlMask, xK_t), sendMessage $ pullGroup D)

      , ((myModMask .|. controlMask, xK_m), withFocused (sendMessage . MergeAll))
      , ((myModMask .|. controlMask, xK_u), withFocused (sendMessage . UnMerge))

      , ((myModMask, xK_Left), onGroup W.focusDown')
      , ((myModMask, xK_Right), onGroup W.focusUp')

      , ((myModMask .|. controlMask, xK_period), onGroup W.focusUp')
      , ((myModMask .|. controlMask, xK_comma), onGroup W.focusDown')
	  --, ((myModMask, xK_Down), withFocused minimizeWindow)
      , ((myModMask, xK_Up), rotUnfocusedUp)
      , ((myModMask, xK_Down), rotUnfocusedDown)
      , ((myModMask .|. shiftMask, xK_Up), rotFocusedUp)
      , ((myModMask .|. shiftMask, xK_Down), rotFocusedDown)
	  , ((myModMask, xK_b), sendMessage ToggleStruts)
	  , ((myModMask .|. shiftMask, xK_h), sendMessage MirrorShrink)
	  , ((myModMask .|. shiftMask, xK_s), sendMessage MirrorExpand)
      , ((myModMask, xK_h), sendMessage Shrink)
      , ((myModMask, xK_s), sendMessage Expand)
   	  , ((myModMask .|. shiftMask, xK_period),  windows W.swapUp)
      , ((myModMask .|. shiftMask, xK_comma), windows W.swapDown)
      , ((myModMask, xK_period), focusUp)
      , ((myModMask, xK_comma), focusDown)
      , ((myModMask, xK_Return), windows W.swapMaster)
      , ((myModMask, xK_m), windows W.focusMaster)
      , ((mod1Mask, xK_period), sendMessage (IncMasterN 1))
      , ((mod1Mask, xK_comma), sendMessage (IncMasterN (-1)))
      , ((myModMask, xK_y),prevScreen)
      , ((myModMask, xK_f), nextScreen)
      , ((myModMask .|. shiftMask, xK_y), shiftPrevScreen)
      , ((myModMask .|. shiftMask, xK_f), shiftNextScreen)
   	  , ((myModMask, xK_y), nextScreen)
   	  , ((myModMask,               xK_z),     toggleWS)
-- tagging --
   	  --, ((mod1Mask,                 xK_f  ), withFocused (addTag "abc"))
   	  --, ((mod1Mask .|. controlMask, xK_f  ), withFocused (delTag "abc"))
   	  --, ((mod1Mask .|. shiftMask,   xK_f  ), withTaggedGlobalP "abc" W.sink)
   	  --, ((mod4Mask,                 xK_d  ), withTaggedP "abc" (W.shiftWin "2"))
   	  --, ((mod4Mask .|. shiftMask,   xK_d  ), withTaggedGlobalP "abc" shiftHere)
   	  --, ((mod4Mask .|. controlMask, xK_d  ), focusUpTaggedGlobal "abc")
   	  , ((myModMask,                 xK_c  ), tagPrompt defaultXPConfig (\s -> withFocused (addTag s)))
   	  , ((myModMask .|. controlMask, xK_c  ), tagDelPrompt defaultXPConfig)
   	  , ((myModMask .|. shiftMask,   xK_c  ), tagPrompt defaultXPConfig (\s -> withTaggedGlobal s float))
   	  , ((myModMask,                xK_r  ), tagPrompt defaultXPConfig (\s -> withTaggedP s (W.shiftWin "9")))
   	  , ((myModMask .|. shiftMask,  xK_r  ), tagPrompt defaultXPConfig (\s -> withTaggedGlobalP s shiftHere))
   	  , ((myModMask .|. controlMask, xK_r ), tagPrompt defaultXPConfig (\s -> focusUpTaggedGlobal s)) 
-- keyboard layout --
	  , ((mod1Mask .|. shiftMask, xK_d), spawn "setxkbmap -layout dvorak")
      , ((mod1Mask .|. shiftMask, xK_u), spawn "setxkbmap -layout us")
-- layout switching --
      , ((myModMask, xK_BackSpace), sendMessage $ Toggle REFLECTX)
      , ((myModMask, xK_Delete), sendMessage $ Toggle REFLECTY)
      , ((mod1Mask, xK_1), sendMessage $ JumpToLayout "Full")
      , ((mod1Mask, xK_2), sendMessage $ JumpToLayout "ResizableTall")
      , ((mod1Mask, xK_3), sendMessage $ JumpToLayout "Mirror ResizableTall")
      , ((mod1Mask, xK_4), sendMessage $ JumpToLayout "Spiral")
      , ((mod1Mask, xK_5), sendMessage $ JumpToLayout "TwoPane")
      , ((mod1Mask, xK_6), sendMessage $ JumpToLayout "MosaicAlt")
      , ((mod1Mask, xK_7), sendMessage $ JumpToLayout "StackTile")
      , ((mod1Mask, xK_8), sendMessage $ JumpToLayout "ThreeCol")
     -- , ((mod1Mask, xK_9), sendMessage $ JumpToLayout "Square")
-- logging out
      , ((myModMask .|. shiftMask, xK_q), spawn "lxsession-default quit")
	]

-- | Finally, a copy of the default bindings in simple textual tabular format.
help :: String
help = unlines ["The default modifier key is 'alt'. Default keybindings:",
    "",
    "-- launching and killing programs",
    "mod-Shift-Enter  Launch xterminal",
    "mod-p            Launch dmenu",
    "mod-Shift-p      Launch gmrun",
    "mod-Shift-c      Close/kill the focused window",
    "mod-Space        Rotate through the available layout algorithms",
    "mod-Shift-Space  Reset the layouts on the current workSpace to default",
    "mod-n            Resize/refresh viewed windows to the correct size",
    "",
    "-- move focus up or down the window stack",
    "mod-Tab        Move focus to the next window",
    "mod-Shift-Tab  Move focus to the previous window",
    "mod-j          Move focus to the next window",
    "mod-k          Move focus to the previous window",
    "mod-m          Move focus to the master window",
    "",
    "-- modifying the window order",
    "mod-Return   Swap the focused window and the master window",
    "mod-Shift-j  Swap the focused window with the next window",
    "mod-Shift-k  Swap the focused window with the previous window",
    "",
    "-- resizing the master/slave ratio",
    "mod-h  Shrink the master area",
    "mod-l  Expand the master area",
    "",
    "-- floating layer support",
    "mod-t  Push window back into tiling; unfloat and re-tile it",
    "",
    "-- increase or decrease number of windows in the master area",
    "mod-comma  (mod-,)   Increment the number of windows in the master area",
    "mod-period (mod-.)   Deincrement the number of windows in the master area",
    "",
    "-- quit, or restart",
    "mod-Shift-q  Quit xmonad",
    "mod-q        Restart xmonad",
    "mod-[1..9]   Switch to workSpace N",
    "",
    "-- Workspaces & screens",
    "mod-Shift-[1..9]   Move client to workspace N",
    "mod-{w,e,r}        Switch to physical/Xinerama screens 1, 2, or 3",
    "mod-Shift-{w,e,r}  Move client to screen 1, 2, or 3",
    "",
    "-- Mouse bindings: default actions bound to mouse events",
    "mod-button1  Set the window to floating mode and move by dragging",
    "mod-button2  Raise the window to the top of the stack",
    "mod-button3  Set the window to floating mode and resize by dragging"]
 


