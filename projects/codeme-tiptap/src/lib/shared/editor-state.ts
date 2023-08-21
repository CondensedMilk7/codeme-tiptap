import { Editor } from '@tiptap/core';

abstract class CdmEditorState {
  abstract applyHeading: (editor: Editor) => void;
}
