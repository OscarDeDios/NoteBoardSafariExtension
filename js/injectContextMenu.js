document.addEventListener("contextmenu", handleContextMenu, false);

function handleContextMenu(event)
{
    lastRightClickedElement = event.target;

    // Pass the right-clicked element's tag name and the timestamp up to the global page.
    switch (event.target.tagName)
    {
      case "A": safari.self.tab.setContextMenuEventUserInfo(event, { "tagName": "link",  "url": event.target.href});break;
      case "IMG": safari.self.tab.setContextMenuEventUserInfo(event, { "tagName": "image",  "url": event.target.src,});break;
      default: if (window.getSelection() != '')
                  safari.self.tab.setContextMenuEventUserInfo(event, { "tagName": "selection", "selec" : window.getSelection().toString()});
               else
                  safari.self.tab.setContextMenuEventUserInfo(event, { "tagName": "page",  "url": document.URL});
    }
}

