scriptName WebView extends SkyrimPlatformConnection

string property WebViewID auto
string property URL auto
int property X auto
int property Y auto
int property Width auto
int property Height auto
bool property IsMenu auto
bool property UseJsonFile auto

event OnSetupWebView()
endEvent

event OnSetup()
    Width = 100
    Height = 100
    ; TODO - default WebViewID based on the Script Name or .esp
    ConnectionName = "WebUI"
    OnSetupWebView()
endEvent

event OnWebViewConnected()
endEvent

event OnConnected()
    if ! UseJsonFile
        string isMenuText = "false"
        if IsMenu
            isMenuText = "true"
        endIf
        string webViewInfo = WebViewID + "|" + URL + "|" + X + "|" + Y + "|" + Width + "|" + Height + "|" + isMenuText
        SendEvent("RegisterWebView", webViewInfo)
    endIf
    OnWebViewConnected()
endEvent

function SetupWebView(string id, string url, int x = 0, int y = 0, int width = 100, int height = 100, bool isMenu = false)
    WebViewID = id
    self.URL = url
    self.X = x
    self.Y = y
    self.Width = width
    self.Height = height
    self.IsMenu = isMenu
endFunction

event OnEvent(string eventName, string data)
    Debug.MessageBox("Sweet, got an event!")
endEvent

function SendEvent(string eventName, string data = "", string target = "", string source = "")
    Send(WebViewID + "::" + eventName, data, target, source)
endFunction

string function FetchData(string query, string data = "", string target = "", string source = "", float waitInterval = 0.5, float timeout = 10.0)
    return Request(WebViewID + "::" + query, data, target, source, waitInterval, timeout)
endFunction

function AddToUI()
    SendEvent("AddToUI")
endFunction

function RemoveFromUI()
    SendEvent("RemoveFromUI")
endFunction

function ToggleUI()
    SendEvent("ToggleUI")
endFunction

;;;;;;;;;;;;;;;

; function Show()
; endFunction

; function Hide()
; endFunction

; function Toggle()
; endFunction
