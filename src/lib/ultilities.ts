import { SelectChangeEvent } from "@mui/material";
import React, { ChangeEvent } from "react";

export function handleChangeSelect<T>(
    event: SelectChangeEvent, 
    setState: React.Dispatch<React.SetStateAction<T>>
){
    const {name, value} = event.target
    if(!name) return
    setState(prev => ({
        ...prev,
        [name]: value
    }))
}

export function handleChangeInput<T>(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<T>>
){
    const {name, value} = event.target
    setState(prev => ({
        ...prev,
        [name]: value
    }))
}

export function getTextSelectionOffset(container: HTMLElement): [number, number] | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) {
    return null;
  }

  let start = 0;
  let end = 0;
  let foundStart = false;

  function traverse(node: Node) {
    if (node === range.startContainer) {
      foundStart = true;
      start += range.startOffset;
    } else if (!foundStart) {
      if (node.nodeType === Node.TEXT_NODE) {
        start += node.textContent?.length || 0;
      }
    }

    if (node === range.endContainer) {
      end = start + range.endOffset - (foundStart ? range.startOffset : 0);
      return true; // stop traversal
    }

    for (let child = node.firstChild; child; child = child.nextSibling) {
      if (traverse(child)) return true;
    }

    return false;
  }

  traverse(container);
  return [start, end];
}


