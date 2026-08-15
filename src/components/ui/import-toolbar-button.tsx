'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { importDocx } from '@platejs/docx-io';
import { MarkdownPlugin } from '@platejs/markdown';
import { ArrowUpToLineIcon } from 'lucide-react';
import { getEditorDOMFromHtmlString } from 'platejs/static';
import { useEditorRef } from 'platejs/react';
import { toast } from 'sonner';
import { useFilePicker } from 'use-file-picker';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ToolbarButton } from './toolbar';

type ImportType = 'html' | 'markdown';

export function ImportToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const getFileNodes = (text: string, type: ImportType) => {
    if (type === 'html') {
      const editorNode =
        getEditorDOMFromHtmlString(text) ?? getImportableHtmlElement(text);

      if (!editorNode) {
        toast.error('没有找到可导入的 HTML 内容。');

        return [];
      }

      const nodes = editor.api.html.deserialize({
        element: editorNode,
      });

      return nodes;
    }

    if (type === 'markdown') {
      return editor.getApi(MarkdownPlugin).markdown.deserialize(text);
    }

    return [];
  };

  const { openFilePicker: openMdFilePicker } = useFilePicker({
    accept: ['.md', '.mdx'],
    multiple: false,
    onFilesSelected: async ({ plainFiles }) => {
      const text = await plainFiles[0].text();

      const nodes = getFileNodes(text, 'markdown');

      if (nodes.length === 0) return;

      editor.tf.insertNodes(nodes);
    },
  });

  const { openFilePicker: openHtmlFilePicker } = useFilePicker({
    accept: ['text/html'],
    multiple: false,
    onFilesSelected: async ({ plainFiles }) => {
      const text = await plainFiles[0].text();

      const nodes = getFileNodes(text, 'html');

      if (nodes.length === 0) return;

      editor.tf.insertNodes(nodes);
    },
  });

  const { openFilePicker: openDocxFilePicker } = useFilePicker({
    accept: ['.docx'],
    multiple: false,
    onFilesSelected: async ({ plainFiles }) => {
      const arrayBuffer = await plainFiles[0].arrayBuffer();
      const result = await importDocx(editor, arrayBuffer);

      editor.tf.insertNodes(result.nodes as typeof editor.children);
    },
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Import" isDropdown>
          <ArrowUpToLineIcon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={() => {
              openHtmlFilePicker();
            }}
          >
            Import from HTML
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              openMdFilePicker();
            }}
          >
            Import from Markdown
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              openDocxFilePicker();
            }}
          >
            Import from Word
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getImportableHtmlElement(text: string) {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  const articleContent = doc.getElementById('article-content');

  if (articleContent && !isLoadingPlaceholder(articleContent)) {
    return articleContent;
  }

  doc
    .querySelectorAll(
      'script, style, link, meta, title, svg, button, input, textarea, select, noscript, [hidden], .skeleton, #image-modal, #share-btn',
    )
    .forEach((element) => element.remove());

  const contentCandidate = doc.querySelector(
    'article, main, [role="main"], .article, .post, .content, #article-content',
  );

  if (contentCandidate && !isLoadingPlaceholder(contentCandidate)) {
    return contentCandidate;
  }

  return doc.body.childElementCount > 0 && !isLoadingPlaceholder(doc.body)
    ? doc.body
    : null;
}

function isLoadingPlaceholder(element: Element) {
  const text = element.textContent?.trim() ?? '';

  return /加载中|评论加载中|暂无内容/.test(text);
}
